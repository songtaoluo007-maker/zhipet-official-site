import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { Writable } from 'node:stream'
import { pathToFileURL } from 'node:url'

import { describe, expect, it, vi } from 'vitest'

import {
  executeFeedbackCommand,
  getOperationsStatus,
  parseFeedbackCommand,
  resolveFeedbackTransition,
} from '../../scripts/lib/feedback-operations.mjs'
import { createJsonLineWriter } from '../../scripts/lib/cli-output.mjs'
import { runFeedbackOperationsCli } from '../../scripts/manage-feedback.mjs'
import { runOperationsStatusCli } from '../../scripts/operations-status.mjs'

const attachRedactionTransaction = <T extends object>(
  feedback: T,
  {
    remainingOutboxStatus = null,
    deletedCount = 1,
  }: {
    remainingOutboxStatus?: string | null
    deletedCount?: number
  } = {},
) => {
  const emailOutbox = {
    deleteMany: vi.fn().mockResolvedValue({ count: deletedCount }),
    findUnique: vi
      .fn()
      .mockResolvedValue(
        remainingOutboxStatus ? { status: remainingOutboxStatus } : null,
      ),
  }
  const transactionClient = { feedback, emailOutbox }
  const $transaction = vi.fn(
    async (
      operation: (client: typeof transactionClient) => Promise<unknown>,
    ) => operation(transactionClient),
  )

  return { emailOutbox, $transaction }
}

describe('feedback operations', () => {
  it('parses only strict metadata-only list commands', () => {
    expect(parseFeedbackCommand(['list', '--limit', '20'])).toEqual({
      kind: 'list',
      limit: 20,
    })
    expect(parseFeedbackCommand(['list'])).toEqual({ kind: 'list', limit: 20 })

    for (const input of [
      ['list', '--limit'],
      ['list', '--limit', '0'],
      ['list', '--limit', '101'],
      ['list', '--limit', '2.5'],
      ['list', '--unknown', '20'],
      ['list', '--limit', '20', 'extra'],
      ['unknown'],
    ]) {
      expect(() => parseFeedbackCommand(input)).toThrow()
    }
  })

  it('requires complete, safe commands and terminal status for contact redaction', () => {
    expect(() => parseFeedbackCommand(['show'])).toThrow('Feedback ID is required')
    expect(() => parseFeedbackCommand(['show', '../feedback'])).toThrow('Feedback ID is invalid')
    expect(() => parseFeedbackCommand(['show', 'feedback_123', 'extra'])).toThrow()
    expect(() => parseFeedbackCommand(['set-status', 'feedback_123'])).toThrow()
    expect(() => parseFeedbackCommand(['set-status', 'feedback_123', 'pending'])).toThrow()
    expect(() =>
      parseFeedbackCommand([
        'set-status',
        'feedback_123',
        'reviewing',
        '--redact-contact',
      ]),
    ).toThrow('Contact can be redacted only for a terminal status')

    expect(
      parseFeedbackCommand([
        'set-status',
        'feedback_123',
        'closed',
        '--redact-contact',
      ]),
    ).toEqual({
      kind: 'set-status',
      id: 'feedback_123',
      status: 'CLOSED',
      redactContact: true,
    })
  })

  it('allows review and terminal transitions but not reopening terminal feedback', () => {
    expect(resolveFeedbackTransition('PENDING', 'reviewing')).toEqual({
      status: 'REVIEWING',
      handledAt: null,
    })
    expect(resolveFeedbackTransition('REVIEWING', 'closed')).toEqual({
      status: 'CLOSED',
      handledAt: expect.any(Date),
    })
    expect(() => resolveFeedbackTransition('CLOSED', 'reviewing')).toThrow(
      'Closed feedback cannot be reopened',
    )
    expect(() => resolveFeedbackTransition('INVALID', 'closed')).toThrow(
      'Invalid feedback cannot be reopened',
    )
  })

  it('selects only metadata for list and summary operations', async () => {
    const prisma = {
      feedback: {
        findMany: vi.fn().mockResolvedValue([]),
        groupBy: vi.fn().mockResolvedValue([{ status: 'PENDING', _count: { _all: 2 } }]),
        count: vi.fn().mockResolvedValue(0),
      },
    }

    await executeFeedbackCommand({
      prisma,
      command: parseFeedbackCommand(['list', '--limit', '20']),
    })
    expect(prisma.feedback.findMany).toHaveBeenCalledWith({
      where: { status: 'PENDING' },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        category: true,
        status: true,
        createdAt: true,
        handledAt: true,
      },
      take: 20,
    })

    await executeFeedbackCommand({
      prisma,
      command: parseFeedbackCommand(['summary']),
      now: () => new Date('2026-07-28T00:00:00.000Z'),
    })
    expect(prisma.feedback.groupBy).toHaveBeenCalledWith({
      by: ['status'],
      _count: { _all: true },
    })
    expect(prisma.feedback.count).toHaveBeenCalledTimes(3)
  })

  it('allows message and contact only for a specific show command', async () => {
    const prisma = {
      feedback: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    }

    await executeFeedbackCommand({
      prisma,
      command: parseFeedbackCommand(['show', 'feedback_123']),
    })

    expect(prisma.feedback.findUnique).toHaveBeenCalledWith({
      where: { id: 'feedback_123' },
      select: {
        id: true,
        category: true,
        status: true,
        createdAt: true,
        handledAt: true,
        message: true,
        contact: true,
      },
    })
  })

  it('updates once with the current status guard and redacts only terminal feedback', async () => {
    const feedback = {
      findUnique: vi.fn().mockResolvedValue({ status: 'REVIEWING' }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    }
    const transaction = attachRedactionTransaction(feedback)
    const prisma = {
      feedback,
      ...transaction,
    }

    const result = await executeFeedbackCommand({
      prisma,
      command: parseFeedbackCommand([
        'set-status',
        'feedback_123',
        'closed',
        '--redact-contact',
      ]),
      now: () => new Date('2026-07-28T00:00:00.000Z'),
    })

    expect(prisma.feedback.updateMany).toHaveBeenCalledWith({
      where: { id: 'feedback_123', status: 'REVIEWING' },
      data: {
        status: 'CLOSED',
        handledAt: new Date('2026-07-28T00:00:00.000Z'),
        contact: null,
      },
    })
    expect(result).toEqual({
      id: 'feedback_123',
      status: 'CLOSED',
      redactedContact: true,
    })
    expect(prisma.$transaction).toHaveBeenCalledOnce()
    expect(transaction.emailOutbox.deleteMany).toHaveBeenCalledWith({
      where: {
        deduplicationKey: 'feedback:feedback_123',
        status: { in: ['PENDING', 'FAILED'] },
      },
    })
    expect(transaction.emailOutbox.findUnique).toHaveBeenCalledWith({
      where: { deduplicationKey: 'feedback:feedback_123' },
      select: { status: true },
    })
  })

  it('refuses contact redaction while the notification is being delivered', async () => {
    const feedback = {
      findUnique: vi.fn().mockResolvedValue({ status: 'REVIEWING' }),
      updateMany: vi.fn(),
    }
    const transaction = attachRedactionTransaction(feedback, {
      remainingOutboxStatus: 'PROCESSING',
      deletedCount: 0,
    })
    const prisma = {
      feedback,
      ...transaction,
    }

    await expect(
      executeFeedbackCommand({
        prisma,
        command: parseFeedbackCommand([
          'set-status',
          'feedback_123',
          'closed',
          '--redact-contact',
        ]),
      }),
    ).rejects.toThrow('Feedback notification is currently being delivered')

    expect(feedback.updateMany).not.toHaveBeenCalled()
  })

  it('allows contact redaction after a sent notification has been scrubbed', async () => {
    const feedback = {
      findUnique: vi.fn().mockResolvedValue({ status: 'REVIEWING' }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    }
    const transaction = attachRedactionTransaction(feedback, {
      remainingOutboxStatus: 'SENT',
      deletedCount: 0,
    })
    const prisma = {
      feedback,
      ...transaction,
    }

    await expect(
      executeFeedbackCommand({
        prisma,
        command: parseFeedbackCommand([
          'set-status',
          'feedback_123',
          'closed',
          '--redact-contact',
        ]),
      }),
    ).resolves.toMatchObject({
      status: 'CLOSED',
      redactedContact: true,
    })

    expect(feedback.updateMany).toHaveBeenCalledOnce()
  })

  it.each(['CLOSED', 'INVALID'])(
    'redacts already %s feedback without changing terminal metadata',
    async (terminalStatus) => {
      const handledAt = new Date('2026-07-27T12:00:00.000Z')
      const feedback = {
        findUnique: vi.fn().mockResolvedValue({
          status: terminalStatus,
          handledAt,
        }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      }
      const prisma = {
        feedback,
        ...attachRedactionTransaction(feedback),
      }

      const result = await executeFeedbackCommand({
        prisma,
        command: parseFeedbackCommand([
          'set-status',
          'feedback_123',
          terminalStatus.toLowerCase(),
          '--redact-contact',
        ]),
        now: () => new Date('2026-07-28T00:00:00.000Z'),
      })

      expect(prisma.feedback.updateMany).toHaveBeenCalledWith({
        where: { id: 'feedback_123', status: terminalStatus },
        data: { contact: null },
      })
      expect(result).toEqual({
        id: 'feedback_123',
        status: terminalStatus,
        redactedContact: true,
      })
    },
  )

  it('keeps repeated terminal contact redaction idempotent', async () => {
    const feedback = {
      findUnique: vi.fn().mockResolvedValue({ status: 'CLOSED' }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    }
    const prisma = {
      feedback,
      ...attachRedactionTransaction(feedback),
    }
    const command = parseFeedbackCommand([
      'set-status',
      'feedback_123',
      'closed',
      '--redact-contact',
    ])

    await executeFeedbackCommand({ prisma, command })
    await executeFeedbackCommand({ prisma, command })

    expect(prisma.feedback.updateMany).toHaveBeenCalledTimes(2)
    expect(prisma.feedback.updateMany).toHaveBeenNthCalledWith(1, {
      where: { id: 'feedback_123', status: 'CLOSED' },
      data: { contact: null },
    })
    expect(prisma.feedback.updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: 'feedback_123', status: 'CLOSED' },
      data: { contact: null },
    })
  })

  it('rejects terminal cross-status changes and reopening', async () => {
    const prisma = {
      feedback: {
        findUnique: vi.fn().mockResolvedValue({ status: 'CLOSED' }),
        updateMany: vi.fn(),
      },
    }

    await expect(
      executeFeedbackCommand({
        prisma,
        command: parseFeedbackCommand([
          'set-status',
          'feedback_123',
          'invalid',
          '--redact-contact',
        ]),
      }),
    ).rejects.toThrow('Closed feedback cannot be reopened')
    await expect(
      executeFeedbackCommand({
        prisma,
        command: parseFeedbackCommand([
          'set-status',
          'feedback_123',
          'reviewing',
        ]),
      }),
    ).rejects.toThrow('Closed feedback cannot be reopened')
    expect(prisma.feedback.updateMany).not.toHaveBeenCalled()
  })

  it('rejects the symmetric invalid-to-closed terminal transition', async () => {
    const prisma = {
      feedback: {
        findUnique: vi.fn().mockResolvedValue({ status: 'INVALID' }),
        updateMany: vi.fn(),
      },
    }

    await expect(
      executeFeedbackCommand({
        prisma,
        command: parseFeedbackCommand([
          'set-status',
          'feedback_123',
          'closed',
          '--redact-contact',
        ]),
      }),
    ).rejects.toThrow('Invalid feedback cannot be reopened')
    expect(prisma.feedback.updateMany).not.toHaveBeenCalled()
  })

  it('reports a bounded conflict when the guarded update loses a race', async () => {
    const feedback = {
      findUnique: vi.fn().mockResolvedValue({ status: 'REVIEWING' }),
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    }
    const prisma = {
      feedback,
      ...attachRedactionTransaction(feedback),
    }

    await expect(
      executeFeedbackCommand({
        prisma,
        command: parseFeedbackCommand([
          'set-status',
          'feedback_123',
          'closed',
          '--redact-contact',
        ]),
      }),
    ).rejects.toThrow('Feedback status changed before update')
  })

  it('reports a bounded conflict when terminal contact redaction loses a race', async () => {
    const feedback = {
      findUnique: vi.fn().mockResolvedValue({ status: 'CLOSED' }),
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    }
    const prisma = {
      feedback,
      ...attachRedactionTransaction(feedback),
    }

    await expect(
      executeFeedbackCommand({
        prisma,
        command: parseFeedbackCommand([
          'set-status',
          'feedback_123',
          'closed',
          '--redact-contact',
        ]),
      }),
    ).rejects.toThrow('Feedback status changed before update')
  })

  it('does not redact contacts when a caller bypasses the command parser', async () => {
    const prisma = {
      feedback: {
        findUnique: vi.fn().mockResolvedValue({ status: 'PENDING' }),
        updateMany: vi.fn(),
      },
    }

    await expect(
      executeFeedbackCommand({
        prisma,
        command: {
          kind: 'set-status',
          id: 'feedback_123',
          status: 'REVIEWING',
          redactContact: true,
        },
      }),
    ).rejects.toThrow('Contact can be redacted only for a terminal status')
    expect(prisma.feedback.updateMany).not.toHaveBeenCalled()
  })

  it('returns a non-sensitive operations status', async () => {
    const prisma = {
      $connect: vi.fn().mockResolvedValue(undefined),
      $disconnect: vi.fn().mockResolvedValue(undefined),
      feedback: {
        groupBy: vi.fn().mockResolvedValue([{ status: 'PENDING', _count: { _all: 3 } }]),
      },
      emailOutbox: {
        groupBy: vi.fn().mockResolvedValue([{ status: 'PENDING', _count: { _all: 2 } }]),
        findFirst: vi.fn().mockResolvedValue({ createdAt: new Date('2026-07-27T23:59:30.000Z') }),
      },
    }

    const status = await getOperationsStatus({
      prisma,
      now: () => new Date('2026-07-28T00:00:00.000Z'),
    })

    expect(status).toEqual({
      timestamp: '2026-07-28T00:00:00.000Z',
      databaseConnected: true,
      feedbackPending: 3,
      feedbackReviewing: 0,
      feedbackInvalid: 0,
      feedbackClosed: 0,
      emailOutboxPending: 2,
      emailOutboxProcessing: 0,
      emailOutboxSent: 0,
      emailOutboxFailed: 0,
      oldestPendingEmailAgeSeconds: 30,
    })
    expect(prisma.emailOutbox.findFirst).toHaveBeenCalledWith({
      where: { status: 'PENDING' },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: { createdAt: true },
    })

    const output: unknown[] = []
    const exitCode = await runOperationsStatusCli({
      prisma,
      releaseSha: 'c35adf55d27ea17e24a945f95f124677e3362d54',
      now: () => new Date('2026-07-28T00:00:00.000Z'),
      writeOutput: (value: unknown) => output.push(value),
    })

    expect(exitCode).toBe(0)
    expect(output).toEqual([
      {
        timestamp: '2026-07-28T00:00:00.000Z',
        service: 'zhipet-operations',
        type: 'operations_status',
        status: 'ok',
        release: 'c35adf55d27e',
        databaseConnected: true,
        feedbackPending: 3,
        feedbackReviewing: 0,
        feedbackInvalid: 0,
        feedbackClosed: 0,
        emailOutboxPending: 2,
        emailOutboxProcessing: 0,
        emailOutboxSent: 0,
        emailOutboxFailed: 0,
        oldestPendingEmailAgeSeconds: 30,
      },
    ])
  })

  it('disconnects CLIs and emits fixed errors without leaking database details', async () => {
    const feedbackPrisma = {
      $disconnect: vi.fn().mockResolvedValue(undefined),
    }
    const feedbackOutput: unknown[] = []
    const feedbackExitCode = await runFeedbackOperationsCli({
      argumentsList: ['show', '../sensitive'],
      prisma: feedbackPrisma,
      writeOutput: (value: unknown) => feedbackOutput.push(value),
    })

    const statusPrisma = {
      $connect: vi.fn().mockRejectedValue(new Error('postgres://secret@host')),
      $disconnect: vi.fn().mockResolvedValue(undefined),
    }
    const statusOutput: unknown[] = []
    const statusExitCode = await runOperationsStatusCli({
      prisma: statusPrisma,
      releaseSha: 'c35adf55d27ea17e24a945f95f124677e3362d54',
      now: () => new Date('2026-07-28T00:00:00.000Z'),
      writeOutput: (value: unknown) => statusOutput.push(value),
    })

    expect(feedbackExitCode).toBe(1)
    expect(feedbackPrisma.$disconnect).toHaveBeenCalledOnce()
    expect(feedbackOutput).toEqual([{ errorCode: 'FEEDBACK_OPERATIONS_FAILED' }])
    expect(statusExitCode).toBe(1)
    expect(statusPrisma.$disconnect).toHaveBeenCalledOnce()
    expect(statusOutput).toEqual([
      {
        timestamp: '2026-07-28T00:00:00.000Z',
        service: 'zhipet-operations',
        type: 'operations_status',
        status: 'failed',
        release: 'c35adf55d27e',
        databaseConnected: false,
        errorCode: 'OPERATIONS_STATUS_FAILED',
      },
    ])
    expect(JSON.stringify(statusOutput)).not.toContain('postgres')
  })

  it('emits one bounded cleanup error after a successful feedback read', async () => {
    const prisma = {
      feedback: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'feedback_123',
          category: 'GENERAL',
          status: 'PENDING',
          createdAt: new Date('2026-07-28T00:00:00.000Z'),
          handledAt: null,
          message: 'private message',
          contact: 'secret@example.com',
        }),
      },
      $disconnect: vi.fn().mockRejectedValue(new Error('postgres://secret@host')),
    }
    const output: unknown[] = []

    const exitCode = await runFeedbackOperationsCli({
      argumentsList: ['show', 'feedback_123'],
      prisma,
      writeOutput: (value: unknown) => output.push(value),
    })

    expect(exitCode).toBe(1)
    expect(output).toEqual([
      {
        errorCode: 'FEEDBACK_OPERATIONS_CLEANUP_FAILED',
        operationApplied: false,
      },
    ])
    expect(JSON.stringify(output)).not.toContain('private message')
    expect(JSON.stringify(output)).not.toContain('secret@example.com')
    expect(JSON.stringify(output)).not.toContain('postgres')
  })

  it('uses exit code 2 when a status write succeeds but cleanup fails', async () => {
    const feedback = {
      findUnique: vi.fn().mockResolvedValue({ status: 'REVIEWING' }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    }
    const prisma = {
      feedback,
      ...attachRedactionTransaction(feedback),
      $disconnect: vi.fn().mockRejectedValue(new Error('database secret')),
    }
    const output: unknown[] = []

    const exitCode = await runFeedbackOperationsCli({
      argumentsList: [
        'set-status',
        'feedback_123',
        'closed',
        '--redact-contact',
      ],
      prisma,
      writeOutput: (value: unknown) => output.push(value),
    })

    expect(exitCode).toBe(2)
    expect(output).toEqual([
      {
        errorCode: 'FEEDBACK_OPERATIONS_CLEANUP_FAILED',
        operationApplied: true,
      },
    ])
    expect(JSON.stringify(output)).not.toContain('database secret')
  })

  it.each([
    {
      name: 'parse failure',
      scenario: 'parse-failure',
      expectedExitCode: 1,
      expectedOperationApplied: false,
      expectedUpdateCalls: 0,
    },
    {
      name: 'Prisma initialization failure',
      scenario: 'prisma-initialization-failure',
      expectedExitCode: 1,
      expectedOperationApplied: false,
      expectedUpdateCalls: 0,
    },
    {
      name: 'feedback read failure',
      scenario: 'read-failure',
      expectedExitCode: 1,
      expectedOperationApplied: false,
      expectedUpdateCalls: 0,
    },
    {
      name: 'feedback not found',
      scenario: 'not-found',
      expectedExitCode: 1,
      expectedOperationApplied: false,
      expectedUpdateCalls: 0,
    },
    {
      name: 'terminal transition refusal',
      scenario: 'terminal-refusal',
      expectedExitCode: 1,
      expectedOperationApplied: false,
      expectedUpdateCalls: 0,
    },
    {
      name: 'fulfilled guarded update count zero',
      scenario: 'count-zero',
      expectedExitCode: 1,
      expectedOperationApplied: false,
      expectedUpdateCalls: 1,
    },
    {
      name: 'fulfilled same-terminal redaction count zero',
      scenario: 'same-terminal-count-zero',
      expectedExitCode: 1,
      expectedOperationApplied: false,
      expectedUpdateCalls: 1,
    },
    {
      name: 'synchronous guarded update throw',
      scenario: 'synchronous-update-throw',
      expectedExitCode: 1,
      expectedOperationApplied: false,
      expectedUpdateCalls: 1,
    },
    {
      name: 'guarded update Promise rejection',
      scenario: 'update-rejection',
      expectedExitCode: 3,
      expectedOperationApplied: 'unknown',
      expectedUpdateCalls: 1,
    },
  ])(
    'reports the set-status write stage for $name',
    async ({
      scenario,
      expectedExitCode,
      expectedOperationApplied,
      expectedUpdateCalls,
    }) => {
      const marker = 'database-sensitive-marker'
      const findUnique = vi.fn().mockResolvedValue({ status: 'REVIEWING' })
      const updateMany = vi.fn().mockResolvedValue({ count: 1 })
      const feedback = { findUnique, updateMany }
      const prisma = {
        feedback,
        ...attachRedactionTransaction(feedback),
        $disconnect: vi.fn().mockResolvedValue(undefined),
      }
      let argumentsList = ['set-status', 'feedback_123', 'closed']
      let injectedPrisma:
        | typeof prisma
        | undefined = prisma
      let createPrisma:
        | (() => typeof prisma)
        | undefined

      if (scenario === 'parse-failure') {
        argumentsList = ['set-status', 'feedback_123']
      } else if (scenario === 'prisma-initialization-failure') {
        injectedPrisma = undefined
        createPrisma = () => {
          throw new Error(marker)
        }
      } else if (scenario === 'read-failure') {
        findUnique.mockRejectedValue(new Error(marker))
      } else if (scenario === 'not-found') {
        findUnique.mockResolvedValue(null)
      } else if (scenario === 'terminal-refusal') {
        findUnique.mockResolvedValue({ status: 'CLOSED' })
        argumentsList = ['set-status', 'feedback_123', 'reviewing']
      } else if (scenario === 'count-zero') {
        updateMany.mockResolvedValue({ count: 0 })
      } else if (scenario === 'same-terminal-count-zero') {
        findUnique.mockResolvedValue({ status: 'CLOSED' })
        updateMany.mockResolvedValue({ count: 0 })
        argumentsList = [
          'set-status',
          'feedback_123',
          'closed',
          '--redact-contact',
        ]
      } else if (scenario === 'synchronous-update-throw') {
        updateMany.mockImplementation(() => {
          throw new Error(marker)
        })
      } else if (scenario === 'update-rejection') {
        updateMany.mockRejectedValue(new Error(marker))
      }

      const output: unknown[] = []
      const exitCode = await runFeedbackOperationsCli({
        argumentsList,
        prisma: injectedPrisma,
        createPrisma,
        writeOutput: (value: unknown) => output.push(value),
      })

      expect(exitCode).toBe(expectedExitCode)
      expect(output).toEqual([
        expectedOperationApplied === 'unknown'
          ? {
              errorCode: 'FEEDBACK_OPERATIONS_WRITE_UNKNOWN',
              operationApplied: 'unknown',
            }
          : {
              errorCode: 'FEEDBACK_OPERATIONS_FAILED',
              operationApplied: false,
            },
      ])
      expect(updateMany).toHaveBeenCalledTimes(expectedUpdateCalls)
      expect(JSON.stringify(output)).not.toContain(marker)
    },
  )

  it.each([
    {
      name: 'synchronous output throw',
      writeOutput: () => {
        throw new Error('stdout-sensitive-marker')
      },
    },
    {
      name: 'asynchronous output rejection',
      writeOutput: () => Promise.reject(new Error('stdout-sensitive-marker')),
    },
  ])('returns exit code 4 for $name', async ({ writeOutput }) => {
    const prisma = {
      feedback: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
      $disconnect: vi.fn().mockResolvedValue(undefined),
    }

    await expect(
      runFeedbackOperationsCli({
        argumentsList: ['show', 'feedback_123'],
        prisma,
        writeOutput,
      }),
    ).resolves.toBe(4)
  })

  it('returns exit code 4 when output fails after a successful status write', async () => {
    const prisma = {
      feedback: {
        findUnique: vi.fn().mockResolvedValue({ status: 'REVIEWING' }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      $disconnect: vi.fn().mockResolvedValue(undefined),
    }

    await expect(
      runFeedbackOperationsCli({
        argumentsList: ['set-status', 'feedback_123', 'closed'],
        prisma,
        writeOutput: () => Promise.reject(new Error('stdout-sensitive-marker')),
      }),
    ).resolves.toBe(4)
    expect(prisma.feedback.updateMany).toHaveBeenCalledOnce()
  })

  it('returns exit code 4 when operations status output fails', async () => {
    const prisma = {
      $connect: vi.fn().mockResolvedValue(undefined),
      $disconnect: vi.fn().mockResolvedValue(undefined),
      feedback: {
        groupBy: vi.fn().mockResolvedValue([]),
      },
      emailOutbox: {
        groupBy: vi.fn().mockResolvedValue([]),
        findFirst: vi.fn().mockResolvedValue(null),
      },
    }

    await expect(
      runOperationsStatusCli({
        prisma,
        writeOutput: () => {
          throw new Error('stdout-sensitive-marker')
        },
      }),
    ).resolves.toBe(4)
  })

  it('consumes a real Writable error emitted after its write callback fails', async () => {
    const stream = new Writable({
      write(_chunk, _encoding, callback) {
        callback(new Error('stdout-sensitive-marker'))
      },
    })
    const writer = createJsonLineWriter(stream)

    await expect(writer({ ok: true })).rejects.toThrow('Output channel failed')
    await new Promise<void>((resolvePromise) => setImmediate(resolvePromise))

    expect(stream.listenerCount('error')).toBe(0)
  })

  it('waits for drain when a writable applies backpressure', async () => {
    let drainListener: (() => void) | undefined
    const stream = {
      write: vi.fn(
        (
          _line: string,
          callback: (error?: Error | null) => void,
        ) => {
          queueMicrotask(() => callback())
          return false
        },
      ),
      once: vi.fn((event: string, listener: () => void) => {
        if (event === 'drain') drainListener = listener
      }),
      off: vi.fn(),
    }
    const writer = createJsonLineWriter(stream)
    let settled = false

    const writePromise = writer({ ok: true }).then(() => {
      settled = true
    })
    await Promise.resolve()
    expect(settled).toBe(false)
    drainListener?.()
    await writePromise
    expect(settled).toBe(true)
  })

  it('reports a writable error event without leaking the raw error', async () => {
    const listeners = new Map<string, (error?: Error) => void>()
    const stream = {
      write: vi.fn(() => true),
      once: vi.fn((event: string, listener: (error?: Error) => void) => {
        listeners.set(event, listener)
      }),
      off: vi.fn((event: string) => {
        listeners.delete(event)
      }),
    }
    const writer = createJsonLineWriter(stream)

    const writePromise = writer({ ok: true })
    listeners.get('error')?.(new Error('stdout-sensitive-marker'))
    await expect(writePromise).rejects.toThrow('Output channel failed')
  })

  it('returns exit 4 in a child process without leaking a Writable error', () => {
    const cliModuleUrl = pathToFileURL(
      resolve(process.cwd(), 'scripts/manage-feedback.mjs'),
    ).href
    const outputModuleUrl = pathToFileURL(
      resolve(process.cwd(), 'scripts/lib/cli-output.mjs'),
    ).href
    const marker = 'stdout-sensitive-marker'
    const probe = `
      import { Writable } from 'node:stream'
      import { runFeedbackOperationsCli } from ${JSON.stringify(cliModuleUrl)}
      import { createJsonLineWriter } from ${JSON.stringify(outputModuleUrl)}

      const stream = new Writable({
        write(_chunk, _encoding, callback) {
          callback(new Error(${JSON.stringify(marker)}))
        },
      })
      const prisma = {
        feedback: { findUnique: async () => null },
        $disconnect: async () => {},
      }
      process.exitCode = await runFeedbackOperationsCli({
        argumentsList: ['show', 'feedback_123'],
        prisma,
        writeOutput: createJsonLineWriter(stream),
      })
    `

    const child = spawnSync(
      process.execPath,
      ['--input-type=module', '--eval', probe],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        timeout: 5_000,
      },
    )

    expect(child.error).toBeUndefined()
    expect(child.signal).toBeNull()
    expect(child.status).toBe(4)
    expect(child.stderr).toBe('')
    expect(child.stderr).not.toContain(marker)
    expect(child.stderr).not.toContain('Unhandled')
    expect(child.stderr).not.toContain('at ')
  })

  it('emits one operation error even when operation and cleanup both fail', async () => {
    const prisma = {
      $disconnect: vi.fn().mockRejectedValue(new Error('cleanup secret')),
    }
    const output: unknown[] = []

    const exitCode = await runFeedbackOperationsCli({
      argumentsList: ['show', '../invalid'],
      prisma,
      writeOutput: (value: unknown) => output.push(value),
    })

    expect(exitCode).toBe(1)
    expect(output).toEqual([{ errorCode: 'FEEDBACK_OPERATIONS_FAILED' }])
    expect(output).toHaveLength(1)
  })

  it('does not emit connected status when operations-status cleanup fails', async () => {
    const prisma = {
      $connect: vi.fn().mockResolvedValue(undefined),
      $disconnect: vi.fn().mockRejectedValue(new Error('postgres://secret@host')),
      feedback: {
        groupBy: vi.fn().mockResolvedValue([]),
      },
      emailOutbox: {
        groupBy: vi.fn().mockResolvedValue([]),
        findFirst: vi.fn().mockResolvedValue(null),
      },
    }
    const output: unknown[] = []

    const exitCode = await runOperationsStatusCli({
      prisma,
      releaseSha: 'c35adf55d27ea17e24a945f95f124677e3362d54',
      now: () => new Date('2026-07-28T00:00:00.000Z'),
      writeOutput: (value: unknown) => output.push(value),
    })

    expect(exitCode).toBe(1)
    expect(output).toEqual([
      {
        timestamp: '2026-07-28T00:00:00.000Z',
        service: 'zhipet-operations',
        type: 'operations_status',
        status: 'failed',
        release: 'c35adf55d27e',
        databaseConnected: false,
        errorCode: 'OPERATIONS_STATUS_CLEANUP_FAILED',
      },
    ])
    expect(output).toHaveLength(1)
    expect(JSON.stringify(output)).not.toContain('postgres')
  })
})

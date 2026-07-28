import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createOperationEntry,
  resolveOperationRelease,
} from '../../scripts/lib/operations-log.mjs'
import { runMailDeliveryJob } from '../../scripts/deliver-email-outbox.mjs'
import { runDataPurgeJob } from '../../scripts/purge-expired-data.mjs'

const originalReleaseSha = process.env.ZHIPET_RELEASE_SHA
const temporaryDirectories: string[] = []

afterEach(() => {
  vi.restoreAllMocks()
  if (originalReleaseSha === undefined) {
    delete process.env.ZHIPET_RELEASE_SHA
  } else {
    process.env.ZHIPET_RELEASE_SHA = originalReleaseSha
  }
  temporaryDirectories.splice(0).forEach((directory) => {
    rmSync(directory, { recursive: true, force: true })
  })
})

describe('operation logs', () => {
  it('keeps the schema bounded and excludes arbitrary sensitive fields', () => {
    const entry = createOperationEntry({
      type: 'job_completed',
      job: 'mail_delivery',
      status: 'complete',
      durationMs: 120,
      counts: { sent: 1, failed: 0 },
      releaseSha: 'c35adf55d27ea17e24a945f95f124677e3362d54',
      recipient: 'owner@example.com',
      message: 'must not be logged',
    })

    expect(entry).toMatchObject({
      service: 'zhipet-operations',
      type: 'job_completed',
      job: 'mail_delivery',
      release: 'c35adf55d27e',
    })
    expect(JSON.stringify(entry)).not.toContain('recipient')
    expect(JSON.stringify(entry)).not.toContain('message')
  })

  it('uses only bounded safe error codes and numeric counts', () => {
    const entry = createOperationEntry({
      type: 'job_failed',
      job: 'mail_delivery',
      status: 'failed',
      durationMs: -1,
      counts: {
        sent: 1,
        processed: Number.MAX_VALUE,
        ignored: 'not-a-number',
      },
      errorCode: 'smtp failure: owner@example.com',
    })

    expect(entry).toMatchObject({
      type: 'job_failed',
      job: 'mail_delivery',
      status: 'failed',
      durationMs: 0,
      counts: { sent: 1, processed: Number.MAX_SAFE_INTEGER },
      errorCode: 'UNKNOWN_ERROR',
      release: 'unknown',
    })
  })

  it('projects a mail terminal failure count into a bounded indexed field', () => {
    const mailCompletionFixture = {
      type: 'job_completed',
      job: 'mail_delivery',
      status: 'complete',
      durationMs: 842,
      counts: { processed: 2, sent: 1, deferred: 0, failed: 1 },
      releaseSha: 'c35adf55d27ea17e24a945f95f124677e3362d54',
      recipient: 'private@example.com',
      contact: 'private contact',
    }

    const entry = createOperationEntry(mailCompletionFixture)

    expect(entry).toEqual({
      timestamp: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
      service: 'zhipet-operations',
      type: 'job_completed',
      job: 'mail_delivery',
      status: 'complete',
      release: 'c35adf55d27e',
      durationMs: 842,
      counts: { processed: 2, sent: 1, deferred: 0, failed: 1 },
      failedCount: 1,
    })
    expect(JSON.stringify(entry)).not.toContain('private@example.com')
    expect(JSON.stringify(entry)).not.toContain('private contact')
  })

  it('resolves a validated environment release SHA when no explicit SHA is provided', () => {
    process.env.ZHIPET_RELEASE_SHA = 'c35adf55d27ea17e24a945f95f124677e3362d54'

    expect(
      createOperationEntry({
        type: 'job_started',
        job: 'data_purge',
        status: 'started',
      }).release,
    ).toBe('c35adf55d27e')
  })

  it('uses explicit, environment, and release-file values in precedence order', () => {
    const directory = mkdtempSync(join(tmpdir(), 'zhipet-release-'))
    temporaryDirectories.push(directory)
    writeFileSync(
      join(directory, '.release-commit'),
      '3333333333333333333333333333333333333333\n',
      'utf8',
    )

    expect(
      resolveOperationRelease(
        '1111111111111111111111111111111111111111',
        {
          environmentReleaseSha: '2222222222222222222222222222222222222222',
          releaseDirectory: directory,
        },
      ),
    ).toBe('111111111111')
    expect(
      resolveOperationRelease(undefined, {
        environmentReleaseSha: '2222222222222222222222222222222222222222',
        releaseDirectory: directory,
      }),
    ).toBe('222222222222')
    expect(
      resolveOperationRelease(undefined, {
        environmentReleaseSha: undefined,
        releaseDirectory: directory,
      }),
    ).toBe('333333333333')
  })

  it('rejects malformed or missing release files', () => {
    const directory = mkdtempSync(join(tmpdir(), 'zhipet-release-'))
    temporaryDirectories.push(directory)
    writeFileSync(join(directory, '.release-commit'), 'not-a-sha\n', 'utf8')

    expect(
      resolveOperationRelease(undefined, {
        environmentReleaseSha: undefined,
        releaseDirectory: directory,
      }),
    ).toBe('unknown')
    expect(
      resolveOperationRelease(undefined, {
        environmentReleaseSha: undefined,
        releaseDirectory: join(directory, 'missing'),
      }),
    ).toBe('unknown')
  })
})

const enabledMailEnvironment = {
  MAIL_ENABLED: 'true',
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '465',
  SMTP_USER: 'user',
  SMTP_PASSWORD: 'secret-password',
  MAIL_FROM: 'sender@example.com',
}

const createMailPrisma = () => ({
  emailOutbox: {
    updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    findMany: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockResolvedValue({}),
  },
  $disconnect: vi.fn().mockResolvedValue(undefined),
})

describe('mail delivery job lifecycle', () => {
  it('emits completion only after closing SMTP and disconnecting Prisma', async () => {
    const events: Array<Record<string, unknown>> = []
    const ordering: string[] = []
    const prisma = createMailPrisma()
    prisma.$disconnect.mockImplementation(async () => {
      ordering.push('prisma_disconnected')
    })
    const close = vi.fn(() => {
      ordering.push('smtp_closed')
    })

    const result = await runMailDeliveryJob({
      prisma,
      createTransport: () => ({
        sendMail: vi.fn(),
        close,
      }),
      emitLog: (event) => {
        events.push(event)
        ordering.push(String(event.type))
      },
      environment: enabledMailEnvironment,
    })

    expect(result.exitCode).toBe(0)
    expect(events.map((event) => event.type)).toEqual([
      'job_started',
      'job_completed',
    ])
    expect(ordering).toEqual([
      'job_started',
      'smtp_closed',
      'prisma_disconnected',
      'job_completed',
    ])
    expect(close).toHaveBeenCalledOnce()
    expect(prisma.$disconnect).toHaveBeenCalledOnce()
  })

  it('projects a real terminal delivery failure into failedCount', async () => {
    const entries: Array<Record<string, unknown>> = []
    const prisma = createMailPrisma()
    const nowValue = Date.parse('2026-07-28T04:00:00.000Z')
    const nextAttemptAt = new Date(nowValue - 60_000)
    prisma.emailOutbox.updateMany
      .mockResolvedValueOnce({ count: 0 })
      .mockResolvedValueOnce({ count: 1 })
    prisma.emailOutbox.findMany.mockResolvedValue([
      {
        id: 'mail_terminal_1',
        status: 'PENDING',
        attemptCount: 4,
        nextAttemptAt,
        retentionExpiresAt: new Date(nowValue + 60_000),
        createdAt: new Date(nowValue - 120_000),
        recipient: 'private@example.com',
        subject: 'private subject',
        textBody: 'private body',
      },
    ])
    const sendMail = vi.fn().mockRejectedValue(
      Object.assign(new Error('private delivery detail'), {
        code: 'ETIMEDOUT',
      }),
    )

    const result = await runMailDeliveryJob({
      prisma,
      createTransport: () => ({
        sendMail,
        close: vi.fn(),
      }),
      emitLog: (event) => {
        entries.push(
          createOperationEntry({
            ...event,
            releaseSha: 'c35adf55d27ea17e24a945f95f124677e3362d54',
          }),
        )
      },
      environment: enabledMailEnvironment,
      now: () => nowValue,
    })

    expect(result).toEqual({
      exitCode: 0,
      counts: { processed: 1, sent: 0, deferred: 0, failed: 1 },
    })
    expect(entries.at(-1)).toMatchObject({
      type: 'job_completed',
      job: 'mail_delivery',
      status: 'complete',
      counts: { processed: 1, sent: 0, deferred: 0, failed: 1 },
      failedCount: 1,
    })
    expect(prisma.emailOutbox.update).toHaveBeenCalledWith({
      where: { id: 'mail_terminal_1' },
      data: expect.objectContaining({
        status: 'FAILED',
        lastErrorCode: 'ETIMEDOUT',
      }),
    })
    expect(JSON.stringify(entries)).not.toContain('private@example.com')
    expect(JSON.stringify(entries)).not.toContain('private subject')
    expect(JSON.stringify(entries)).not.toContain('private body')
    expect(JSON.stringify(entries)).not.toContain('private delivery detail')
  })

  it('sanitizes a work failure, closes resources, and emits one failed terminal event', async () => {
    const events: Array<Record<string, unknown>> = []
    const prisma = createMailPrisma()
    prisma.emailOutbox.updateMany.mockRejectedValue(
      Object.assign(new Error('database password leaked'), { code: 'P1001' }),
    )
    const close = vi.fn()
    const stderr = vi.spyOn(process.stderr, 'write')

    const result = await runMailDeliveryJob({
      prisma,
      createTransport: () => ({
        sendMail: vi.fn(),
        close,
      }),
      emitLog: (event) => events.push(event),
      environment: enabledMailEnvironment,
    })

    expect(result).toMatchObject({ exitCode: 1, errorCode: 'P1001' })
    expect(events.map((event) => event.type)).toEqual([
      'job_started',
      'job_failed',
    ])
    expect(events.filter((event) => event.type !== 'job_started')).toHaveLength(1)
    expect(JSON.stringify(events)).not.toContain('database password leaked')
    expect(JSON.stringify(events)).not.toContain('secret-password')
    expect(stderr).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalledOnce()
    expect(prisma.$disconnect).toHaveBeenCalledOnce()
  })

  it('attempts every cleanup and reports a cleanup failure without masking work failure', async () => {
    const events: Array<Record<string, unknown>> = []
    const prisma = createMailPrisma()
    prisma.emailOutbox.updateMany.mockRejectedValue(
      Object.assign(new Error('primary raw failure'), { code: 'P1001' }),
    )
    prisma.$disconnect.mockRejectedValue(
      Object.assign(new Error('disconnect raw failure'), { code: 'P1017' }),
    )
    const close = vi.fn(() => {
      throw Object.assign(new Error('close raw failure'), { code: 'ECONNRESET' })
    })

    const result = await runMailDeliveryJob({
      prisma,
      createTransport: () => ({
        sendMail: vi.fn(),
        close,
      }),
      emitLog: (event) => events.push(event),
      environment: enabledMailEnvironment,
    })

    expect(result).toMatchObject({ exitCode: 1, errorCode: 'P1001' })
    expect(close).toHaveBeenCalledOnce()
    expect(prisma.$disconnect).toHaveBeenCalledOnce()
    expect(events.map((event) => event.type)).toEqual([
      'job_started',
      'job_failed',
    ])
    expect(JSON.stringify(events)).not.toContain('raw failure')
  })

  it('exits non-zero without raw stderr when the production CLI is misconfigured', () => {
    const result = spawnSync(process.execPath, ['scripts/deliver-email-outbox.mjs'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        MAIL_ENABLED: 'true',
        SMTP_HOST: '',
        SMTP_USER: '',
        SMTP_PASSWORD: '',
        MAIL_FROM: '',
      },
      encoding: 'utf8',
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toBe('')
    expect(result.stdout).not.toContain('Missing email delivery environment')
    const events = result.stdout
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as { type: string })
    expect(events.map((event) => event.type)).toEqual([
      'job_started',
      'job_failed',
    ])
  })

  it('executes when the CLI entry path traverses the current release symlink', () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), 'zhipet-current-link-'))
    temporaryDirectories.push(temporaryDirectory)
    const currentRelease = join(temporaryDirectory, 'current')
    symlinkSync(
      process.cwd(),
      currentRelease,
      process.platform === 'win32' ? 'junction' : 'dir',
    )

    const result = spawnSync(
      process.execPath,
      [join(currentRelease, 'scripts', 'deliver-email-outbox.mjs')],
      {
        cwd: currentRelease,
        env: {
          ...process.env,
          ZHIPET_RELEASE_SHA: 'c35adf55d27ea17e24a945f95f124677e3362d54',
          MAIL_ENABLED: 'true',
          SMTP_HOST: '',
          SMTP_USER: '',
          SMTP_PASSWORD: '',
          MAIL_FROM: '',
        },
        encoding: 'utf8',
      },
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toBe('')
    const events = result.stdout
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as { type: string })
    expect(events.map((event) => event.type)).toEqual([
      'job_started',
      'job_failed',
    ])
  })
})

const createPurgePrisma = () => ({
  feedback: {
    deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
  },
  emailOutbox: {
    deleteMany: vi.fn().mockResolvedValue({ count: 3 }),
  },
  $transaction: vi.fn().mockResolvedValue([{ count: 2 }, { count: 3 }]),
  $disconnect: vi.fn().mockResolvedValue(undefined),
})

describe('data purge job lifecycle', () => {
  it('preserves the purge transaction and completes after disconnect', async () => {
    const events: Array<Record<string, unknown>> = []
    const ordering: string[] = []
    const prisma = createPurgePrisma()
    prisma.$disconnect.mockImplementation(async () => {
      ordering.push('prisma_disconnected')
    })

    const result = await runDataPurgeJob({
      prisma,
      emitLog: (event) => {
        events.push(event)
        ordering.push(String(event.type))
      },
    })

    expect(result.exitCode).toBe(0)
    expect(prisma.$transaction).toHaveBeenCalledOnce()
    expect(prisma.feedback.deleteMany).toHaveBeenCalledOnce()
    expect(prisma.emailOutbox.deleteMany).toHaveBeenCalledOnce()
    expect(ordering).toEqual([
      'job_started',
      'prisma_disconnected',
      'job_completed',
    ])
    expect(events.at(-1)).toMatchObject({
      type: 'job_completed',
      counts: { feedback: 2, emailOutbox: 3 },
    })
  })

  it('converts a Prisma disconnect failure into one sanitized failed terminal event', async () => {
    const events: Array<Record<string, unknown>> = []
    const prisma = createPurgePrisma()
    prisma.$disconnect.mockRejectedValue(
      Object.assign(new Error('database URL leaked'), { code: 'P1017' }),
    )

    const result = await runDataPurgeJob({
      prisma,
      emitLog: (event) => events.push(event),
    })

    expect(result).toMatchObject({ exitCode: 1, errorCode: 'P1017' })
    expect(events.map((event) => event.type)).toEqual([
      'job_started',
      'job_failed',
    ])
    expect(events.filter((event) => event.type !== 'job_started')).toHaveLength(1)
    expect(JSON.stringify(events)).not.toContain('database URL leaked')
    expect(prisma.$disconnect).toHaveBeenCalledOnce()
  })
})

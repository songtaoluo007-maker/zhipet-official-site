import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

import { PrismaClient } from '@prisma/client'

import { isDirectExecution } from './lib/direct-execution.mjs'
import { getOperationsStatus } from './lib/feedback-operations.mjs'
import {
  createJsonLineWriter,
  emitJsonLineSafely,
} from './lib/cli-output.mjs'
import { resolveOperationRelease } from './lib/operations-log.mjs'

if (existsSync('.env')) {
  loadEnvFile('.env')
}

const safeTimestamp = (now) => {
  try {
    const timestamp = now()
    if (timestamp instanceof Date && !Number.isNaN(timestamp.getTime())) {
      return timestamp.toISOString()
    }
  } catch {
    // Fall through to a bounded timestamp for the error envelope.
  }
  return new Date().toISOString()
}

export const runOperationsStatusCli = async (options = {}) => {
  const now = options.now ?? (() => new Date())
  const writeOutput =
    options.writeOutput ?? createJsonLineWriter(process.stdout)
  const release = resolveOperationRelease(options.releaseSha, {
    environmentReleaseSha: options.environmentReleaseSha,
    releaseDirectory: options.releaseDirectory,
  })
  let result
  let operationSucceeded = false
  let prisma

  try {
    prisma = options.prisma ?? new PrismaClient()
    result = await getOperationsStatus({ prisma, now })
    operationSucceeded = true
  } catch {
    // Emit the bounded status error only after Prisma cleanup completes.
  }

  let cleanupSucceeded = true
  if (prisma) {
    try {
      await prisma.$disconnect()
    } catch {
      cleanupSucceeded = false
    }
  }

  let exitCode
  let output
  if (!operationSucceeded) {
    exitCode = 1
    output = {
      timestamp: safeTimestamp(now),
      service: 'zhipet-operations',
      type: 'operations_status',
      status: 'failed',
      release,
      databaseConnected: false,
      errorCode: 'OPERATIONS_STATUS_FAILED',
    }
  } else if (!cleanupSucceeded) {
    exitCode = 1
    output = {
      timestamp: safeTimestamp(now),
      service: 'zhipet-operations',
      type: 'operations_status',
      status: 'failed',
      release,
      databaseConnected: false,
      errorCode: 'OPERATIONS_STATUS_CLEANUP_FAILED',
    }
  } else {
    exitCode = 0
    output = {
      ...result,
      service: 'zhipet-operations',
      type: 'operations_status',
      status: 'ok',
      release,
    }
  }

  const outputSucceeded = await emitJsonLineSafely({ writeOutput, value: output })
  return outputSucceeded ? exitCode : 4
}

if (isDirectExecution(import.meta.url)) {
  let exitCode = 4
  try {
    exitCode = await runOperationsStatusCli()
  } catch {
    // Direct execution must never expose raw operational or output exceptions.
  }
  process.exitCode = exitCode
}

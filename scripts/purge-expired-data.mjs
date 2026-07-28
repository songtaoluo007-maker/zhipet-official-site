import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

import { PrismaClient } from '@prisma/client'

import { isDirectExecution } from './lib/direct-execution.mjs'
import {
  emitOperationLog,
  runOperationJob,
} from './lib/operations-log.mjs'

if (existsSync('.env')) {
  loadEnvFile('.env')
}

export const runDataPurgeJob = async ({
  prisma,
  emitLog = emitOperationLog,
  now = Date.now,
}) =>
  runOperationJob({
    job: 'data_purge',
    emitLog,
    now,
    errorCodeFallback: 'DATA_PURGE_JOB_ERROR',
    cleanupErrorCodeFallback: 'DATA_PURGE_CLEANUP_ERROR',
    execute: async () => {
      const purgeBefore = new Date(now())
      const [feedback, emailOutbox] = await prisma.$transaction([
        prisma.feedback.deleteMany({
          where: { retentionExpiresAt: { lte: purgeBefore } },
        }),
        prisma.emailOutbox.deleteMany({
          where: { retentionExpiresAt: { lte: purgeBefore } },
        }),
      ])

      return {
        feedback: feedback.count,
        emailOutbox: emailOutbox.count,
      }
    },
    cleanup: [
      async () => {
        await prisma.$disconnect()
      },
    ],
  })

export const runDataPurgeCli = async () => {
  let exitCode
  try {
    const result = await runDataPurgeJob({
      prisma: new PrismaClient(),
    })
    exitCode = result.exitCode
  } catch {
    exitCode = 1
  }
  process.exitCode = exitCode
}

if (isDirectExecution(import.meta.url)) {
  await runDataPurgeCli()
}

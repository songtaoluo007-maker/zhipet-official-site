import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

import { isDirectExecution } from './lib/direct-execution.mjs'
import {
  emitOperationLog,
  getOperationErrorCode,
  runOperationJob,
} from './lib/operations-log.mjs'

if (existsSync('.env')) {
  loadEnvFile('.env')
}

const maxAttempts = 5
const batchSize = 20
const minuteMs = 60 * 1000
const dayMs = 24 * 60 * minuteMs

const requiredEnvironment = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'MAIL_FROM',
]

export const runMailDeliveryJob = async ({
  prisma,
  createTransport = nodemailer.createTransport,
  emitLog = emitOperationLog,
  environment = process.env,
  now = Date.now,
}) => {
  let transporter
  let startedAt

  return runOperationJob({
    job: 'mail_delivery',
    emitLog,
    now,
    errorCodeFallback: 'MAIL_DELIVERY_JOB_ERROR',
    cleanupErrorCodeFallback: 'MAIL_DELIVERY_CLEANUP_ERROR',
    execute: async () => {
      startedAt = new Date(now())
      if (environment.MAIL_ENABLED !== 'true') {
        return { processed: 0, sent: 0, deferred: 0, failed: 0 }
      }

      const missingEnvironment = requiredEnvironment.filter(
        (key) => !environment[key]?.trim(),
      )
      if (missingEnvironment.length) {
        throw new Error('MAIL_CONFIGURATION_MISSING')
      }

      const port = Number.parseInt(environment.SMTP_PORT || '465', 10)
      if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('MAIL_CONFIGURATION_INVALID')
      }

      const secure = environment.SMTP_SECURE
        ? environment.SMTP_SECURE === 'true'
        : port === 465
      transporter = createTransport({
        host: environment.SMTP_HOST,
        port,
        secure,
        auth: {
          user: environment.SMTP_USER,
          pass: environment.SMTP_PASSWORD,
        },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      })

      const staleBefore = new Date(startedAt.getTime() - 15 * minuteMs)
      await prisma.emailOutbox.updateMany({
        where: {
          status: 'PROCESSING',
          lastAttemptAt: { lte: staleBefore },
        },
        data: {
          status: 'PENDING',
          nextAttemptAt: startedAt,
        },
      })

      const queued = await prisma.emailOutbox.findMany({
        where: {
          status: 'PENDING',
          nextAttemptAt: { lte: startedAt },
          retentionExpiresAt: { gt: startedAt },
        },
        orderBy: [{ nextAttemptAt: 'asc' }, { createdAt: 'asc' }],
        take: batchSize,
      })

      let sent = 0
      let deferred = 0
      let failed = 0

      for (const email of queued) {
        const attempt = email.attemptCount + 1
        const claimed = await prisma.emailOutbox.updateMany({
          where: {
            id: email.id,
            status: 'PENDING',
            nextAttemptAt: { lte: startedAt },
          },
          data: {
            status: 'PROCESSING',
            attemptCount: { increment: 1 },
            lastAttemptAt: new Date(now()),
          },
        })

        if (claimed.count !== 1) continue

        try {
          await transporter.sendMail({
            from: environment.MAIL_FROM,
            to: email.recipient,
            subject: email.subject,
            text: email.textBody,
          })

          const sentAt = new Date(now())
          await prisma.emailOutbox.update({
            where: { id: email.id },
            data: {
              status: 'SENT',
              recipient: 'delivered@redacted.invalid',
              subject: '',
              textBody: '',
              sentAt,
              lastErrorCode: null,
              retentionExpiresAt: new Date(sentAt.getTime() + 7 * dayMs),
            },
          })
          sent += 1
        } catch (error) {
          const terminal = attempt >= maxAttempts
          const retryDelay = Math.min(2 ** attempt, 60) * minuteMs
          const errorCode = getOperationErrorCode(error, 'SMTP_DELIVERY_ERROR')
          await prisma.emailOutbox.update({
            where: { id: email.id },
            data: {
              status: terminal ? 'FAILED' : 'PENDING',
              nextAttemptAt: terminal
                ? email.nextAttemptAt
                : new Date(now() + retryDelay),
              lastErrorCode: errorCode,
            },
          })

          if (terminal) failed += 1
          else deferred += 1
        }
      }

      return {
        processed: sent + deferred + failed,
        sent,
        deferred,
        failed,
      }
    },
    cleanup: [
      async () => {
        await transporter?.close()
      },
      async () => {
        await prisma.$disconnect()
      },
    ],
  })
}

export const runMailDeliveryCli = async () => {
  let exitCode
  try {
    const result = await runMailDeliveryJob({
      prisma: new PrismaClient(),
    })
    exitCode = result.exitCode
  } catch {
    exitCode = 1
  }
  process.exitCode = exitCode
}

if (isDirectExecution(import.meta.url)) {
  await runMailDeliveryCli()
}

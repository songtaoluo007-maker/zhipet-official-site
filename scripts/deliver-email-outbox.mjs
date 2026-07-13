import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

if (existsSync('.env')) {
  loadEnvFile('.env')
}

const prisma = new PrismaClient()
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

const sanitizeErrorCode = (error) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code.replace(/[^A-Z0-9_-]/gi, '').slice(0, 80) || 'SMTP_DELIVERY_ERROR'
  }

  return 'SMTP_DELIVERY_ERROR'
}

const emitDeliveryLog = (entry) => {
  process.stdout.write(`${JSON.stringify({ type: 'email_delivery', ...entry })}\n`)
}

const main = async () => {
  if (process.env.MAIL_ENABLED !== 'true') {
    process.stdout.write(
      `${JSON.stringify({ type: 'email_delivery_run', status: 'disabled' })}\n`,
    )
    return
  }

  const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]?.trim())
  if (missingEnvironment.length) {
    throw new Error(`Missing email delivery environment: ${missingEnvironment.join(', ')}`)
  }

  const port = Number.parseInt(process.env.SMTP_PORT || '465', 10)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be an integer between 1 and 65535')
  }

  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })

  const startedAt = new Date()
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
        lastAttemptAt: new Date(),
      },
    })

    if (claimed.count !== 1) continue

    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email.recipient,
        subject: email.subject,
        text: email.textBody,
      })

      const sentAt = new Date()
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
      emitDeliveryLog({
        outboxId: email.id,
        template: email.template,
        status: 'sent',
        attempt,
      })
    } catch (error) {
      const terminal = attempt >= maxAttempts
      const retryDelay = Math.min(2 ** attempt, 60) * minuteMs
      const errorCode = sanitizeErrorCode(error)
      await prisma.emailOutbox.update({
        where: { id: email.id },
        data: {
          status: terminal ? 'FAILED' : 'PENDING',
          nextAttemptAt: terminal ? email.nextAttemptAt : new Date(Date.now() + retryDelay),
          lastErrorCode: errorCode,
        },
      })

      if (terminal) failed += 1
      else deferred += 1
      emitDeliveryLog({
        outboxId: email.id,
        template: email.template,
        status: terminal ? 'failed' : 'deferred',
        attempt,
        errorCode,
      })
    }
  }

  transporter.close()
  process.stdout.write(
    `${JSON.stringify({
      type: 'email_delivery_run',
      status: 'complete',
      processed: sent + deferred + failed,
      sent,
      deferred,
      failed,
      finishedAt: new Date().toISOString(),
    })}\n`,
  )
}

try {
  await main()
} finally {
  await prisma.$disconnect()
}

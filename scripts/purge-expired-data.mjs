import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

import { PrismaClient } from '@prisma/client'

if (existsSync('.env')) {
  loadEnvFile('.env')
}

const prisma = new PrismaClient()
const now = new Date()

try {
  const [feedback, emailOutbox] = await prisma.$transaction([
    prisma.feedback.deleteMany({ where: { retentionExpiresAt: { lte: now } } }),
    prisma.emailOutbox.deleteMany({ where: { retentionExpiresAt: { lte: now } } }),
  ])

  process.stdout.write(
    `${JSON.stringify({
      purgedAt: now.toISOString(),
      feedback: feedback.count,
      emailOutbox: emailOutbox.count,
    })}\n`,
  )
} finally {
  await prisma.$disconnect()
}

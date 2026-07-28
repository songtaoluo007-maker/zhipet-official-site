import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

import { PrismaClient } from '@prisma/client'

import { isDirectExecution } from './lib/direct-execution.mjs'
import {
  executeFeedbackCommand,
  getFeedbackStatusFailureApplicationState,
  parseFeedbackCommand,
} from './lib/feedback-operations.mjs'
import {
  createJsonLineWriter,
  emitJsonLineSafely,
} from './lib/cli-output.mjs'

if (existsSync('.env')) {
  loadEnvFile('.env')
}

export const runFeedbackOperationsCli = async (options = {}) => {
  const argumentsList = options.argumentsList ?? process.argv.slice(2)
  const writeOutput =
    options.writeOutput ?? createJsonLineWriter(process.stdout)
  const createPrisma = options.createPrisma ?? (() => new PrismaClient())
  const writeRequested = argumentsList[0] === 'set-status'
  let command
  let operationApplied = false
  let result
  let operationSucceeded = false
  let prisma

  try {
    prisma = options.prisma ?? createPrisma()
  } catch {
    // Resource initialization failures use the same bounded operation contract.
  }

  try {
    command = parseFeedbackCommand(argumentsList)
  } catch {
    // Parsing failures are known not to have dispatched a database write.
  }

  if (command && prisma) {
    try {
      result = await executeFeedbackCommand({ prisma, command })
      operationSucceeded = true
    } catch (error) {
      if (command.kind === 'set-status') {
        operationApplied = getFeedbackStatusFailureApplicationState(error)
      }
    }
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
  if (!command) {
    exitCode = 1
    output = writeRequested
      ? {
          errorCode: 'FEEDBACK_OPERATIONS_FAILED',
          operationApplied: false,
        }
      : { errorCode: 'FEEDBACK_OPERATIONS_FAILED' }
  } else if (!operationSucceeded && command.kind === 'set-status') {
    if (operationApplied === 'unknown') {
      exitCode = 3
      output = {
        errorCode: 'FEEDBACK_OPERATIONS_WRITE_UNKNOWN',
        operationApplied: 'unknown',
      }
    } else {
      exitCode = 1
      output = {
        errorCode: 'FEEDBACK_OPERATIONS_FAILED',
        operationApplied: false,
      }
    }
  } else if (!operationSucceeded) {
    exitCode = 1
    output = { errorCode: 'FEEDBACK_OPERATIONS_FAILED' }
  } else if (!cleanupSucceeded && command.kind === 'set-status') {
    exitCode = 2
    output = {
      errorCode: 'FEEDBACK_OPERATIONS_CLEANUP_FAILED',
      operationApplied: true,
    }
  } else if (!cleanupSucceeded) {
    exitCode = 1
    output = {
      errorCode: 'FEEDBACK_OPERATIONS_CLEANUP_FAILED',
      operationApplied: false,
    }
  } else {
    exitCode = 0
    output = result
  }

  const outputSucceeded = await emitJsonLineSafely({ writeOutput, value: output })
  return outputSucceeded ? exitCode : 4
}

if (isDirectExecution(import.meta.url)) {
  let exitCode = 4
  try {
    exitCode = await runFeedbackOperationsCli()
  } catch {
    // Direct execution must never expose raw operational or output exceptions.
  }
  process.exitCode = exitCode
}

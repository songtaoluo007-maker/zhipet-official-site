import {
  EmailOutboxStatus,
  FeedbackStatus,
} from '@prisma/client'

const defaultListLimit = 20
const maximumListLimit = 100
const feedbackIdPattern = /^[A-Za-z0-9_-]{1,128}$/
const terminalFeedbackStatuses = new Set([
  FeedbackStatus.CLOSED,
  FeedbackStatus.INVALID,
])
const feedbackStatusByCommand = Object.freeze({
  reviewing: FeedbackStatus.REVIEWING,
  closed: FeedbackStatus.CLOSED,
  invalid: FeedbackStatus.INVALID,
})

const feedbackStatusValues = Object.values(FeedbackStatus)
const emailOutboxStatusValues = Object.values(EmailOutboxStatus)

const metadataSelect = Object.freeze({
  id: true,
  category: true,
  status: true,
  createdAt: true,
  handledAt: true,
})
const detailSelect = Object.freeze({
  ...metadataSelect,
  message: true,
  contact: true,
})

class FeedbackCommandError extends Error {}

class FeedbackStatusOperationError extends Error {
  constructor(message, operationApplied) {
    super(message)
    this.operationApplied = operationApplied
  }
}

const createCommandError = (message) => new FeedbackCommandError(message)
const createStatusOperationError = (message, operationApplied = false) =>
  new FeedbackStatusOperationError(message, operationApplied)

export const getFeedbackStatusFailureApplicationState = (error) =>
  error instanceof FeedbackStatusOperationError
    ? error.operationApplied
    : false

const getCurrentDate = (now) => {
  const value = now()
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw createCommandError('Clock returned an invalid date')
  }
  return value
}

const parseFeedbackId = (value) => {
  if (!value) throw createCommandError('Feedback ID is required')
  if (typeof value !== 'string' || !feedbackIdPattern.test(value)) {
    throw createCommandError('Feedback ID is invalid')
  }
  return value
}

const parseListLimit = (value) => {
  if (!/^[1-9][0-9]*$/.test(value)) {
    throw createCommandError('List limit must be an integer between 1 and 100')
  }
  const limit = Number(value)
  if (!Number.isSafeInteger(limit) || limit > maximumListLimit) {
    throw createCommandError('List limit must be an integer between 1 and 100')
  }
  return limit
}

const normalizeTargetStatus = (value) => {
  if (typeof value !== 'string') {
    throw createCommandError('Feedback status is required')
  }

  const status = feedbackStatusByCommand[value.toLowerCase()]
  if (!status) {
    throw createCommandError('Feedback status is invalid')
  }
  return status
}

export const parseFeedbackCommand = (argumentsList) => {
  if (!Array.isArray(argumentsList) || !argumentsList.every((value) => typeof value === 'string')) {
    throw createCommandError('Feedback command arguments are invalid')
  }

  const [command, ...argumentsAfterCommand] = argumentsList
  if (command === 'summary') {
    if (argumentsAfterCommand.length !== 0) {
      throw createCommandError('Summary does not accept arguments')
    }
    return { kind: 'summary' }
  }

  if (command === 'list') {
    if (argumentsAfterCommand.length === 0) {
      return { kind: 'list', limit: defaultListLimit }
    }
    if (
      argumentsAfterCommand.length !== 2 ||
      argumentsAfterCommand[0] !== '--limit'
    ) {
      throw createCommandError('List accepts only --limit <1-100>')
    }
    return {
      kind: 'list',
      limit: parseListLimit(argumentsAfterCommand[1]),
    }
  }

  if (command === 'show') {
    if (argumentsAfterCommand.length !== 1) {
      if (argumentsAfterCommand.length === 0) {
        throw createCommandError('Feedback ID is required')
      }
      throw createCommandError('Show accepts exactly one feedback ID')
    }
    return { kind: 'show', id: parseFeedbackId(argumentsAfterCommand[0]) }
  }

  if (command === 'set-status') {
    if (argumentsAfterCommand.length < 2 || argumentsAfterCommand.length > 3) {
      throw createCommandError('Set-status requires a feedback ID and status')
    }

    const id = parseFeedbackId(argumentsAfterCommand[0])
    const status = normalizeTargetStatus(argumentsAfterCommand[1])
    const redactContact = argumentsAfterCommand[2] === '--redact-contact'

    if (argumentsAfterCommand.length === 3 && !redactContact) {
      throw createCommandError('Set-status accepts only --redact-contact')
    }
    if (redactContact && !terminalFeedbackStatuses.has(status)) {
      throw createCommandError(
        'Contact can be redacted only for a terminal status',
      )
    }

    return { kind: 'set-status', id, status, redactContact }
  }

  throw createCommandError('Feedback command is invalid')
}

export const resolveFeedbackTransition = (
  currentStatus,
  requestedStatus,
  now = () => new Date(),
) => {
  const targetStatus = normalizeTargetStatus(requestedStatus)

  if (currentStatus === FeedbackStatus.CLOSED) {
    throw createCommandError('Closed feedback cannot be reopened')
  }
  if (currentStatus === FeedbackStatus.INVALID) {
    throw createCommandError('Invalid feedback cannot be reopened')
  }
  if (!feedbackStatusValues.includes(currentStatus)) {
    throw createCommandError('Feedback has an invalid current status')
  }
  if (currentStatus === targetStatus) {
    throw createCommandError('Feedback already has the requested status')
  }

  if (
    currentStatus === FeedbackStatus.REVIEWING &&
    targetStatus === FeedbackStatus.REVIEWING
  ) {
    throw createCommandError('Feedback already has the requested status')
  }

  return {
    status: targetStatus,
    handledAt: terminalFeedbackStatuses.has(targetStatus)
      ? getCurrentDate(now)
      : null,
  }
}

const statusCounts = (statuses, rows) => {
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]))
  for (const row of rows) {
    if (Object.hasOwn(counts, row.status) && Number.isInteger(row._count?._all)) {
      counts[row.status] = row._count._all
    }
  }
  return counts
}

const getAgeBucketCounts = async (prisma, currentTime) => {
  const oneDayBefore = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000)
  const sevenDaysBefore = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000)
  const [under24Hours, oneToSevenDays, overSevenDays] = await Promise.all([
    prisma.feedback.count({ where: { createdAt: { gte: oneDayBefore } } }),
    prisma.feedback.count({
      where: { createdAt: { gte: sevenDaysBefore, lt: oneDayBefore } },
    }),
    prisma.feedback.count({ where: { createdAt: { lt: sevenDaysBefore } } }),
  ])

  return { under24Hours, oneToSevenDays, overSevenDays }
}

export const getFeedbackSummary = async ({ prisma, now = () => new Date() }) => {
  const currentTime = getCurrentDate(now)
  const [feedbackByStatus, ageBuckets] = await Promise.all([
    prisma.feedback.groupBy({ by: ['status'], _count: { _all: true } }),
    getAgeBucketCounts(prisma, currentTime),
  ])

  return {
    status: statusCounts(feedbackStatusValues, feedbackByStatus),
    ageBuckets,
  }
}

export const listFeedbackMetadata = async ({ prisma, limit }) =>
  prisma.feedback.findMany({
    where: { status: FeedbackStatus.PENDING },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    select: metadataSelect,
    take: limit,
  })

export const showFeedback = async ({ prisma, id }) =>
  prisma.feedback.findUnique({
    where: { id },
    select: detailSelect,
  })

const runGuardedFeedbackUpdate = async (updateMany, argumentsForUpdate) => {
  let updateResult
  try {
    updateResult = updateMany(argumentsForUpdate)
  } catch {
    throw createStatusOperationError('Feedback update was not dispatched')
  }

  try {
    return await updateResult
  } catch {
    throw createStatusOperationError(
      'Feedback update result is unknown',
      'unknown',
    )
  }
}

const redactFeedbackAndQueuedNotification = async ({
  prisma,
  id,
  currentStatus,
  data,
  result,
}) => {
  let transaction
  try {
    transaction = prisma.$transaction(async (client) => {
      const deduplicationKey = `feedback:${id}`
      await client.emailOutbox.deleteMany({
        where: {
          deduplicationKey,
          status: {
            in: [EmailOutboxStatus.PENDING, EmailOutboxStatus.FAILED],
          },
        },
      })
      const remainingNotification = await client.emailOutbox.findUnique({
        where: { deduplicationKey },
        select: { status: true },
      })
      if (
        remainingNotification?.status === EmailOutboxStatus.PROCESSING
      ) {
        throw createStatusOperationError(
          'Feedback notification is currently being delivered',
        )
      }
      if (
        remainingNotification &&
        remainingNotification.status !== EmailOutboxStatus.SENT
      ) {
        throw createStatusOperationError(
          'Feedback notification could not be redacted',
        )
      }

      const updated = await runGuardedFeedbackUpdate(
        client.feedback.updateMany.bind(client.feedback),
        {
          where: { id, status: currentStatus },
          data,
        },
      )
      if (updated.count !== 1) {
        throw createStatusOperationError(
          'Feedback status changed before update',
        )
      }

      return result
    })
  } catch {
    throw createStatusOperationError(
      'Feedback redaction was not dispatched',
    )
  }

  try {
    return await transaction
  } catch (error) {
    if (error instanceof FeedbackStatusOperationError) {
      throw error
    }
    throw createStatusOperationError(
      'Feedback redaction result is unknown',
      'unknown',
    )
  }
}

export const setFeedbackStatus = async ({
  prisma,
  id,
  status,
  redactContact,
  now = () => new Date(),
}) => {
  let current
  try {
    current = await prisma.feedback.findUnique({
      where: { id },
      select: { status: true },
    })
  } catch {
    throw createStatusOperationError('Feedback could not be read')
  }
  if (!current) throw createStatusOperationError('Feedback was not found')

  let targetStatus
  try {
    targetStatus = normalizeTargetStatus(status)
  } catch (error) {
    throw createStatusOperationError(
      error instanceof FeedbackCommandError
        ? error.message
        : 'Feedback status is invalid',
    )
  }
  if (
    terminalFeedbackStatuses.has(current.status) &&
    current.status === targetStatus &&
    redactContact
  ) {
    return redactFeedbackAndQueuedNotification({
      prisma,
      id,
      currentStatus: current.status,
      data: { contact: null },
      result: {
        id,
        status: targetStatus,
        redactedContact: true,
      },
    })
  }

  let transition
  try {
    transition = resolveFeedbackTransition(current.status, status, now)
  } catch (error) {
    throw createStatusOperationError(
      error instanceof FeedbackCommandError
        ? error.message
        : 'Feedback transition could not be resolved',
    )
  }
  if (redactContact && !terminalFeedbackStatuses.has(transition.status)) {
    throw createStatusOperationError(
      'Contact can be redacted only for a terminal status',
    )
  }
  const data = {
    status: transition.status,
    handledAt: transition.handledAt,
  }
  if (redactContact) data.contact = null

  if (redactContact) {
    return redactFeedbackAndQueuedNotification({
      prisma,
      id,
      currentStatus: current.status,
      data,
      result: {
        id,
        status: transition.status,
        redactedContact: true,
      },
    })
  }

  const updated = await runGuardedFeedbackUpdate(
    prisma.feedback.updateMany.bind(prisma.feedback),
    {
      where: { id, status: current.status },
      data,
    },
  )
  if (updated.count !== 1) {
    throw createStatusOperationError('Feedback status changed before update')
  }

  return {
    id,
    status: transition.status,
    redactedContact: false,
  }
}

export const executeFeedbackCommand = async ({ prisma, command, now }) => {
  if (command.kind === 'summary') return getFeedbackSummary({ prisma, now })
  if (command.kind === 'list') return listFeedbackMetadata({ prisma, limit: command.limit })
  if (command.kind === 'show') return showFeedback({ prisma, id: command.id })
  if (command.kind === 'set-status') {
    return setFeedbackStatus({ ...command, prisma, now })
  }

  throw new Error('Feedback command is invalid')
}

export const getOperationsStatus = async ({
  prisma,
  now = () => new Date(),
}) => {
  const currentTime = getCurrentDate(now)
  await prisma.$connect()
  const [feedbackByStatus, emailOutboxByStatus, oldestPendingEmail] =
    await Promise.all([
      prisma.feedback.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.emailOutbox.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.emailOutbox.findFirst({
        where: { status: EmailOutboxStatus.PENDING },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: { createdAt: true },
      }),
    ])
  const oldestCreatedAt = oldestPendingEmail?.createdAt
  const oldestPendingEmailAgeSeconds =
    oldestCreatedAt instanceof Date
      ? Math.max(0, Math.floor((currentTime.getTime() - oldestCreatedAt.getTime()) / 1000))
      : null
  const feedbackCounts = statusCounts(feedbackStatusValues, feedbackByStatus)
  const emailOutboxCounts = statusCounts(
    emailOutboxStatusValues,
    emailOutboxByStatus,
  )

  return {
    timestamp: currentTime.toISOString(),
    databaseConnected: true,
    feedbackPending: feedbackCounts.PENDING,
    feedbackReviewing: feedbackCounts.REVIEWING,
    feedbackInvalid: feedbackCounts.INVALID,
    feedbackClosed: feedbackCounts.CLOSED,
    emailOutboxPending: emailOutboxCounts.PENDING,
    emailOutboxProcessing: emailOutboxCounts.PROCESSING,
    emailOutboxSent: emailOutboxCounts.SENT,
    emailOutboxFailed: emailOutboxCounts.FAILED,
    oldestPendingEmailAgeSeconds,
  }
}

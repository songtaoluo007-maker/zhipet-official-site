import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const fullGitShaPattern = /^[0-9a-f]{40}$/
const safeTokenPattern = /^[A-Z0-9_-]{1,80}$/
const operationTypes = new Set(['job_started', 'job_completed', 'job_failed'])
const operationJobs = new Set(['mail_delivery', 'data_purge'])
const operationStatuses = new Set(['started', 'complete', 'failed'])
const maximumIndexedCount = Number.MAX_SAFE_INTEGER
const countNames = new Set([
  'processed',
  'sent',
  'deferred',
  'failed',
  'feedback',
  'emailOutbox',
])

const getShortRelease = (value) =>
  typeof value === 'string' && fullGitShaPattern.test(value.trim())
    ? value.trim().slice(0, 12)
    : undefined

const getReleaseFromFile = (releaseDirectory) => {
  try {
    return getShortRelease(
      readFileSync(resolve(releaseDirectory, '.release-commit'), 'utf8'),
    )
  } catch {
    return undefined
  }
}

export const resolveOperationRelease = (
  releaseSha,
  {
    environmentReleaseSha = process.env.ZHIPET_RELEASE_SHA,
    releaseDirectory = process.cwd(),
  } = {},
) =>
  getShortRelease(releaseSha) ??
  getShortRelease(environmentReleaseSha) ??
  getReleaseFromFile(releaseDirectory) ??
  'unknown'

export const sanitizeOperationErrorCode = (value, fallback = 'UNKNOWN_ERROR') => {
  if (typeof value !== 'string') return fallback

  const normalized = value.trim().toUpperCase()
  return safeTokenPattern.test(normalized) ? normalized : fallback
}

export const getOperationErrorCode = (error, fallback) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return sanitizeOperationErrorCode(error.code, fallback)
  }

  return fallback
}

const getBoundedDuration = (value) =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.round(value))
    : undefined

const getBoundedCounts = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined

  const entries = Object.entries(value)
    .filter(
      ([name, count]) =>
        countNames.has(name) && typeof count === 'number' && Number.isFinite(count),
    )
    .map(([name, count]) => [
      name,
      Math.min(maximumIndexedCount, Math.max(0, Math.round(count))),
    ])

  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

export const createOperationEntry = ({
  type,
  job,
  status,
  durationMs,
  counts,
  errorCode,
  releaseSha,
} = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    service: 'zhipet-operations',
    type: operationTypes.has(type) ? type : 'job_failed',
    job: operationJobs.has(job) ? job : 'unknown',
    status: operationStatuses.has(status) ? status : 'failed',
    release: resolveOperationRelease(releaseSha),
  }
  const boundedDuration = getBoundedDuration(durationMs)
  const boundedCounts = getBoundedCounts(counts)

  if (boundedDuration !== undefined) entry.durationMs = boundedDuration
  if (boundedCounts !== undefined) entry.counts = boundedCounts
  if (
    entry.type === 'job_completed' &&
    entry.job === 'mail_delivery' &&
    boundedCounts?.failed !== undefined
  ) {
    entry.failedCount = boundedCounts.failed
  }
  if (errorCode !== undefined) entry.errorCode = sanitizeOperationErrorCode(errorCode)

  return entry
}

export const emitOperationLog = (input) => {
  const entry = createOperationEntry(input)
  process.stdout.write(`${JSON.stringify(entry)}\n`)
  return entry
}

export const runOperationJob = async ({
  job,
  execute,
  cleanup = [],
  emitLog = emitOperationLog,
  errorCodeFallback,
  cleanupErrorCodeFallback,
  now = Date.now,
}) => {
  const startedAt = now()
  emitLog({
    type: 'job_started',
    job,
    status: 'started',
  })

  let counts
  let errorCode

  try {
    counts = await execute()
  } catch (error) {
    errorCode = getOperationErrorCode(error, errorCodeFallback)
  }

  for (const cleanupOperation of cleanup) {
    try {
      await cleanupOperation()
    } catch (error) {
      errorCode ??= getOperationErrorCode(error, cleanupErrorCodeFallback)
    }
  }

  const durationMs = now() - startedAt
  if (errorCode) {
    emitLog({
      type: 'job_failed',
      job,
      status: 'failed',
      durationMs,
      errorCode,
    })
    return { exitCode: 1, errorCode }
  }

  emitLog({
    type: 'job_completed',
    job,
    status: 'complete',
    durationMs,
    counts,
  })
  return { exitCode: 0, counts }
}

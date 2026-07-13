import { createError, getRequestIP, setResponseHeader, type H3Event } from 'h3'

interface RateLimitBucket {
  count: number
  resetAt: number
}

const globalForRateLimit = globalThis as unknown as {
  rateLimitBuckets?: Map<string, RateLimitBucket>
}

const buckets = globalForRateLimit.rateLimitBuckets ?? new Map<string, RateLimitBucket>()

if (import.meta.dev) {
  globalForRateLimit.rateLimitBuckets = buckets
}

export const assertRateLimit = (
  event: H3Event,
  action: string,
  options: { limit: number; windowMs: number },
) => {
  const now = Date.now()
  const requestIp = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const key = action + ':' + requestIp
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    setResponseHeader(event, 'X-RateLimit-Limit', options.limit)
    setResponseHeader(event, 'X-RateLimit-Remaining', options.limit - 1)
    return
  }

  if (current.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    setResponseHeader(event, 'Retry-After', retryAfterSeconds)
    setResponseHeader(event, 'X-RateLimit-Limit', options.limit)
    setResponseHeader(event, 'X-RateLimit-Remaining', 0)
    throw createError({
      statusCode: 429,
      message: '请求过于频繁，请稍后重试',
    })
  }

  current.count += 1
  setResponseHeader(event, 'X-RateLimit-Limit', options.limit)
  setResponseHeader(event, 'X-RateLimit-Remaining', options.limit - current.count)
}

import { createError, getRequestIP, setResponseHeader, type H3Event } from 'h3'
import {
  FixedWindowRateLimiter,
  isLoopbackAddress,
} from '~~/server/domain/rate-limit'

const globalForRateLimit = globalThis as unknown as {
  rateLimiter?: FixedWindowRateLimiter
}

const rateLimiter =
  globalForRateLimit.rateLimiter ?? new FixedWindowRateLimiter({ maxBuckets: 10_000 })

if (import.meta.dev) {
  globalForRateLimit.rateLimiter = rateLimiter
}

export const assertRateLimit = (
  event: H3Event,
  action: string,
  options: { limit: number; windowMs: number },
) => {
  const remoteAddress = event.node.req.socket.remoteAddress
  const requestIp =
    getRequestIP(event, {
      xForwardedFor: isLoopbackAddress(remoteAddress),
    }) ?? 'unknown'
  const key = action + ':' + requestIp
  const decision = rateLimiter.consume(key, options.limit, options.windowMs)

  setResponseHeader(event, 'X-RateLimit-Limit', options.limit)
  setResponseHeader(event, 'X-RateLimit-Remaining', decision.remaining)
  setResponseHeader(event, 'X-RateLimit-Reset', Math.ceil(decision.resetAt / 1_000))

  if (!decision.allowed) {
    setResponseHeader(event, 'Retry-After', decision.retryAfterSeconds)
    throw createError({
      statusCode: 429,
      message: '请求过于频繁，请稍后重试',
    })
  }
}

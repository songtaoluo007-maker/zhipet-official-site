import { describe, expect, it } from 'vitest'
import {
  FixedWindowRateLimiter,
  isLoopbackAddress,
} from '../../server/domain/rate-limit'

describe('fixed-window rate limiting', () => {
  it('blocks requests after the configured limit until the window resets', () => {
    const limiter = new FixedWindowRateLimiter({ maxBuckets: 10 })

    expect(limiter.consume('feedback:client-a', 2, 1_000, 0)).toMatchObject({
      allowed: true,
      remaining: 1,
    })
    expect(limiter.consume('feedback:client-a', 2, 1_000, 100)).toMatchObject({
      allowed: true,
      remaining: 0,
    })
    expect(limiter.consume('feedback:client-a', 2, 1_000, 200)).toEqual({
      allowed: false,
      remaining: 0,
      resetAt: 1_000,
      retryAfterSeconds: 1,
    })

    expect(limiter.consume('feedback:client-a', 2, 1_000, 1_000)).toMatchObject({
      allowed: true,
      remaining: 1,
      resetAt: 2_000,
    })
  })

  it('keeps the in-memory bucket store bounded under identifier churn', () => {
    const limiter = new FixedWindowRateLimiter({ maxBuckets: 2 })

    limiter.consume('feedback:client-a', 1, 10_000, 0)
    limiter.consume('feedback:client-b', 1, 10_000, 1)
    limiter.consume('feedback:client-c', 1, 10_000, 2)

    expect(limiter.bucketCount).toBe(2)
    expect(limiter.consume('feedback:client-a', 1, 10_000, 3)).toMatchObject({
      allowed: true,
    })
    expect(limiter.bucketCount).toBe(2)
  })

  it('prunes expired buckets before admitting new identifiers', () => {
    const limiter = new FixedWindowRateLimiter({ maxBuckets: 3, pruneIntervalMs: 50 })

    limiter.consume('feedback:client-a', 1, 50, 0)
    limiter.consume('feedback:client-b', 1, 50, 1)
    limiter.consume('feedback:client-c', 1, 50, 100)

    expect(limiter.bucketCount).toBe(1)
  })
})

describe('trusted proxy boundary', () => {
  it.each(['127.0.0.1', '::1', '::ffff:127.0.0.1'])(
    'recognizes loopback address %s',
    (address) => {
      expect(isLoopbackAddress(address)).toBe(true)
    },
  )

  it.each([undefined, '10.0.0.8', '203.0.113.10', '::ffff:203.0.113.10'])(
    'rejects non-loopback address %s',
    (address) => {
      expect(isLoopbackAddress(address)).toBe(false)
    },
  )
})

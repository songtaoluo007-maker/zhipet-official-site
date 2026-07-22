interface RateLimitBucket {
  count: number
  resetAt: number
}

export type RateLimitDecision =
  | {
      allowed: true
      remaining: number
      resetAt: number
    }
  | {
      allowed: false
      remaining: 0
      resetAt: number
      retryAfterSeconds: number
    }

interface FixedWindowRateLimiterOptions {
  maxBuckets: number
  pruneIntervalMs?: number
}

const defaultPruneIntervalMs = 60_000

const assertPositiveInteger = (value: number, name: string) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive integer`)
  }
}

export const isLoopbackAddress = (address: string | undefined) => {
  if (!address) {
    return false
  }

  const normalizedAddress = address.trim().toLowerCase()

  if (normalizedAddress === '::1' || normalizedAddress === '0:0:0:0:0:0:0:1') {
    return true
  }

  const ipv4Address = normalizedAddress.startsWith('::ffff:')
    ? normalizedAddress.slice('::ffff:'.length)
    : normalizedAddress

  return /^127(?:\.\d{1,3}){3}$/.test(ipv4Address)
}

export class FixedWindowRateLimiter {
  readonly #buckets = new Map<string, RateLimitBucket>()
  readonly #maxBuckets: number
  readonly #pruneIntervalMs: number
  #nextPruneAt = 0

  constructor(options: FixedWindowRateLimiterOptions) {
    assertPositiveInteger(options.maxBuckets, 'maxBuckets')
    const pruneIntervalMs = options.pruneIntervalMs ?? defaultPruneIntervalMs
    assertPositiveInteger(pruneIntervalMs, 'pruneIntervalMs')

    this.#maxBuckets = options.maxBuckets
    this.#pruneIntervalMs = pruneIntervalMs
  }

  get bucketCount() {
    return this.#buckets.size
  }

  consume(
    key: string,
    limit: number,
    windowMs: number,
    now = Date.now(),
  ): RateLimitDecision {
    if (!key) {
      throw new TypeError('key must not be empty')
    }
    assertPositiveInteger(limit, 'limit')
    assertPositiveInteger(windowMs, 'windowMs')

    const current = this.#buckets.get(key)

    if (current && current.resetAt > now) {
      if (current.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: current.resetAt,
          retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
        }
      }

      current.count += 1
      return {
        allowed: true,
        remaining: limit - current.count,
        resetAt: current.resetAt,
      }
    }

    if (current) {
      this.#buckets.delete(key)
    }

    this.#pruneExpired(now)
    this.#makeRoomForBucket()

    const resetAt = now + windowMs
    this.#buckets.set(key, { count: 1, resetAt })

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
    }
  }

  #pruneExpired(now: number) {
    if (now < this.#nextPruneAt) {
      return
    }

    for (const [key, bucket] of this.#buckets) {
      if (bucket.resetAt <= now) {
        this.#buckets.delete(key)
      }
    }

    this.#nextPruneAt = now + this.#pruneIntervalMs
  }

  #makeRoomForBucket() {
    if (this.#buckets.size < this.#maxBuckets) {
      return
    }

    const oldestKey = this.#buckets.keys().next().value

    if (oldestKey !== undefined) {
      this.#buckets.delete(oldestKey)
    }
  }
}

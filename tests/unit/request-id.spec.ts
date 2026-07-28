import { describe, expect, it } from 'vitest'
import { resolveRequestId } from '../../server/domain/request-id'

describe('request identity', () => {
  it('accepts an Nginx request ID only from loopback', () => {
    expect(resolveRequestId({
      remoteAddress: '127.0.0.1',
      forwardedRequestId: '0123456789abcdef0123456789abcdef',
      generatedRequestId: 'generated-id',
    })).toBe('0123456789abcdef0123456789abcdef')
  })

  it('accepts UUID request IDs from loopback', () => {
    expect(resolveRequestId({
      remoteAddress: '::ffff:127.0.0.1',
      forwardedRequestId: '2f1b6d36-b934-4f2a-89ea-37f44faf4e48',
      generatedRequestId: 'generated-id',
    })).toBe('2f1b6d36-b934-4f2a-89ea-37f44faf4e48')
  })

  it('replaces untrusted or malformed values', () => {
    expect(resolveRequestId({
      remoteAddress: '203.0.113.10',
      forwardedRequestId: '0123456789abcdef0123456789abcdef',
      generatedRequestId: 'generated-id',
    })).toBe('generated-id')
    expect(resolveRequestId({
      remoteAddress: '127.0.0.1',
      forwardedRequestId: '../../secret',
      generatedRequestId: 'generated-id',
    })).toBe('generated-id')
  })
})

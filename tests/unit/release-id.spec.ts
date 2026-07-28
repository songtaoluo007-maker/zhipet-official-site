import { describe, expect, it } from 'vitest'
import {
  getPublicReleaseId,
  parseReleaseSha,
} from '../../server/domain/release-id'

describe('release identity', () => {
  it('accepts only a full lowercase Git SHA', () => {
    const sha = 'c35adf55d27ea17e24a945f95f124677e3362d54'

    expect(parseReleaseSha(sha)).toBe(sha)
    expect(parseReleaseSha('main')).toBeUndefined()
    expect(parseReleaseSha('c35adf5')).toBeUndefined()
    expect(parseReleaseSha('../secret')).toBeUndefined()
  })

  it('exposes only a short non-sensitive label', () => {
    expect(
      getPublicReleaseId(
        'c35adf55d27ea17e24a945f95f124677e3362d54',
        'unknown',
      ),
    ).toBe('c35adf55d27e')
    expect(getPublicReleaseId(undefined, 'development')).toBe('development')
  })
})

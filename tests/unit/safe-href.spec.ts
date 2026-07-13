import { describe, expect, it } from 'vitest'
import { isInternalHref, toSafeHref } from '../../app/utils/safe-href'

describe('safe href utilities', () => {
  it('allows internal, hash, http, https, mail, and telephone links', () => {
    expect(toSafeHref('/contact')).toBe('/contact')
    expect(toSafeHref('#products')).toBe('#products')
    expect(toSafeHref('https://example.com/path')).toBe('https://example.com/path')
    expect(toSafeHref('mailto:hello@example.com')).toBe('mailto:hello@example.com')
    expect(toSafeHref('tel:+8613800000000')).toBe('tel:+8613800000000')
  })

  it('rejects active or ambiguous URL schemes', () => {
    expect(toSafeHref('javascript:alert(1)')).toBeUndefined()
    expect(toSafeHref('data:text/html,<script>alert(1)</script>')).toBeUndefined()
    expect(toSafeHref('//evil.example/path')).toBeUndefined()
  })

  it('recognizes only same-site path and hash links as internal', () => {
    expect(isInternalHref('/contact')).toBe(true)
    expect(isInternalHref('#feedback')).toBe(true)
    expect(isInternalHref('https://example.com')).toBe(false)
    expect(isInternalHref('//evil.example')).toBe(false)
  })
})

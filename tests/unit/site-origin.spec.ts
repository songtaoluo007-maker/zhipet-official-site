import { describe, expect, it } from 'vitest'
import { resolveSiteOrigin } from '../../server/utils/site-origin-core'

describe('resolveSiteOrigin', () => {
  it('prefers a configured public site URL over the request origin', () => {
    expect(resolveSiteOrigin('https://www.zhipet.example/path?q=1', 'http://127.0.0.1:3000')).toBe(
      'https://www.zhipet.example',
    )
  })

  it('falls back to the request origin when the configured URL is empty or invalid', () => {
    expect(resolveSiteOrigin('', 'http://127.0.0.1:3000')).toBe('http://127.0.0.1:3000')
    expect(resolveSiteOrigin('javascript:alert(1)', 'http://127.0.0.1:3000')).toBe(
      'http://127.0.0.1:3000',
    )
  })
})

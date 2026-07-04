import { describe, expect, it } from 'vitest'
import { resolveSiteBaseUrl, resolveSiteUrl } from '../../server/utils/site-origin-core'

describe('site URL helpers', () => {
  it('prefers a configured public site URL and keeps a base path for GitHub Pages', () => {
    expect(
      resolveSiteBaseUrl(
        'https://songtaoluo007-maker.github.io/zhipet-official-site/?q=1',
        'http://127.0.0.1:3000',
      ),
    ).toBe('https://songtaoluo007-maker.github.io/zhipet-official-site/')
  })

  it('falls back to the request origin when the configured URL is empty or invalid', () => {
    expect(resolveSiteBaseUrl('', 'http://127.0.0.1:3000')).toBe('http://127.0.0.1:3000/')
    expect(resolveSiteBaseUrl('javascript:alert(1)', 'http://127.0.0.1:3000')).toBe(
      'http://127.0.0.1:3000/',
    )
  })

  it('builds canonical URLs under the configured base path', () => {
    const baseUrl = 'https://songtaoluo007-maker.github.io/zhipet-official-site/'

    expect(resolveSiteUrl('/', baseUrl)).toBe(baseUrl)
    expect(resolveSiteUrl('/products', baseUrl)).toBe(
      'https://songtaoluo007-maker.github.io/zhipet-official-site/products',
    )
    expect(resolveSiteUrl('/sitemap.xml', baseUrl)).toBe(
      'https://songtaoluo007-maker.github.io/zhipet-official-site/sitemap.xml',
    )
  })
})

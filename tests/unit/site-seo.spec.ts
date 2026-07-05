import { describe, expect, it } from 'vitest'
import {
  createShareImageUrl,
  createWebPageJsonLd,
  resolveAbsoluteUrl,
  resolveSiteOrigin,
} from '../../app/utils/site-seo'

describe('site seo helpers', () => {
  it('preserves GitHub Pages base paths when resolving absolute URLs', () => {
    const siteOrigin = resolveSiteOrigin(
      'https://songtaoluo007-maker.github.io/zhipet-official-site/',
      'http://127.0.0.1:3000',
    )

    expect(siteOrigin).toBe('https://songtaoluo007-maker.github.io/zhipet-official-site')
    expect(resolveAbsoluteUrl('/research/health-signals', siteOrigin)).toBe(
      'https://songtaoluo007-maker.github.io/zhipet-official-site/research/health-signals',
    )
    expect(createShareImageUrl(siteOrigin)).toBe(
      'https://songtaoluo007-maker.github.io/zhipet-official-site/images/share/zhipet-og.png',
    )
  })

  it('creates bounded WebPage JSON-LD without fake organization details', () => {
    const jsonLd = createWebPageJsonLd({
      name: '健康研究院',
      description: '内容待项目方确认。',
      path: '/research',
      siteOrigin: 'https://example.com/zhipet',
    })

    expect(jsonLd).toMatchObject({
      '@type': 'WebPage',
      name: '健康研究院',
      url: 'https://example.com/zhipet/research',
    })
    expect(JSON.stringify(jsonLd)).not.toMatch(/address|telephone|foundingDate/)
  })
})

import { describe, expect, it } from 'vitest'
import { resolvePublicAssetUrl } from '../../app/utils/public-asset-url'

describe('resolvePublicAssetUrl', () => {
  it('keeps root-relative assets unchanged for root deployments', () => {
    expect(resolvePublicAssetUrl('/images/example.webp', '/')).toBe('/images/example.webp')
  })

  it('prefixes root-relative assets for subpath deployments', () => {
    expect(resolvePublicAssetUrl('/images/example.webp', '/zhipet-official-site/')).toBe(
      '/zhipet-official-site/images/example.webp',
    )
  })

  it('does not duplicate an existing deployment prefix', () => {
    expect(
      resolvePublicAssetUrl(
        '/zhipet-official-site/images/example.webp',
        '/zhipet-official-site/',
      ),
    ).toBe('/zhipet-official-site/images/example.webp')
  })

  it('leaves external and relative sources unchanged', () => {
    expect(resolvePublicAssetUrl('https://cdn.example.com/image.webp', '/site/')).toBe(
      'https://cdn.example.com/image.webp',
    )
    expect(resolvePublicAssetUrl('images/example.webp', '/site/')).toBe('images/example.webp')
  })
})

import { describe, expect, it } from 'vitest'
import {
  isSha256Digest,
  parseAllowedDownloadHosts,
  toSafeDownloadHref,
} from '../../app/utils/app-download'

describe('app download configuration safety', () => {
  it('accepts only HTTPS links from configured hosts or their subdomains', () => {
    const allowedHosts = parseAllowedDownloadHosts('apps.apple.com, download.zhipet.example')

    expect(toSafeDownloadHref('https://apps.apple.com/app/id123', allowedHosts)).toBe(
      'https://apps.apple.com/app/id123',
    )
    expect(toSafeDownloadHref('https://cdn.download.zhipet.example/app.apk', allowedHosts)).toBe(
      'https://cdn.download.zhipet.example/app.apk',
    )
    expect(toSafeDownloadHref('http://apps.apple.com/app/id123', allowedHosts)).toBeUndefined()
    expect(
      toSafeDownloadHref('https://apps.apple.com.attacker.example/app', allowedHosts),
    ).toBeUndefined()
  })

  it('publishes an Android digest only when it is a complete SHA-256 value', () => {
    expect(isSha256Digest('a'.repeat(64))).toBe(true)
    expect(isSha256Digest('not-a-digest')).toBe(false)
  })
})

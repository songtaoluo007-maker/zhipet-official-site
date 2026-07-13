const normalizeHost = (value: string) => value.trim().toLowerCase().replace(/^\.+/, '')

export const parseAllowedDownloadHosts = (value: string) =>
  value
    .split(',')
    .map(normalizeHost)
    .filter(Boolean)

const isAllowedHost = (hostname: string, allowedHosts: string[]) => {
  const normalizedHostname = hostname.toLowerCase()

  return allowedHosts.some(
    (host) => normalizedHostname === host || normalizedHostname.endsWith(`.${host}`),
  )
}

export const toSafeDownloadHref = (value: string, allowedHosts: string[]) => {
  const trimmed = value.trim()
  if (!trimmed || allowedHosts.length === 0) return undefined

  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'https:' || !isAllowedHost(url.hostname, allowedHosts)) {
      return undefined
    }

    return url.toString()
  } catch {
    return undefined
  }
}

export const isSha256Digest = (value: string) => /^[a-f0-9]{64}$/i.test(value.trim())

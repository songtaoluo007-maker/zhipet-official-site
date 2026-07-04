const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`)

export const resolveSiteBaseUrl = (
  configuredSiteUrl: string | undefined,
  fallbackOrigin: string,
) => {
  const candidate = configuredSiteUrl?.trim() || fallbackOrigin

  try {
    const url = new URL(candidate)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return ensureTrailingSlash(fallbackOrigin)
    }

    url.search = ''
    url.hash = ''

    return ensureTrailingSlash(url.toString())
  } catch {
    return ensureTrailingSlash(fallbackOrigin)
  }
}

export const resolveSiteUrl = (route: string, siteBaseUrl: string) => {
  const normalizedRoute = route.replace(/^\/+/, '')

  return new URL(normalizedRoute, siteBaseUrl).toString()
}

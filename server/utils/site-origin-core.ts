export const resolveSiteOrigin = (
  configuredSiteUrl: string | undefined,
  fallbackOrigin: string,
) => {
  const candidate = configuredSiteUrl?.trim() || fallbackOrigin

  try {
    const url = new URL(candidate)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return fallbackOrigin
    }

    return url.origin
  } catch {
    return fallbackOrigin
  }
}

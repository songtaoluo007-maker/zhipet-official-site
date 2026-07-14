export const resolvePublicAssetUrl = (source: string, baseURL: string) => {
  if (!source.startsWith('/')) {
    return source
  }

  const normalizedBase = baseURL === '/' ? '/' : `/${baseURL.replace(/^\/+|\/+$/g, '')}/`

  if (normalizedBase === '/' || source.startsWith(normalizedBase)) {
    return source
  }

  return `${normalizedBase}${source.replace(/^\/+/, '')}`
}

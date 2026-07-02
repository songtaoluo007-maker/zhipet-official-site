const allowedProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:'])

export const toSafeHref = (href: string | undefined) => {
  const value = href?.trim()

  if (!value) {
    return undefined
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    return value
  }

  if (value.startsWith('#')) {
    return value
  }

  try {
    const url = new URL(value)
    return allowedProtocols.has(url.protocol) ? url.toString() : undefined
  } catch {
    return undefined
  }
}

export const isInternalHref = (href: string | undefined) => {
  const safeHref = toSafeHref(href)
  return Boolean(safeHref?.startsWith('/') || safeHref?.startsWith('#'))
}

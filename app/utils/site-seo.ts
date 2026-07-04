export interface SeoBreadcrumbItem {
  name: string
  path: string
}

export interface WebPageJsonLdInput {
  name: string
  description: string
  path: string
  siteOrigin: string
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const resolveSiteOrigin = (configuredSiteUrl: string | undefined, requestOrigin: string) => {
  const siteUrl = configuredSiteUrl?.trim()

  if (!siteUrl) {
    return trimTrailingSlash(requestOrigin)
  }

  return trimTrailingSlash(siteUrl)
}

export const resolveAbsoluteUrl = (path: string, siteOrigin: string) =>
  new URL(path.replace(/^\/+/, ''), `${trimTrailingSlash(siteOrigin)}/`).toString()

export const createShareImageUrl = (siteOrigin: string) =>
  resolveAbsoluteUrl('/images/share/zhipet-og.png', siteOrigin)

export const createWebSiteJsonLd = (siteOrigin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '知宠 ZHIPET',
  url: resolveAbsoluteUrl('/', siteOrigin),
  inLanguage: 'zh-CN',
})

export const createOrganizationJsonLd = (siteOrigin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '知宠 ZHIPET',
  url: resolveAbsoluteUrl('/', siteOrigin),
  logo: resolveAbsoluteUrl('/favicon.svg', siteOrigin),
})

export const createBreadcrumbJsonLd = (items: SeoBreadcrumbItem[], siteOrigin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: resolveAbsoluteUrl(item.path, siteOrigin),
  })),
})

export const createWebPageJsonLd = ({
  name,
  description,
  path,
  siteOrigin,
}: WebPageJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url: resolveAbsoluteUrl(path, siteOrigin),
  inLanguage: 'zh-CN',
  isPartOf: {
    '@type': 'WebSite',
    name: '知宠 ZHIPET',
    url: resolveAbsoluteUrl('/', siteOrigin),
  },
})

import type { H3Event } from 'h3'
import { getRequestURL } from 'h3'
import { useRuntimeConfig } from '#imports'
import { resolveSiteBaseUrl } from './site-origin-core'

export const getSiteBaseUrl = (event: H3Event) => {
  const runtimeConfig = useRuntimeConfig(event)
  return resolveSiteBaseUrl(runtimeConfig.public.siteUrl, getRequestURL(event).origin)
}

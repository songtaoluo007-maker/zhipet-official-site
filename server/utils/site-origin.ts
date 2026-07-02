import type { H3Event } from 'h3'
import { getRequestURL } from 'h3'
import { useRuntimeConfig } from '#imports'
import { resolveSiteOrigin } from './site-origin-core'

export const getSiteOrigin = (event: H3Event) => {
  const runtimeConfig = useRuntimeConfig(event)
  return resolveSiteOrigin(runtimeConfig.public.siteUrl, getRequestURL(event).origin)
}
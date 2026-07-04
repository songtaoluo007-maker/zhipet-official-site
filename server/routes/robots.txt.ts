import { defineEventHandler, setHeader } from 'h3'
import { getSiteBaseUrl } from '../utils/site-origin'
import { resolveSiteUrl } from '../utils/site-origin-core'

export default defineEventHandler((event) => {
  const siteBaseUrl = getSiteBaseUrl(event)

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return ['User-agent: *', 'Allow: /', `Sitemap: ${resolveSiteUrl('/sitemap.xml', siteBaseUrl)}`].join(
    '\n',
  )
})

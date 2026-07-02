import { defineEventHandler, setHeader } from 'h3'
import { getSiteOrigin } from '../utils/site-origin'

export default defineEventHandler((event) => {
  const origin = getSiteOrigin(event)

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return ['User-agent: *', 'Allow: /', `Sitemap: ${new URL('/sitemap.xml', origin).toString()}`].join(
    '\n',
  )
})

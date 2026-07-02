import { defineEventHandler, setHeader } from 'h3'
import { getSiteOrigin } from '../utils/site-origin'
import { siteRoutes } from '../utils/site-routes'

export default defineEventHandler((event) => {
  const origin = getSiteOrigin(event)
  const urls = siteRoutes
    .map(
      (route) => `  <url>
    <loc>${new URL(route, origin).toString()}</loc>
  </url>`,
    )
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})

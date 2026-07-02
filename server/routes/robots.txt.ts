import { defineEventHandler, getRequestURL, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return ['User-agent: *', 'Allow: /', `Sitemap: ${new URL('/sitemap.xml', origin).toString()}`].join(
    '\n',
  )
})

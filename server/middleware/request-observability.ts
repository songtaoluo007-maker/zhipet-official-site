import { randomUUID } from 'node:crypto'
import { getRequestURL, setResponseHeader } from 'h3'

const ignoredPathPrefixes = ['/_nuxt/', '/images/']
const ignoredPaths = new Set(['/favicon.svg', '/site.webmanifest'])

export default defineEventHandler((event) => {
  if (import.meta.dev) {
    return
  }

  const pathname = getRequestURL(event).pathname

  if (ignoredPaths.has(pathname) || ignoredPathPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return
  }

  const requestId = randomUUID()
  const startedAt = performance.now()
  event.context.requestId = requestId
  setResponseHeader(event, 'x-request-id', requestId)

  event.node.res.once('finish', () => {
    const entry = {
      type: 'http_request',
      requestId,
      method: event.method,
      path: pathname,
      statusCode: event.node.res.statusCode,
      durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
      timestamp: new Date().toISOString(),
    }

    process.stdout.write(`${JSON.stringify(entry)}\n`)
  })
})

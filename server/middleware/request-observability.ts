import { randomUUID } from 'node:crypto'
import { getRequestHeader, getRequestURL, setResponseHeader } from 'h3'
import { getPublicReleaseId } from '../domain/release-id'
import { resolveRequestId } from '../domain/request-id'

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

  const requestId = resolveRequestId({
    remoteAddress: event.node.req.socket.remoteAddress,
    forwardedRequestId: getRequestHeader(event, 'x-request-id'),
    generatedRequestId: randomUUID(),
  })
  const startedAt = performance.now()
  event.context.requestId = requestId
  setResponseHeader(event, 'x-request-id', requestId)

  event.node.res.once('finish', () => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      service: 'zhipet-web',
      type: 'http_request',
      requestId,
      release: getPublicReleaseId(
        process.env.ZHIPET_RELEASE_SHA,
        import.meta.dev ? 'development' : 'unknown',
      ),
      method: event.method,
      path: pathname,
      statusCode: event.node.res.statusCode,
      durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
    }

    process.stdout.write(`${JSON.stringify(entry)}\n`)
  })
})

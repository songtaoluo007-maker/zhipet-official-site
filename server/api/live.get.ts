import { setResponseHeader } from 'h3'
import { getPublicReleaseId } from '../domain/release-id'

export default defineEventHandler((event) => {
  setResponseHeader(event, 'cache-control', 'no-store')

  return {
    status: 'ok',
    release: getPublicReleaseId(
      process.env.ZHIPET_RELEASE_SHA,
      import.meta.dev ? 'development' : 'unknown',
    ),
    checkedAt: new Date().toISOString(),
  }
})

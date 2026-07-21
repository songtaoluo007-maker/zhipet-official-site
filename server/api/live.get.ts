import { setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  setResponseHeader(event, 'cache-control', 'no-store')

  return {
    status: 'ok',
    checkedAt: new Date().toISOString(),
  }
})

import { setResponseHeader, setResponseStatus } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'cache-control', 'no-store')

  try {
    await prisma.$queryRaw<Array<{ database: number }>>`SELECT 1 AS database`

    return {
      status: 'ok',
      database: 'reachable',
      checkedAt: new Date().toISOString(),
    }
  } catch {
    setResponseStatus(event, 503, 'Service Unavailable')

    return {
      status: 'degraded',
      database: 'unreachable',
      checkedAt: new Date().toISOString(),
    }
  }
})

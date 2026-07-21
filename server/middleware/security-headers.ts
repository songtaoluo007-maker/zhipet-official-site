import { defineEventHandler, setHeader } from 'h3'
import { browserSecurityHeaders } from '~~/shared/constants/security-headers'

export default defineEventHandler((event) => {
  for (const [name, value] of Object.entries(browserSecurityHeaders)) {
    setHeader(event, name, value)
  }
})

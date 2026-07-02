import { expect, test } from '@playwright/test'

test('site responses include baseline browser security headers', async ({ request }) => {
  const response = await request.get('/')
  const headers = response.headers()

  expect(response.status()).toBe(200)
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['x-frame-options']).toBe('SAMEORIGIN')
  expect(headers['permissions-policy']).toContain('camera=()')
  expect(headers['content-security-policy']).toContain("frame-ancestors 'self'")
})

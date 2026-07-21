import { expect, test } from '@playwright/test'

test('site responses include baseline browser security headers', async ({ request }) => {
  const response = await request.get('/')
  const headers = response.headers()

  expect(response.status()).toBe(200)
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['x-frame-options']).toBe('SAMEORIGIN')
  expect(headers['permissions-policy']).toContain('camera=()')
  expect(headers['cross-origin-opener-policy']).toBe('same-origin')
  expect(headers['cross-origin-resource-policy']).toBe('same-origin')
  expect(headers['x-permitted-cross-domain-policies']).toBe('none')
  expect(headers['content-security-policy']).toContain("frame-ancestors 'self'")
  expect(headers['content-security-policy']).toContain("form-action 'self'")
})

test('liveness probe is independent from database readiness', async ({ request }) => {
  const response = await request.get('/api/live')

  expect(response.status()).toBe(200)
  expect(response.headers()['cache-control']).toContain('no-store')
  await expect(response.json()).resolves.toMatchObject({ status: 'ok' })
})

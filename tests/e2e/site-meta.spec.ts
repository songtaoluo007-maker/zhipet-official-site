import { expect, test } from '@playwright/test'

const canonicalRoutes = [
  '/',
  '/products',
  '/products/smart-collar',
  '/products/app',
  '/products/health-platform',
  '/solutions',
  '/solutions/family',
  '/solutions/hospital',
  '/solutions/store',
  '/about',
  '/partners',
  '/cases',
  '/news',
  '/contact',
  '/demo',
  '/privacy',
  '/terms',
] as const

test('robots route exposes crawl directives and the current sitemap URL', async ({ request }) => {
  const response = await request.get('/robots.txt')
  const body = await response.text()

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  expect(body).toContain('User-agent: *')
  expect(body).toContain('Allow: /')
  expect(body).toContain('Sitemap: http://127.0.0.1:3000/sitemap.xml')
})

test('sitemap route lists current canonical pages without a hard-coded production domain', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml')
  const body = await response.text()

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/xml')
  expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

  for (const route of canonicalRoutes) {
    expect(body).toContain(`<loc>${new URL(route, 'http://127.0.0.1:3000').toString()}</loc>`)
  }

  expect(body).not.toContain('待项目方确认')
  expect(body).not.toContain('zhipet.example')
})

test('unknown routes show the branded not-found experience', async ({ page }) => {
  const response = await page.goto('/not-found-check')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: '页面暂未找到' })).toBeVisible()
  await expect(page.getByRole('link', { name: '返回首页' })).toBeVisible()
  await expect(page.getByRole('link', { name: '查看产品中心' })).toBeVisible()
  await expect(page.getByRole('link', { name: '联系知宠' })).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

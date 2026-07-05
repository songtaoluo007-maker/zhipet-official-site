import { expect, test } from '@playwright/test'
import { canonicalRoutes } from '../../app/data/site-pages'

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

test('home route exposes canonical, share, and structured SEO metadata', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://127.0.0.1:3000/',
  )
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    '知宠 ZHIPET',
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'http://127.0.0.1:3000/images/share/zhipet-og.png',
  )
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    'content',
    '1200',
  )
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
    'content',
    '630',
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  )

  const jsonLdTypes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent ?? '{}')['@type']),
    )

  expect(jsonLdTypes).toContain('WebSite')
  expect(jsonLdTypes).toContain('Organization')
})

test('research detail route exposes article canonical and breadcrumb structured data', async ({
  page,
}) => {
  await page.goto('/research/health-signals')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://127.0.0.1:3000/research/health-signals',
  )
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')

  const jsonLdTypes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent ?? '{}')['@type']),
    )

  expect(jsonLdTypes).toContain('WebPage')
  expect(jsonLdTypes).toContain('BreadcrumbList')
})

test('unknown routes show the branded not-found experience', async ({ page }) => {
  const response = await page.goto('/not-found-check')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: '页面暂未找到' })).toBeVisible()
  await expect(page.getByRole('link', { name: '返回首页' })).toBeVisible()
  await expect(page.getByRole('link', { name: '查看产品中心' })).toBeVisible()
  await expect(page.locator('.error-page__actions').getByRole('link', { name: '帮助中心' })).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

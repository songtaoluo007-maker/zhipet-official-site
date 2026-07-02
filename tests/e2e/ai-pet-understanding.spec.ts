import { expect, test } from '@playwright/test'

test('ai pet understanding page presents probabilistic analysis with safe boundaries', async ({
  page,
}) => {
  await page.goto('/ai-pet-understanding')

  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()

  const h1 = page.getByRole('heading', { level: 1 })
  await expect(h1).toHaveText('用 AI，更好地理解宠物')
  await expect(page.locator('h1')).toHaveCount(1)

  await expect(page.getByLabel('界面与分析逻辑示例').getByText('置信度：74%')).toBeVisible()
  await expect(page.getByText('知宠提供概率分析和风险提示，不对宠物语言进行逐字翻译，也不替代专业兽医诊断。')).toBeVisible()
  await expect(page.getByText('不是宠物语言逐字翻译')).toBeVisible()

  const principleLink = page.getByRole('link', { name: '了解分析原理' })
  await principleLink.focus()
  await expect(principleLink).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#principles/)

  const ctaLink = page.getByRole('link', { name: '体验知宠产品' })
  await expect(ctaLink).toHaveAttribute('href', '/products')
  await ctaLink.click()
  await expect(page).toHaveURL(/\/products$/)
})

test('ai pet understanding page has no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/ai-pet-understanding')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('用 AI，更好地理解宠物')

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})
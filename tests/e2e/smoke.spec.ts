import { expect, test } from '@playwright/test'

test('home route loads formal homepage content with no horizontal overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    '用科技读懂陪伴，让养宠更简单、更智慧',
  )
  await expect(
    page.locator('#what-we-do').getByRole('heading', { name: '知宠在做什么' }),
  ).toBeVisible()
  await expect(page.locator('#products').getByRole('heading', { name: '核心产品' })).toBeVisible()
  await expect(
    page.locator('#solutions').getByRole('heading', { name: '解决方案', exact: true }),
  ).toBeVisible()
  await expect(page.locator('#cases').getByRole('heading', { name: '客户案例' })).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()
  await expect(page.getByText('真实信息待确认')).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('products route loads product center without inventing release status', async ({ page }) => {
  await page.goto('/products')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('产品中心')
  await expect(page.getByRole('heading', { name: '当前产品方向' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '知宠智能项圈' })).toBeVisible()
  await expect(page.getByText('详情待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('smart collar product page shows prototype-safe product details', async ({ page }) => {
  await page.goto('/products/smart-collar')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('知宠智能项圈')
  await expect(page.getByText('24 小时健康守护，让爱更安心')).toBeVisible()
  await expect(page.locator('#values').getByRole('heading', { name: '三项核心价值' })).toBeVisible()
  await expect(
    page.locator('#ecosystem').getByRole('heading', { name: '设备、App 与平台协同' }),
  ).toBeVisible()
  await expect(page.locator('#specifications caption')).toContainText('样机参数，仅供展示')
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('solutions route loads solution center without fake proof', async ({ page }) => {
  await page.goto('/solutions')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('解决方案')
  await expect(page.getByRole('heading', { name: '按场景选择知宠方案' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '家庭养宠' })).toBeVisible()
  await expect(page.getByText('方案细节待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('family solution page shows household-safe scenario details', async ({ page }) => {
  await page.goto('/solutions/family')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('家庭养宠解决方案')
  await expect(page.getByText('把日常健康变化看得更清楚')).toBeVisible()
  await expect(page.locator('#pain-points').getByRole('heading', { name: '家庭养宠常见难点' })).toBeVisible()
  await expect(page.locator('#workflow').getByRole('heading', { name: '家庭健康管理流程' })).toBeVisible()
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})
test('contact route shows safe contact placeholders and disabled submission', async ({ page }) => {
  await page.goto('/contact')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('联系我们')
  await expect(page.getByRole('heading', { name: '联系信息' })).toBeVisible()
  await expect(page.getByText('联系方式待项目方确认')).toBeVisible()
  await expect(page.getByRole('heading', { name: '留下合作需求' })).toBeVisible()
  await expect(page.getByLabel('姓名')).toBeVisible()
  await expect(page.getByRole('button', { name: '提交接口待项目方确认' })).toBeDisabled()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('demo route shows appointment form without pretending backend is live', async ({ page }) => {
  await page.goto('/demo')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('预约演示')
  await expect(page.getByText('演示排期待项目方确认')).toBeVisible()
  await expect(page.getByRole('heading', { name: '选择演示重点' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '预约信息' })).toBeVisible()
  await expect(page.getByLabel('联系人')).toBeVisible()
  await expect(page.getByLabel('关注场景')).toBeVisible()
  await expect(page.getByRole('button', { name: '提交接口待项目方确认' })).toBeDisabled()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

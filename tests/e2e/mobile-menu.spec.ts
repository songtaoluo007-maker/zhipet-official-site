import { expect, test } from '@playwright/test'

test('mobile menu focuses the close button, locks page scroll, and restores trigger focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const menuButton = page.getByRole('button', { name: '打开导航' })
  await expect(menuButton).toBeVisible()
  await expect(menuButton).toBeEnabled()
  await menuButton.click()

  const dialog = page.getByRole('dialog', { name: '移动端导航' })
  const closeButton = dialog.getByRole('button', { name: '关闭菜单' })

  await expect(dialog).toBeVisible()
  await expect(closeButton).toBeFocused()
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe('hidden')

  const brandLink = dialog.getByRole('link', { name: '知宠 ZHIPET' })
  const feedbackLink = dialog.getByRole('link', { name: '意见问题反馈', exact: true }).last()

  await page.keyboard.press('Shift+Tab')
  await expect(brandLink).toBeFocused()

  await page.keyboard.press('Shift+Tab')
  await expect(feedbackLink).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(brandLink).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(dialog).toBeHidden()
  await expect(menuButton).toBeFocused()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
})

test('mobile menu expands only the active or selected navigation section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/products')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: '打开导航' }).click()

  const dialog = page.getByRole('dialog', { name: '移动端导航' })
  const productsToggle = dialog.getByRole('button', { name: '收起产品子菜单' })
  const solutionsToggle = dialog.getByRole('button', { name: '展开解决方案子菜单' })

  await expect(productsToggle).toHaveAttribute('aria-expanded', 'true')
  await expect(solutionsToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(dialog.getByRole('link', { name: '知宠智能挂件' })).toBeVisible()
  await expect(dialog.getByRole('link', { name: '家庭养宠' })).toBeHidden()

  await solutionsToggle.click()

  await expect(dialog.getByRole('button', { name: '展开产品子菜单' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
  await expect(dialog.getByRole('button', { name: '收起解决方案子菜单' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await expect(dialog.getByRole('link', { name: '知宠智能挂件' })).toBeHidden()
  await expect(dialog.getByRole('link', { name: '家庭养宠' })).toBeVisible()
})

import { expect, test } from '@playwright/test'

const expectNoHorizontalOverflow = async (page: import('@playwright/test').Page) => {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )

  expect(hasOverflow).toBe(false)
}

const gotoReady = async (page: import('@playwright/test').Page, path: string) => {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

test('home route presents V2 brand homepage safely', async ({ page }, testInfo) => {
  await gotoReady(page, '/')

  await expect(page).toHaveTitle(/更懂陪伴，更守护健康/)
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  if (testInfo.project.name === 'mobile') {
    await expect(page.getByRole('button', { name: '打开导航' })).toBeVisible()
  } else {
    await expect(
      page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '产品' }),
    ).toHaveAttribute('href', '/products')
  }

  await expect(page.getByRole('link', { name: /预约演示/ }).first()).toHaveAttribute('href', '/demo')
  await expect(page.getByRole('heading', { name: '知宠智能生态系统' })).toBeVisible()
  await expect(page.getByRole('link', { name: /安全边界/ }).first()).toHaveAttribute(
    'href',
    '/products/smart-collar',
  )
  await expect(page.getByRole('link', { name: /健康趋势/ }).first()).toHaveAttribute(
    'href',
    '/research',
  )
  await expect(page.getByRole('link', { name: /专业协同/ }).first()).toHaveAttribute(
    'href',
    '/solutions',
  )
  await expect(page.getByRole('heading', { name: '因信任而设计，为陪伴而守护' })).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/AI 概念图，仅供参考|AI 生成|ai生成/i)
  await expect(page.locator('body')).not.toContainText(/百分百听懂|宠物语言翻译器|医疗级/)

  await expectNoHorizontalOverflow(page)
})

test('products route uses V2 product narrative without unconfirmed hardware claims', async ({
  page,
}) => {
  await gotoReady(page, '/products')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('一个核心主模块，两种安装方式')
  await expect(page.getByRole('heading', { name: '产品形态', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '项圈一体版' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '夹扣基础版' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '夹扣安全版' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '胸背带进阶版' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '三层价值', exact: true })).toBeVisible()
  await expect(page.getByText('不声明医疗级能力')).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/医学级体温|血氧|已量产|IP 等级/)

  await expectNoHorizontalOverflow(page)
})

test('solutions route presents three scenarios and medical boundary', async ({ page }) => {
  await gotoReady(page, '/solutions')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('同一套能力，服务不同场景')
  await expect(page.getByRole('heading', { name: '三大场景' })).toBeVisible()
  const scenarioCards = page.locator('#scenario-cards')
  await expect(scenarioCards.getByText('家庭养宠').first()).toBeVisible()
  await expect(scenarioCards.getByText('宠物医院').first()).toBeVisible()
  await expect(scenarioCards.getByText('宠物门店 / 机构').first()).toBeVisible()
  await expect(scenarioCards.getByText('辅助沟通，不替代诊断', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '信任基础' })).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/合作医院名单|客户 Logo 已确认|开放 API/)

  await expectNoHorizontalOverflow(page)
})

test('research route filters article drafts safely', async ({ page }) => {
  await gotoReady(page, '/research')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('健康研究院')
  await expect(page.getByRole('heading', { name: '精选文章' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'AI 与技术' })).toBeVisible()
  await page.getByRole('tab', { name: 'AI 与技术' }).click()
  await expect(page.getByRole('heading', { name: 'AI 状态解释不是“翻译”' })).toBeVisible()
  await expect(page.getByText('订阅入口为前端占位')).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/医疗诊断或治疗建议。本文提供诊断/)

  await expectNoHorizontalOverflow(page)
})

test('research detail route renders markdown, boundary notice, and sidebar', async ({ page }) => {
  await gotoReady(page, '/research/health-signals')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('宠物不会说话，但健康会留下痕迹')
  await expect(page.getByRole('heading', { name: '风险边界提示' })).toBeVisible()
  await expect(page.getByText('不能替代专业兽医意见')).toBeVisible()
  await expect(page.getByRole('heading', { name: '内容定位' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '相关阅读' })).toBeVisible()
  await expect(page.getByRole('link', { name: '返回健康研究院' })).toHaveAttribute(
    'href',
    '/research',
  )

  await expectNoHorizontalOverflow(page)
})

test('help route supports search, FAQ accordion, and placeholder support actions', async ({
  page,
}) => {
  await gotoReady(page, '/help')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('帮助中心')
  await page.getByPlaceholder('搜索问题，例如：定位、续航、隐私').fill('续航')
  await expect(page.getByRole('button', { name: '设备续航时间是多久？' })).toBeVisible()
  await page.getByRole('button', { name: '设备续航时间是多久？' }).click()
  await expect(page.getByText('续航参数待样机测试和项目方确认后发布。')).toBeVisible()
  await page.getByRole('button', { name: '联系客服' }).click()
  await expect(page.getByText('客服入口待项目方确认')).toBeVisible()

  await expectNoHorizontalOverflow(page)
})

test('login route is static and does not pretend real authentication', async ({ page }) => {
  await gotoReady(page, '/login?mode=register')

  await expect(page.getByRole('heading', { name: '注册知宠账号' })).toBeVisible()
  await expect(page.getByText('账号体系待项目方确认')).toBeVisible()
  await page.getByRole('tab', { name: '登录' }).click()
  await expect(page.getByRole('heading', { name: '登录知宠账号' })).toBeVisible()
  await page.getByRole('button', { name: '登录入口待开放' }).click()
  await expect(page.getByText('不会保存登录状态、Token 或模拟用户已登录')).toBeVisible()

  await expectNoHorizontalOverflow(page)
})

test('demo route validates required fields and records frontend-only submission', async ({
  page,
}) => {
  await gotoReady(page, '/demo')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('预约演示')
  await page.getByRole('button', { name: '提交预约' }).click()
  await expect(page.getByText('请输入姓名。')).toBeVisible()
  await page.getByLabel('姓名').fill('测试用户')
  await page.getByLabel('联系方式').fill('demo@example.com')
  await page.getByLabel(/我已阅读并理解/).check()
  await page.getByRole('button', { name: '提交预约' }).click()
  await expect(page.getByText('演示需求已记录，正式提交接口接入后将完成通知。')).toBeVisible()

  await expectNoHorizontalOverflow(page)
})

test('about route presents V2 mission and safe company placeholders', async ({ page }) => {
  await gotoReady(page, '/about')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('因为懂你，所以更懂它')
  await expect(page.getByRole('heading', { name: '核心能力' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '产品边界' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '发展里程碑' })).toBeVisible()
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/创始团队|投资机构|客户授权/)

  await expectNoHorizontalOverflow(page)
})

test('legacy routes bridge into V2 routes instead of 404', async ({ page }) => {
  await gotoReady(page, '/news/product-direction')
  await page.waitForURL('**/research/safety-first')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('为什么先做防走失，再做健康管理')

  await gotoReady(page, '/partners')
  await page.waitForURL('**/solutions')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('同一套能力，服务不同场景')

  await gotoReady(page, '/contact')
  await page.waitForURL('**/help')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('帮助中心')
})

test('legal routes show draft legal placeholders', async ({ page }) => {
  await gotoReady(page, '/privacy')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('隐私政策')
  await expect(page.getByRole('heading', { name: '政策状态' })).toBeVisible()
  await expect(page.getByText('法务与项目方确认后生效').first()).toBeVisible()

  await gotoReady(page, '/terms')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('服务条款')
  await expect(page.getByRole('heading', { name: '条款状态' })).toBeVisible()
  await expect(page.getByText('法务与项目方确认后生效').first()).toBeVisible()
})

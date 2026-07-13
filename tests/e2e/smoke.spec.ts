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

test('home route presents the V2 brand homepage and contact entry', async ({
  page,
}, testInfo) => {
  await gotoReady(page, '/')

  await expect(page).toHaveTitle(/更懂陪伴，更守护健康/)
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  if (testInfo.project.name === 'mobile') {
    await expect(page.getByRole('button', { name: '打开导航' })).toBeVisible()
    await page.getByRole('button', { name: '打开导航' }).click()
    await expect(
      page.getByRole('dialog', { name: '移动端导航' }).getByRole('link', { name: 'App 下载' }),
    ).toHaveAttribute('href', '/download')
    await page.getByRole('button', { name: '关闭菜单' }).click()
  } else {
    await expect(
      page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '产品' }),
    ).toHaveAttribute('href', '/products')
    await expect(
      page.locator('.app-header__actions').getByRole('link', { name: 'App 下载' }),
    ).toHaveAttribute('href', '/download')
  }
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
  await expect(page.locator('.hero-immersive-stage__label')).toHaveCount(3)
  await expect(page.locator('.hero-immersive-stage__label').first()).toContainText(
    'AI 概念图，仅供参考',
  )
  await expect(page.locator('body')).not.toContainText(/AI 生成|ai生成/i)
  await expect(page.locator('body')).not.toContainText(/百分百听懂|宠物语言翻译器|医疗级/)
  await expectNoHorizontalOverflow(page)
})

test('desktop navigation dropdowns stay centered below their labels', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile')
  await gotoReady(page, '/products')

  const navigation = page.getByRole('navigation', { name: '主导航' })

  const aboutLink = navigation.locator('.app-header__link').filter({ hasText: '项目介绍' })
  await expect(aboutLink).toHaveAttribute('href', '/about')
  await expect(aboutLink).not.toHaveAttribute('aria-expanded', /.+/)

  for (const label of ['健康研究院', '联系与反馈']) {
    const link = navigation.locator('.app-header__link').filter({ hasText: label })
    await link.hover()

    const item = link.locator('..')
    const dropdown = item.locator('.app-header__dropdown')
    await expect(dropdown).toBeVisible()

    const linkBox = await link.boundingBox()
    const dropdownBox = await dropdown.boundingBox()
    expect(linkBox).not.toBeNull()
    expect(dropdownBox).not.toBeNull()

    const linkCenter = (linkBox?.x ?? 0) + (linkBox?.width ?? 0) / 2
    const dropdownCenter = (dropdownBox?.x ?? 0) + (dropdownBox?.width ?? 0) / 2
    expect(Math.abs(linkCenter - dropdownCenter)).toBeLessThanOrEqual(1)
  }
})

test('products route uses the V2 product narrative without unconfirmed claims', async ({
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
  await expect(
    page.locator('.product-hero__actions a[href="/contact"]'),
  ).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/医学级体温|血氧|已量产|IP 等级/)
  await expectNoHorizontalOverflow(page)
})

test('solutions route presents three scenarios and trust boundaries', async ({ page }) => {
  await gotoReady(page, '/solutions')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('同一套能力，服务不同场景')
  await expect(page.getByRole('heading', { name: '三种关系，一条照护链路' })).toBeVisible()
  const scenarioCards = page.locator('#solution-scenes')
  await expect(scenarioCards.getByText('家庭养宠').first()).toBeVisible()
  await expect(scenarioCards.getByText('宠物医院').first()).toBeVisible()
  await expect(scenarioCards.getByText('宠物门店').first()).toBeVisible()
  await expect(page.getByRole('heading', { name: '连接之前，先建立信任' })).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/合作医院名单|客户 Logo 已确认|开放 API/)
  await expectNoHorizontalOverflow(page)
})

test('research route filters published articles without collecting subscriptions', async ({ page }) => {
  await gotoReady(page, '/research')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('宠物不会说话，变化会留下线索')
  await expect(page.getByRole('heading', { name: '精选文章' })).toBeVisible()
  await page.getByRole('tab', { name: 'AI 与技术' }).click()
  await expect(page.getByRole('heading', { name: 'AI 状态解释不是“翻译”' })).toBeVisible()
  await expect(page.getByRole('form', { name: '研究院订阅' })).toHaveCount(0)
  await expect(page.locator('body')).not.toContainText('记录订阅意向')
  await expectNoHorizontalOverflow(page)
})

test('research detail renders markdown, reading boundary, and related links', async ({ page }) => {
  await gotoReady(page, '/research/health-signals')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('宠物不会说话，但健康会留下痕迹')
  await expect(page.getByRole('heading', { name: '健康观察不能替代专业诊疗' })).toBeVisible()
  await expect(page.getByText(/不提供医疗诊断或治疗建议/)).toBeVisible()
  await expect(page.getByRole('heading', { name: '日常变化就是线索' })).toBeVisible()
  await expect(page.getByText('继续阅读')).toBeVisible()
  await expect(page.getByRole('link', { name: '返回研究院' }).first()).toHaveAttribute(
    'href',
    '/research',
  )
  await expectNoHorizontalOverflow(page)
})

test('help route supports FAQ search and feedback submission', async ({ page }) => {
  await page.route('**/api/feedback', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          feedbackId: 'feedback_test',
          status: 'pending',
          submittedAt: '2026-07-11T00:00:00.000Z',
        },
        message: '反馈已提交。',
      }),
    })
  })
  await gotoReady(page, '/help#feedback')

  await expect(page.locator('#feedback')).toBeVisible()
  await page.getByPlaceholder('搜索定位、续航、健康或隐私').fill('续航')
  await page.getByRole('button', { name: '设备续航时间是多久？' }).click()
  await expect(page.getByText(/续航会受到连接方式/)).toBeVisible()
  await page.getByRole('button', { name: '填写反馈' }).click()
  await page.getByLabel('反馈内容').fill('希望增加设备连接失败后的逐步排查说明。')
  await page.getByLabel(/我已阅读并理解/).check()
  await page.getByRole('button', { name: '提交反馈' }).click()
  await expect(page.getByText('反馈已提交，反馈编号：feedback_test')).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('contact route exposes only email contact and feedback', async ({ page }) => {
  await gotoReady(page, '/contact')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('让每一次沟通，都指向更好的陪伴')
  await expect(page.getByRole('heading', { name: 'petSense@126.com' })).toBeVisible()
  await page.getByRole('button', { name: '复制邮箱' }).click()
  await expect(page.getByRole('status')).toContainText(/邮箱地址已复制|请手动复制/)
  await expect(page.getByRole('link', { name: '前往反馈' })).toHaveAttribute(
    'href',
    '/help#feedback',
  )
  await expect(page.locator('a[href^="/login"], form[aria-label*="登录"]')).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
})

test('download route exposes guarded platform entries without unconfirmed links', async ({
  page,
}) => {
  await gotoReady(page, '/download')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('从官方入口，获取知宠 App')
  await expect(page.getByRole('heading', { name: '选择你的设备' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'iPhone 与 iPad' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Android 设备' })).toBeVisible()
  await expect(page.getByRole('button', { name: '暂未开放' })).toHaveCount(2)
  await expect(page.locator('a[href^="http"]').filter({ hasText: '前往下载' })).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
})

test('about route presents the brand belief without internal project status', async ({ page }) => {
  await gotoReady(page, '/about')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('因为懂你，所以更懂它')
  await expect(page.getByRole('heading', { name: '三个长期关注的方向' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '可信，先从说清边界开始' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '围绕真实问题持续交流' })).toBeVisible()
  await expect(page.getByText('知宠团队', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('petSense@126.com', { exact: true }).first()).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/创始团队|投资机构|客户授权/)
  await expect(page.locator('body')).not.toContainText(/项目阶段|里程碑|预孵化|原型验证/)
  await expectNoHorizontalOverflow(page)
})

test('removed website-account routes redirect to current public entry points', async ({ page }) => {
  await gotoReady(page, '/login')
  await expect(page).toHaveURL(/\/$/)

  await gotoReady(page, '/demo')
  await expect(page).toHaveURL(/\/contact$/)

  await gotoReady(page, '/admin')
  await expect(page).toHaveURL(/\/contact$/)
})

test('legal routes describe the reduced website data scope', async ({ page }) => {
  await gotoReady(page, '/privacy')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('隐私说明')
  await expect(page.getByText(/本官网由知宠团队维护/)).toBeVisible()
  await expect(page.getByText(/在线反馈自提交之日起最多保存 365 天/)).toBeVisible()
  await expect(page.getByText(/官网不提供用户注册或登录/)).toBeVisible()
  await expect(page.getByText(/一般在 15 个工作日内完成处理或说明情况/)).toBeVisible()

  await gotoReady(page, '/terms')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('使用条款')
  await expect(page.getByRole('heading', { name: '官网服务范围' })).toBeVisible()
  await expect(page.getByText(/官网不提供用户注册、账号登录/)).toBeVisible()
  await expect(page.getByText(/本官网由知宠团队维护/)).toBeVisible()
})

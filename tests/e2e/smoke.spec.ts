import { expect, test } from '@playwright/test'

test('home route loads formal homepage content with no horizontal overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/用 AI 读懂每一次陪伴/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /AI.*宠物.*理解|声音.*动作.*长期成长数据/,
  )
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('用 AI 理解宠物的日常信号')
  await expect(
    page.getByText('融合声音、行为、活动与成长记录，帮助主人获得更有依据的情绪、健康与安全趋势提示。'),
  ).toBeVisible()
  await expect(
    page.getByLabel('首页主要操作').getByRole('link', { name: '预约演示' }),
  ).toHaveAttribute('href', '/demo')
  await expect(page.getByText('感知 / 理解 / 行动')).toBeVisible()
  await expect(page.getByText('依据 / 不确定性')).toBeVisible()
  await expect(
    page.locator('#what-we-do').getByRole('heading', { name: '知宠在做什么' }),
  ).toBeVisible()
  const aiSection = page.locator('#ai-understanding')
  await expect(aiSection.getByRole('heading', { name: '一次提示如何形成' })).toBeVisible()
  await expect(aiSection.getByText('采集信号')).toBeVisible()
  await expect(aiSection.getByText('综合判断')).toBeVisible()
  await expect(aiSection.getByText('给出行动')).toBeVisible()
  await expect(aiSection.getByText('声音理解')).toBeVisible()
  await expect(aiSection.getByText('行为识别')).toBeVisible()
  await expect(aiSection.getByText('情绪推测')).toBeVisible()
  await expect(aiSection.getByText('个体画像')).toBeVisible()
  await expect(
    aiSection.getByRole('link', { name: '了解 PetSense 多模态理解引擎' }),
  ).toHaveAttribute('href', '/ai-pet-understanding')
  await expect(page.locator('#products').getByRole('heading', { name: '核心产品' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '知宠智能挂件 / 感知设备' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '知宠 App' }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: '健康管理平台' }).first()).toBeVisible()
  await expect(
    page.locator('#solutions').getByRole('heading', { name: '解决方案', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('宠物持续叫唤时的状态分析')).toBeVisible()
  await expect(page.getByText('主人不在家时的行为变化')).toBeVisible()
  await expect(page.getByText('夜间或日常活动突然异常')).toBeVisible()
  await expect(page.getByText('长期个体习惯变化')).toBeVisible()
  await expect(page.locator('#about').getByRole('heading', { name: '我们如何谨慎使用 AI 判断' })).toBeVisible()
  await expect(page.getByText('不做逐字翻译')).toBeVisible()
  await expect(page.getByText('尊重敏感数据')).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()
  await expect(page.getByText('宠物语言翻译器')).toHaveCount(0)
  await expect(page.getByText('百分百听懂')).toHaveCount(0)
  await expect(page.getByText('人宠无障碍交流')).toHaveCount(0)

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('products route loads product center without inventing release status', async ({ page }) => {
  await page.goto('/products')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('产品中心')
  await expect(page.getByRole('heading', { name: '产品链路怎么选' })).toBeVisible()
  await expect(page.getByText('先获得日常信号')).toBeVisible()
  await expect(page.getByText('再形成可能判断')).toBeVisible()
  await expect(page.getByText('最后承接到行动')).toBeVisible()
  await expect(page.getByRole('heading', { name: '当前产品方向' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '知宠智能挂件' })).toBeVisible()
  await expect(page.getByText('宠物声音采集', { exact: true })).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()
  await expect(page.getByRole('link', { name: '查看产品详情' })).toHaveCount(3)
  await expect(page.locator('body')).not.toContainText(/逐字翻译|宠物语言翻译器|医疗级|生命体征监测|疾病诊断/)

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('smart collar product page shows prototype-safe product details', async ({ page }) => {
  await page.goto('/products/smart-collar')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('知宠智能挂件')
  await expect(page.getByText('记录声音、动作和安全变化，让陪伴更有依据')).toBeVisible()
  await expect(page.locator('#values').getByRole('heading', { name: '产品如何形成参考' })).toBeVisible()
  await expect(page.getByText('采集日常信号')).toBeVisible()
  await expect(page.getByText('呈现依据与建议')).toBeVisible()
  await expect(
    page.locator('#ecosystem').getByRole('heading', { name: '设备、App 与 AI 引擎协同' }),
  ).toBeVisible()
  await expect(page.getByText('智能设备负责感知，App 负责呈现和交互')).toBeVisible()
  await expect(page.getByRole('link', { name: '了解 AI 宠物理解' })).toHaveAttribute(
    'href',
    '/ai-pet-understanding',
  )
  await expect(page.locator('#specifications caption')).toContainText('样机参数，仅供展示')
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/逐字翻译|宠物语言翻译器|医疗级|生命体征监测|疾病诊断|心率监测|体温监测|呼吸监测/)

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('solutions route loads solution center without fake proof', async ({ page }) => {
  await page.goto('/solutions')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('解决方案')
  await expect(page.getByRole('heading', { name: '先按角色进入' })).toBeVisible()
  await expect(page.getByText('公开信息边界')).toBeVisible()
  await expect(page.getByRole('heading', { name: '按场景选择知宠方案' })).toBeVisible()
  await expect(
    page
      .locator('section[aria-labelledby="solution-list-title"]')
      .getByRole('heading', { name: '家庭养宠' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: '查看方案详情' })).toHaveCount(3)
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('family solution page shows household-safe scenario details', async ({ page }) => {
  await page.goto('/solutions/family')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('家庭养宠解决方案')
  await expect(page.getByText('把日常行为和陪伴状态看得更清楚')).toBeVisible()
  await expect(page.locator('#pain-points').getByRole('heading', { name: '家庭养宠常见难点' })).toBeVisible()
  await expect(page.locator('#workflow').getByRole('heading', { name: '家庭宠物理解流程' })).toBeVisible()
  await expect(page.getByText('宠物叫声和状态理解')).toBeVisible()
  await expect(page.getByRole('heading', { name: '主人自然语言询问' })).toBeVisible()
  await expect(page.getByText('个体画像持续更新')).toBeVisible()
  await expect(page.getByRole('link', { name: '了解 AI 宠物理解' })).toHaveAttribute(
    'href',
    '/ai-pet-understanding',
  )
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/逐字翻译|准确翻译宠物语言|宠物在说它想吃饭|医疗级/)

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})
test('hospital solution page shows clinic-safe scenario details', async ({ page }) => {
  await page.goto('/solutions/hospital')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('宠物医院解决方案')
  await expect(page.getByText('场景验证阶段').first()).toBeVisible()
  await expect(page.locator('#pain-points').getByRole('heading', { name: '医院场景常见难点' })).toBeVisible()
  await expect(page.locator('#workflow').getByRole('heading', { name: '院外健康协同流程' })).toBeVisible()
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('store solution page shows service-safe scenario details', async ({ page }) => {
  await page.goto('/solutions/store')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('宠物门店解决方案')
  await expect(page.getByText('服务流程规划中').first()).toBeVisible()
  await expect(page.locator('#pain-points').getByRole('heading', { name: '门店服务常见难点' })).toBeVisible()
  await expect(page.locator('#workflow').getByRole('heading', { name: '会员健康服务流程' })).toBeVisible()
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
  await expect(page.getByText('联系方式待项目方确认', { exact: true })).toBeVisible()
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

test('about route shows brand-safe company placeholders', async ({ page }) => {
  await page.goto('/about')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('关于知宠')
  await expect(page.getByRole('heading', { name: '官网内容怎么更新' })).toBeVisible()
  await expect(page.getByText('真实资料优先')).toBeVisible()
  await expect(page.getByText('AI 判断有边界')).toBeVisible()
  await expect(page.getByText('敏感数据谨慎处理')).toBeVisible()
  await expect(page.getByRole('heading', { name: '我们坚持的方向' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '团队与资质信息' })).toBeVisible()
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('partners route shows partnership scenarios without fake logos', async ({ page }) => {
  await page.goto('/partners')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('合作伙伴')
  await expect(page.getByRole('heading', { name: '适合合作的场景' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '合作资料状态' })).toBeVisible()
  await expect(page.getByText('合作机构名单').first()).toBeVisible()
  await expect(page.getByText('待项目方确认').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('cases route shows concept cases without pretending proof', async ({ page }) => {
  await page.goto('/cases')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('客户案例')
  await expect(page.getByRole('heading', { name: '示范案例与概念验证' })).toBeVisible()
  await expect(page.getByText('不代表真实客户案例').first()).toBeVisible()
  await expect(page.getByText('待项目方确认').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('news route shows placeholder news center safely', async ({ page }) => {
  await page.goto('/news')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('资讯中心')
  await expect(page.getByRole('heading', { name: '当前内容规划' })).toBeVisible()
  await expect(page.getByText('发布日期待项目方确认').first()).toBeVisible()
  await expect(page.getByText('待项目方确认').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('privacy route shows draft legal placeholders', async ({ page }) => {
  await page.goto('/privacy')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('隐私政策')
  await expect(page.getByRole('heading', { name: '政策状态' })).toBeVisible()
  await expect(page.getByText('法务与项目方确认后生效').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('terms route shows draft service terms placeholders', async ({ page }) => {
  await page.goto('/terms')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('服务条款')
  await expect(page.getByRole('heading', { name: '条款状态' })).toBeVisible()
  await expect(page.getByText('法务与项目方确认后生效').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('app product page shows planning-stage app details', async ({ page }) => {
  await page.goto('/products/app')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('知宠 App')
  await expect(page.getByText('体验流程规划中').first()).toBeVisible()
  await expect(page.locator('#values').getByRole('heading', { name: '产品如何形成参考' })).toBeVisible()
  await expect(page.locator('#specifications caption')).toContainText('规划参数，仅供展示')
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

test('health platform product page shows validation-stage platform details', async ({ page }) => {
  await page.goto('/products/health-platform')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('健康管理平台')
  await expect(page.getByText('场景验证阶段').first()).toBeVisible()
  await expect(page.locator('#values').getByRole('heading', { name: '产品如何形成参考' })).toBeVisible()
  await expect(page.locator('#ecosystem').getByRole('heading', { name: '设备、App 与平台协同' })).toBeVisible()
  await expect(page.locator('#specifications caption')).toContainText('规划参数，仅供展示')
  await expect(page.getByText('待项目方确认').first()).toBeVisible()
  await expect(page.getByText('AI 概念图，仅供参考').first()).toBeVisible()

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)
})

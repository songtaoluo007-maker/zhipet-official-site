import type { FooterGroup, NavigationItem } from '../types/site'

export const sitePages = [
  { path: '/', label: '首页' },
  { path: '/products', label: '产品' },
  { path: '/products/smart-collar', label: '知宠智能挂件' },
  { path: '/products/app', label: '知宠 App' },
  { path: '/products/health-platform', label: '健康管理平台' },
  { path: '/solutions', label: '解决方案' },
  { path: '/solutions/family', label: '家庭养宠' },
  { path: '/solutions/hospital', label: '宠物医院' },
  { path: '/solutions/store', label: '宠物门店' },
  { path: '/research', label: '健康研究院' },
  { path: '/research/health-signals', label: '宠物健康信号观察' },
  { path: '/research/safety-first', label: '为什么先做防走失' },
  { path: '/research/ai-state-boundary', label: 'AI 状态解释边界' },
  { path: '/research/continuous-observation', label: '连续观察的价值' },
  { path: '/research/product-journey', label: '从一次佩戴到长期管理' },
  { path: '/research/trend-report-draft', label: '宠物健康趋势报告方向' },
  { path: '/about', label: '关于我们' },
  { path: '/contact', label: '联系我们' },
  { path: '/partners', label: '合作伙伴' },
  { path: '/ai-pet-understanding', label: 'AI 宠物理解' },
  { path: '/help', label: '帮助中心' },
  { path: '/demo', label: '预约演示' },
  { path: '/login', label: '登录注册' },
  { path: '/privacy', label: '隐私政策' },
  { path: '/terms', label: '服务条款' },
] as const

export const canonicalRoutes = sitePages.map((page) => page.path)

export const mainNavigation: NavigationItem[] = [
  {
    label: '产品',
    href: '/products',
    description: '查看智能挂件、App 与健康管理平台的规划入口。',
    children: [
      {
        label: '产品总览',
        href: '/products',
        description: '从整体能力、安装方式和价值层级了解知宠产品方向。',
      },
      {
        label: '知宠智能挂件',
        href: '/products/smart-collar',
        description: '查看样机阶段的记录、定位与安全提醒规划边界。',
      },
      {
        label: '知宠 App',
        href: '/products/app',
        description: '了解健康档案、趋势记录和家庭协作的体验流程。',
      },
      {
        label: '健康管理平台',
        href: '/products/health-platform',
        description: '面向医院、门店与合作机构的服务流程验证入口。',
      },
    ],
  },
  {
    label: '解决方案',
    href: '/solutions',
    description: '按家庭、医院、门店场景查看当前方案边界。',
    children: [
      {
        label: '方案总览',
        href: '/solutions',
        description: '快速比较不同场景下的使用对象和核心流程。',
      },
      {
        label: '家庭养宠',
        href: '/solutions/family',
        description: '围绕日常陪伴、状态理解和异常变化观察展开。',
      },
      {
        label: '宠物医院',
        href: '/solutions/hospital',
        description: '探索院外记录、复诊沟通和授权数据协同方式。',
      },
      {
        label: '宠物门店',
        href: '/solutions/store',
        description: '连接会员健康服务、提醒触达和照护记录归档。',
      },
    ],
  },
  {
    label: '健康研究院',
    href: '/research',
    description: '阅读健康观察、AI 边界与产品方法文章。',
    children: [
      {
        label: '研究院总览',
        href: '/research',
        description: '查看已整理的研究主题、报告方向和内容边界。',
      },
      {
        label: '宠物健康信号观察',
        href: '/research/health-signals',
        description: '理解日常记录如何帮助观察可能的健康变化。',
      },
      {
        label: '为什么先做防走失',
        href: '/research/safety-first',
        description: '从安全优先的角度说明产品能力排序。',
      },
      {
        label: 'AI 状态解释边界',
        href: '/research/ai-state-boundary',
        description: '说明 AI 提示应保留依据、不确定性和专业边界。',
      },
      {
        label: '连续观察的价值',
        href: '/research/continuous-observation',
        description: '了解长期趋势为何比单次判断更可靠。',
      },
    ],
  },
  {
    label: '关于我们',
    href: '/about',
    description: '了解知宠定位、联系方式和合作入口。',
    children: [
      {
        label: '关于知宠',
        href: '/about',
        description: '查看品牌方向、产品边界和当前发展状态。',
      },
      {
        label: '联系我们',
        href: '/contact',
        description: '提交咨询或查看待项目方确认的联系信息。',
      },
      {
        label: '合作伙伴',
        href: '/partners',
        description: '了解合作场景说明，不展示未确认客户信息。',
      },
      {
        label: '预约演示',
        href: '/demo',
        description: '面向家庭、医院、门店和行业伙伴提交演示需求。',
      },
    ],
  },
  {
    label: '帮助中心',
    href: '/help',
    description: '查看常见问题、账号入口和隐私条款。',
    children: [
      {
        label: '帮助中心',
        href: '/help',
        description: '按安装、连接、健康提醒和隐私等分类查找问题。',
      },
      {
        label: '登录注册',
        href: '/login',
        description: '进入账号入口，登录或注册体验流程。',
      },
      {
        label: '隐私政策',
        href: '/privacy',
        description: '查看个人信息、宠物数据和授权处理说明。',
      },
      {
        label: '服务条款',
        href: '/terms',
        description: '查看服务使用边界、责任说明和待确认条款。',
      },
    ],
  },
]

export const footerGroups: FooterGroup[] = [
  {
    title: '产品',
    links: [
      { label: '产品总览', href: '/products' },
      { label: '核心模块', href: '/products#core-module' },
      { label: '安装方式', href: '/products#variants' },
      { label: '价值层级', href: '/products#value-layers' },
    ],
  },
  {
    title: '解决方案',
    links: [
      { label: '家庭养宠', href: '/solutions/family' },
      { label: '宠物医院', href: '/solutions/hospital' },
      { label: '宠物门店', href: '/solutions/store' },
    ],
  },
  {
    title: '内容',
    links: [
      { label: '健康研究院', href: '/research' },
      { label: '关于知宠', href: '/about' },
      { label: '帮助中心', href: '/help' },
      { label: '预约演示', href: '/demo' },
    ],
  },
  {
    title: '支持',
    links: [
      { label: '登录注册', href: '/login' },
      { label: '隐私政策', href: '/privacy' },
      { label: '服务条款', href: '/terms' },
    ],
  },
]

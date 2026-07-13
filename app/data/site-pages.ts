import type { FooterGroup, NavigationItem } from '../types/site'

export const sitePages = [
  { path: '/', label: '首页' },
  { path: '/products', label: '产品' },
  { path: '/products/smart-collar', label: '知宠智能挂件' },
  { path: '/products/app', label: '知宠 App' },
  { path: '/download', label: 'App 下载' },
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
  { path: '/research/responsible-data', label: '如何负责地使用宠物健康数据' },
  { path: '/about', label: '项目介绍' },
  { path: '/contact', label: '联系知宠团队' },
  { path: '/ai-pet-understanding', label: 'AI 宠物理解' },
  { path: '/help', label: '意见问题反馈' },
  { path: '/privacy', label: '隐私说明' },
  { path: '/terms', label: '使用条款' },
] as const

export const canonicalRoutes = sitePages.map((page) => page.path)

export const mainNavigation: NavigationItem[] = [
  {
    label: '项目介绍',
    href: '/about',
    description: '了解知宠的品牌信念、产品边界和交流入口。',
  },
  {
    label: '产品',
    href: '/products',
    description: '查看智能挂件、App 与健康管理平台。',
    children: [
      {
        label: '产品总览',
        href: '/products',
        description: '从整体能力、安装方式和价值层级了解知宠产品方向。',
      },
      {
        label: '知宠智能挂件',
        href: '/products/smart-collar',
        description: '了解日常记录、位置线索与安全提醒的使用边界。',
      },
      {
        label: '知宠 App',
        href: '/products/app',
        description: '了解健康档案、趋势记录和家庭协作的体验流程。',
      },
      {
        label: '健康管理平台',
        href: '/products/health-platform',
        description: '面向医院、门店与合作机构的专业服务入口。',
      },
    ],
  },
  {
    label: '解决方案',
    href: '/solutions',
    description: '按家庭、医院、门店场景查看解决方案。',
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
        description: '查看健康观察、产品方法与数据边界专题。',
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
    label: '联系与反馈',
    href: '/help',
    description: '通过邮箱联系知宠团队，或提交意见和问题反馈。',
    children: [
      {
        label: '意见问题反馈',
        href: '/help',
        description: '查找常见问题或提交意见与问题。',
      },
      {
        label: '邮件联系我们',
        href: '/contact',
        description: '查看知宠团队公开联系邮箱。',
      },
      {
        label: '隐私说明',
        href: '/privacy',
        description: '查看个人信息、宠物数据和授权处理说明。',
      },
      {
        label: '使用条款',
        href: '/terms',
        description: '查看网站使用边界与责任说明。',
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
      { label: '项目介绍', href: '/about' },
      { label: 'App 下载', href: '/download' },
      { label: '意见问题反馈', href: '/help' },
    ],
  },
  {
    title: '支持',
    links: [
      { label: '邮件联系我们', href: '/contact' },
      { label: '意见问题反馈', href: '/help#feedback' },
      { label: '隐私说明', href: '/privacy' },
      { label: '使用条款', href: '/terms' },
    ],
  },
]

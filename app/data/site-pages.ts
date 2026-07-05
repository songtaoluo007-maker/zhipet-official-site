import type { FooterGroup, NavigationItem } from '../types/site'

export const sitePages = [
  { path: '/', label: '首页' },
  { path: '/products', label: '产品' },
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
  },
  {
    label: '解决方案',
    href: '/solutions',
    children: [
      { label: '家庭养宠', href: '/solutions/family' },
      { label: '宠物医院', href: '/solutions/hospital' },
      { label: '宠物门店', href: '/solutions/store' },
    ],
  },
  { label: '健康研究院', href: '/research' },
  { label: '关于我们', href: '/about' },
  { label: '帮助中心', href: '/help' },
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

import type { FooterGroup, NavigationItem } from '../types/site'

export const sitePages = [
  { path: '/', label: '首页' },
  { path: '/products', label: '产品中心' },
  { path: '/ai-pet-understanding', label: 'AI 宠物理解' },
  { path: '/products/smart-collar', label: '智能挂件' },
  { path: '/products/app', label: '知宠 App' },
  { path: '/products/health-platform', label: '健康管理平台' },
  { path: '/solutions', label: '解决方案' },
  { path: '/solutions/family', label: '家庭养宠' },
  { path: '/solutions/hospital', label: '宠物医院' },
  { path: '/solutions/store', label: '宠物门店' },
  { path: '/about', label: '关于知宠' },
  { path: '/partners', label: '合作伙伴' },
  { path: '/cases', label: '客户案例' },
  { path: '/news', label: '资讯中心' },
  { path: '/news/product-direction', label: '产品动态内容方向' },
  { path: '/news/scenario-research', label: '场景研究内容方向' },
  { path: '/news/brand-progress', label: '品牌公告内容方向' },
  { path: '/contact', label: '联系我们' },
  { path: '/demo', label: '预约演示' },
  { path: '/privacy', label: '隐私政策' },
  { path: '/terms', label: '服务条款' },
] as const

export const canonicalRoutes = sitePages.map((page) => page.path)

export const mainNavigation: NavigationItem[] = [
  { label: '首页', href: '/' },
  {
    label: '产品',
    href: '/products',
    children: [
      { label: '智能挂件', href: '/products/smart-collar' },
      { label: '知宠 App', href: '/products/app' },
      { label: 'AI 宠物理解', href: '/ai-pet-understanding' },
      { label: '健康管理平台', href: '/products/health-platform' },
    ],
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
  { label: '合作伙伴', href: '/partners' },
  { label: '关于我们', href: '/about' },
  { label: '资讯中心', href: '/news' },
]

export const footerGroups: FooterGroup[] = [
  {
    title: '产品',
    links: [
      { label: '智能挂件', href: '/products/smart-collar' },
      { label: '知宠 App', href: '/products/app' },
      { label: 'AI 宠物理解', href: '/ai-pet-understanding' },
      { label: '健康管理平台', href: '/products/health-platform' },
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
    title: '关于我们',
    links: [
      { label: '关于知宠', href: '/about' },
      { label: '客户案例', href: '/cases' },
      { label: '资讯中心', href: '/news' },
    ],
  },
  {
    title: '支持',
    links: [
      { label: '联系我们', href: '/contact' },
      { label: '预约演示', href: '/demo' },
      { label: '隐私政策', href: '/privacy' },
      { label: '服务条款', href: '/terms' },
    ],
  },
]

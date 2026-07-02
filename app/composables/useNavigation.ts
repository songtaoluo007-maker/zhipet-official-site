import type { FooterGroup, NavigationItem } from '~/types/site'

export const useNavigation = () => {
  const mainNavigation: NavigationItem[] = [
    { label: '首页', href: '/' },
    {
      label: '产品',
      href: '/products',
      children: [
        { label: '智能项圈', href: '/products/smart-collar' },
        { label: '知宠 App', href: '/products/app' },
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

  const footerGroups: FooterGroup[] = [
    {
      title: '产品',
      links: [
        { label: '智能项圈', href: '/products/smart-collar' },
        { label: '知宠 App', href: '/products/app' },
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

  return {
    mainNavigation,
    footerGroups,
  }
}

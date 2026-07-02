import { describe, expect, it } from 'vitest'
import { useNavigation } from '../../app/composables/useNavigation'

describe('useNavigation', () => {
  it('contains required main navigation items', () => {
    const { mainNavigation } = useNavigation()
    const labels = mainNavigation.map((item) => item.label)

    expect(labels).toEqual(['首页', '产品', '解决方案', '合作伙伴', '关于我们', '资讯中心'])
  })

  it('does not use empty navigation hrefs', () => {
    const { mainNavigation, footerGroups } = useNavigation()
    const footerLinks = footerGroups.flatMap((group) => group.links)
    const allLinks = [...mainNavigation, ...footerLinks]

    expect(allLinks.every((item) => item.href.startsWith('/'))).toBe(true)
  })
})

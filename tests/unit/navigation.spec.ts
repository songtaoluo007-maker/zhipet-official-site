import { describe, expect, it } from 'vitest'
import { useNavigation } from '../../app/composables/useNavigation'

describe('useNavigation', () => {
  it('contains required main navigation items', () => {
    const { mainNavigation } = useNavigation()
    const labels = mainNavigation.map((item) => item.label)

    expect(labels).toEqual(['项目介绍', '产品', '解决方案', '健康研究院', '联系与反馈'])
  })

  it('does not use empty navigation hrefs', () => {
    const { mainNavigation, footerGroups } = useNavigation()
    const footerLinks = footerGroups.flatMap((group) => group.links)
    const allLinks = [...mainNavigation, ...footerLinks]

    expect(allLinks.every((item) => item.href.startsWith('/'))).toBe(true)
  })

  it('keeps the about entry direct and contact actions in the contact group', () => {
    const { mainNavigation } = useNavigation()
    const aboutItem = mainNavigation.find((item) => item.href === '/about')
    const contactItem = mainNavigation.find((item) => item.label === '联系与反馈')

    expect(aboutItem?.children).toBeUndefined()
    expect(contactItem?.children?.some((item) => item.href === '/contact')).toBe(true)
  })
})

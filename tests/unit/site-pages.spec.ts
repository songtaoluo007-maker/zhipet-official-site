import { describe, expect, it } from 'vitest'
import { canonicalRoutes, footerGroups, mainNavigation } from '../../app/data/site-pages'

describe('site page manifest', () => {
  it('keeps canonical routes, main navigation, and footer links in one manifest boundary', () => {
    const navigationRoutes = mainNavigation.flatMap((item) => [
      item.href,
      ...(item.children ?? []).map((child) => child.href),
    ])
    const footerRoutes = footerGroups.flatMap((group) => group.links.map((link) => link.href))

    expect(canonicalRoutes).toContain('/')
    expect(canonicalRoutes).toContain('/ai-pet-understanding')
    expect(canonicalRoutes).toContain('/products/smart-collar')
    expect(canonicalRoutes).toContain('/terms')
    expect(navigationRoutes.every((href) => canonicalRoutes.includes(href))).toBe(true)
    expect(footerRoutes.every((href) => canonicalRoutes.includes(href))).toBe(true)
    expect(navigationRoutes).toContain('/ai-pet-understanding')
    expect(footerRoutes).toContain('/ai-pet-understanding')
  })
})

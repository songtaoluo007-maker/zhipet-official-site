import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

const homePageSource = readSource('app/pages/index.vue')
const mobileStorySource = readSource('app/components/home/MobileStoryPreview.vue')
const heroAppPanelSource = readSource('app/components/home/HeroAppPanel.vue')
const solutionsPageSource = readSource('app/pages/solutions/index.vue')

describe('home P0 experience', () => {
  it('keeps the ecosystem narrative within the shared 1200px design container', () => {
    expect(homePageSource).toMatch(
      /\.ecosystem-replica__container\s*\{[\s\S]*?var\(--container-wide\)/,
    )
    expect(homePageSource).not.toContain('1580px')
  })

  it('keeps hero copy inside medium desktop viewports', () => {
    expect(homePageSource).toMatch(
      /@media \(max-width: 1400px\)[\s\S]*?\.home-hero__copy\s*\{[\s\S]*?transform:\s*none/,
    )
  })

  it('uses intent-based secondary actions instead of a desktop-only email CTA', () => {
    expect(homePageSource).toContain('activeHeroSlide.secondaryTo')
    expect(homePageSource).toContain('activeHeroSlide.secondaryLabel')
    expect(homePageSource).not.toContain(
      '<BaseButton to="/contact" variant="secondary" size="lg">邮件联系我们</BaseButton>',
    )
    expect(mobileStorySource).toContain('homeStoryActions')
  })

  it('exposes an explicit desktop carousel pause control and interaction pause hooks', () => {
    expect(homePageSource).toContain('data-testid="home-hero-auto-rotate-toggle"')
    expect(homePageSource).toContain('@mouseenter="pauseHeroForInteraction"')
    expect(homePageSource).toContain('@focusin="pauseHeroForInteraction"')
  })

  it('uses evidence-safe trust copy and concept-scene alternative text', () => {
    expect(homePageSource).not.toMatch(/多重加密|联合研究|专业团队|每一次心跳/)
    expect(homePageSource).toContain('最小必要')
    expect(homePageSource).toContain('保留边界与不确定性')
    expect(solutionsPageSource).not.toContain('方案的真实场景')
    expect(solutionsPageSource).toContain('方案概念场景')
  })

  it('renders trend dots without dynamic SVG circle coordinates that warn during hydration', () => {
    expect(heroAppPanelSource).not.toContain(':cx="dot.x"')
    expect(heroAppPanelSource).not.toContain(':cy="dot.y"')
    expect(heroAppPanelSource).not.toContain(':points="trendPoints"')
    expect(heroAppPanelSource).toContain(':d="trendPath"')
    expect(heroAppPanelSource).toContain(':d="dot.path"')
  })
})

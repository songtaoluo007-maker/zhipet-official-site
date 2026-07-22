import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('P2 brand hierarchy', () => {
  it('makes the featured product a visual comparison anchor', () => {
    const productSource = readSource('app/pages/products/index.vue')

    expect(productSource).toContain('class="variant-card__media"')
    expect(productSource).toContain('/images/generated/home-ecosystem/ecosystem-collar.webp')
    expect(productSource).toContain('class="variant-card__comparison"')
  })

  it('explains the solution journey as a three-step flow', async () => {
    const { solutionJourneySteps } = await import('../../app/data/v2')
    const solutionSource = readSource('app/pages/solutions/index.vue')

    expect(solutionJourneySteps).toHaveLength(3)
    expect(solutionSource).toContain('class="solution-flow"')
    expect(solutionSource).toContain('solutionJourneySteps')
  })

  it('gives the lead research article editorial priority', () => {
    const researchSource = readSource('app/pages/research/index.vue')

    expect(researchSource).toContain("'article-row--lead': index === 0")
  })

  it('compresses the mobile footer into two non-repeating groups', async () => {
    const { mobileFooterGroups } = await import('../../app/data/site-pages')
    const footerSource = readSource('app/components/layout/AppFooter.vue')
    const mobileLinks = mobileFooterGroups.flatMap((group) => group.links)

    expect(mobileFooterGroups).toHaveLength(2)
    expect(new Set(mobileLinks.map((link) => link.href)).size).toBe(mobileLinks.length)
    expect(footerSource).toContain('app-footer__groups--mobile')
  })

  it('keeps one shared page-level heading across responsive home variants', () => {
    const homeSource = readSource('app/pages/index.vue')
    const mobileStorySource = readSource('app/components/home/MobileStoryPreview.vue')
    const h1Count =
      (homeSource.match(/<h1/g) ?? []).length + (mobileStorySource.match(/<h1/g) ?? []).length

    expect(h1Count).toBe(1)
    expect(homeSource).toContain('<h1 class="sr-only">')
  })
})

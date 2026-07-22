import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { productVariants, solutionScenarios } from '../../app/data/v2'

const readSource = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('P1 selection experience', () => {
  it('gives product variants one featured choice, two alternatives, and one future direction', () => {
    expect(productVariants.filter((variant) => variant.presentation === 'featured')).toHaveLength(1)
    expect(productVariants.filter((variant) => variant.presentation === 'alternative')).toHaveLength(2)
    expect(productVariants.filter((variant) => variant.presentation === 'future')).toHaveLength(1)

    const comparableVariants = productVariants.filter((variant) => variant.presentation !== 'future')
    const comparisonLabels = comparableVariants.map((variant) =>
      variant.comparison.map((item) => item.label),
    )

    expect(comparisonLabels).toEqual([
      ['适合场景', '安装方式'],
      ['适合场景', '安装方式'],
      ['适合场景', '安装方式'],
    ])
  })

  it('separates household and professional solution paths', () => {
    expect(solutionScenarios.filter((scenario) => scenario.track === 'household')).toHaveLength(1)
    expect(solutionScenarios.filter((scenario) => scenario.track === 'professional')).toHaveLength(2)

    const pageSource = readSource('app/pages/solutions/index.vue')
    expect(pageSource).toContain('id="household-path"')
    expect(pageSource).toContain('id="professional-path"')
  })

  it('uses an accessible single-open accordion for mobile navigation', () => {
    const menuSource = readSource('app/components/layout/MobileMenu.vue')

    expect(menuSource).toContain('expandedHref')
    expect(menuSource).toContain(':aria-expanded="isSectionExpanded(item)"')
    expect(menuSource).toContain('v-if="hasChildLinks(item) && isSectionExpanded(item)"')
    expect(menuSource).toContain('toggleSection(item)')
  })

  it('publishes verifiable references for every research article', () => {
    const contentDir = join(process.cwd(), 'content', 'research')
    const files = readdirSync(contentDir).filter((file) => file.endsWith('.md'))

    for (const file of files) {
      const content = readFileSync(join(contentDir, file), 'utf8')
      expect(content, file).toContain('sources:')
      expect(content, file).toMatch(/publication:\s*.+/)
      expect(content, file).toMatch(/year:\s*\d{4}/)
      expect(content, file).toMatch(/url:\s*https:\/\//)
    }

    const indexSource = readSource('app/pages/research/index.vue')
    const detailSource = readSource('app/pages/research/[slug].vue')
    expect(indexSource).toContain('article.sourceLabel')
    expect(detailSource).toContain('article.sources')
    expect(detailSource).toContain('class="article-sources"')
  })
})

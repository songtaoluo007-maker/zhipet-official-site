import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const homePageSource = readFileSync(resolve(process.cwd(), 'app/pages/index.vue'), 'utf8')

describe('home mobile experience integration', () => {
  it('mounts the approved mobile story and editorial journey behind a mobile-only boundary', () => {
    expect(homePageSource).toContain(
      "import MobileStoryPreview from '~/components/home/MobileStoryPreview.vue'",
    )
    expect(homePageSource).toContain(
      "import MobileEditorialJourney from '~/components/home/MobileEditorialJourney.vue'",
    )
    expect(homePageSource).toContain('<div class="home-page__mobile">')
    expect(homePageSource).toContain('<MobileStoryPreview />')
    expect(homePageSource).toContain('<MobileEditorialJourney />')
    expect(homePageSource).toMatch(/\.home-page__mobile\s*\{[\s\S]*?display:\s*none;/)
    expect(homePageSource).toMatch(
      /@media \(max-width: 760px\)[\s\S]*?\.home-page__mobile\s*\{[\s\S]*?display:\s*block;[\s\S]*?\.home-page__desktop\s*\{[\s\S]*?display:\s*none;/,
    )
  })
})

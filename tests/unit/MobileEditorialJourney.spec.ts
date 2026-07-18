import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MobileEditorialJourney from '../../app/components/home/MobileEditorialJourney.vue'

const NuxtLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

const originalMatchMedia = window.matchMedia

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: true,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
  vi.restoreAllMocks()
})

describe('MobileEditorialJourney', () => {
  const mountJourney = () =>
    mount(MobileEditorialJourney, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

  it('renders three distinct editorial chapters with real destination links', () => {
    const wrapper = mountJourney()
    const chapters = wrapper.findAll('[data-editorial-chapter]')
    const chapterImages = chapters.map((chapter) => chapter.get('img').attributes('src'))
    const chapterLinks = chapters.map((chapter) => chapter.get('a').attributes('href'))

    expect(chapters).toHaveLength(3)
    expect(new Set(chapterImages).size).toBe(3)
    expect(chapterLinks).toEqual(['/products/smart-collar', '/research', '/solutions/hospital'])
  })

  it('keeps every generated visual labelled and every image accessible', () => {
    const wrapper = mountJourney()
    const images = wrapper.findAll('img')

    expect(images.length).toBeGreaterThanOrEqual(5)
    expect(images.every((image) => Boolean(image.attributes('alt')))).toBe(true)
    expect(wrapper.findAll('[data-ai-disclosure]')).toHaveLength(images.length)
  })

  it('provides the expected product, family and App download paths', () => {
    const wrapper = mountJourney()
    const hrefs = wrapper.findAll('a').map((link) => link.attributes('href'))

    expect(hrefs).toContain('/products')
    expect(hrefs).toContain('/solutions/family')
    expect(hrefs).toContain('/download')
  })
})

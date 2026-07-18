import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MobileStoryPreview from '../../app/components/home/MobileStoryPreview.vue'

const NuxtLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

const matchMediaResult = (matches: boolean) => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

describe('MobileStoryPreview', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    vi.useFakeTimers()
    window.matchMedia = vi.fn().mockReturnValue(matchMediaResult(false))
  })

  afterEach(() => {
    vi.useRealTimers()
    window.matchMedia = originalMatchMedia
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const mountPreview = () =>
    mount(MobileStoryPreview, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          HeroAppPanel: {
            template: '<div data-testid="app-panel">App panel</div>',
          },
        },
      },
    })

  it('renders three stories and shows the full App panel only on the second story', async () => {
    const wrapper = mountPreview()

    expect(wrapper.findAll('[data-story-selector]')).toHaveLength(3)
    expect(wrapper.find('[data-testid="app-panel"]').exists()).toBe(false)

    await wrapper.get('[data-story-selector="1"]').trigger('click')
    expect(wrapper.find('[data-testid="app-panel"]').exists()).toBe(true)

    await wrapper.get('[data-story-selector="2"]').trigger('click')
    expect(wrapper.find('[data-testid="app-panel"]').exists()).toBe(false)
  })

  it('auto-advances after five seconds', async () => {
    const wrapper = mountPreview()

    expect(wrapper.get('[data-story-selector="0"]').attributes('aria-current')).toBe('true')

    await vi.advanceTimersByTimeAsync(5000)

    expect(wrapper.get('[data-story-selector="1"]').attributes('aria-current')).toBe('true')
  })

  it('does not auto-advance when reduced motion is enabled', async () => {
    window.matchMedia = vi.fn().mockReturnValue(matchMediaResult(true))
    const wrapper = mountPreview()

    await vi.advanceTimersByTimeAsync(5000)

    expect(wrapper.get('[data-story-selector="0"]').attributes('aria-current')).toBe('true')
  })

  it('resolves story images against the configured public base path', () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      app: { baseURL: '/zhipet-official-site/' },
    }))

    const wrapper = mountPreview()

    expect(wrapper.get('.mobile-story-preview__image').attributes('src')).toBe(
      '/zhipet-official-site/images/generated/zhipet-home-companion.webp',
    )
  })
})

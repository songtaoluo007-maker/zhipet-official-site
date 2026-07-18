import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BackToTopButton from '../../app/components/layout/BackToTopButton.vue'

describe('BackToTopButton', () => {
  const originalMatchMedia = window.matchMedia
  const originalScrollTo = window.scrollTo

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: 320,
      configurable: true,
    })

    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    window.scrollTo = originalScrollTo
    vi.restoreAllMocks()
  })

  it('scrolls to the top with smooth motion by default', async () => {
    const wrapper = mount(BackToTopButton)

    await wrapper.get('button').trigger('click')

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('respects reduced motion preference', async () => {
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

    const wrapper = mount(BackToTopButton)

    await wrapper.get('button').trigger('click')

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'auto',
    })
  })

  it('stays out of the way while the page is already at the top', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      configurable: true,
    })

    const wrapper = mount(BackToTopButton)
    const button = wrapper.get('button')

    expect(button.classes()).toContain('is-at-top')
    expect(button.attributes('aria-hidden')).toBe('true')
    expect(button.attributes('tabindex')).toBe('-1')
  })
})

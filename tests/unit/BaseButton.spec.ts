import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseButton from '../../app/components/base/BaseButton.vue'

const NuxtLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

describe('BaseButton', () => {
  it('renders variant and size classes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'secondary',
        size: 'lg',
      },
      slots: {
        default: '了解产品',
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

    expect(wrapper.classes()).toContain('base-button--secondary')
    expect(wrapper.classes()).toContain('base-button--lg')
    expect(wrapper.text()).toContain('了解产品')
  })

  it('prevents click while loading', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true,
      },
      slots: {
        default: '提交',
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.classes()).toContain('is-loading')
  })

  it('renders NuxtLink for internal routes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        to: '/contact',
      },
      slots: {
        default: '邮件联系我们',
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

    expect(wrapper.find('a').attributes('href')).toBe('/contact')
  })
  it('removes external hrefs with unsafe URL schemes', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        href: 'javascript:alert(1)',
        external: true,
      },
      slots: {
        default: '危险链接',
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

    const link = wrapper.find('a')

    await link.trigger('click')

    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('tabindex')).toBe('-1')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('removes disabled route links from keyboard navigation', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        to: '/contact',
        disabled: true,
      },
      slots: {
        default: '邮件联系我们',
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

    const link = wrapper.find('a')

    await link.trigger('click')

    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('tabindex')).toBe('-1')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseLink from '../../app/components/base/BaseLink.vue'

const NuxtLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

describe('BaseLink', () => {
  it('renders internal routes through NuxtLink', () => {
    const wrapper = mount(BaseLink, {
      props: {
        href: '/privacy',
      },
      slots: {
        default: '隐私政策',
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

    expect(wrapper.find('a').attributes('href')).toBe('/privacy')
  })

  it('does not render unsafe javascript URLs as clickable links', () => {
    const wrapper = mount(BaseLink, {
      props: {
        href: 'javascript:alert(1)',
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

    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('tabindex')).toBe('-1')
  })
})

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
        to: '/demo',
      },
      slots: {
        default: '预约演示',
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })

    expect(wrapper.find('a').attributes('href')).toBe('/demo')
  })
})

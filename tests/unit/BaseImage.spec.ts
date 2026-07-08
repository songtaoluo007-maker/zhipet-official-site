import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseImage from '../../app/components/base/BaseImage.vue'

const NuxtImgStub = {
  props: ['src', 'alt'],
  template: '<img :src="src" :alt="alt">',
}

describe('BaseImage', () => {
  it('does not render visible concept labels inside the image', () => {
    const wrapper = mount(BaseImage, {
      props: {
        src: '/images/concepts/hero-care-scene.svg',
        alt: '概念图',
        concept: true,
      },
      global: {
        stubs: {
          NuxtImg: NuxtImgStub,
        },
      },
    })

    expect(wrapper.find('.base-image__frame .base-image__label').exists()).toBe(false)
    expect(wrapper.find('.base-image__label--below').exists()).toBe(false)
  })

  it('does not render visible concept labels below the image', () => {
    const wrapper = mount(BaseImage, {
      props: {
        src: '/images/concepts/hero-care-scene.svg',
        alt: '概念图',
        concept: true,
        labelPlacement: 'below',
      },
      global: {
        stubs: {
          NuxtImg: NuxtImgStub,
        },
      },
    })

    expect(wrapper.find('.base-image__frame .base-image__label').exists()).toBe(false)
    expect(wrapper.find('.base-image__label--below').exists()).toBe(false)
  })
})
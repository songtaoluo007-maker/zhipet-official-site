import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseImage from '../../app/components/base/BaseImage.vue'

const NuxtImgStub = {
  props: ['src', 'alt'],
  template: '<img :src="src" :alt="alt">',
}

describe('BaseImage', () => {
  it('renders a visible label for an explicitly marked concept image', () => {
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

    expect(wrapper.find('.base-image__label').text()).toBe('AI 概念图，仅供参考')
    expect(wrapper.find('.base-image__label--below').exists()).toBe(false)
  })

  it('places the concept label below the image when requested', () => {
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

    expect(wrapper.find('.base-image__label--below').text()).toBe('AI 概念图，仅供参考')
  })

  it('automatically labels generated image assets', () => {
    const wrapper = mount(BaseImage, {
      props: {
        src: '/images/generated/product-scene.webp',
        alt: '产品概念场景',
      },
      global: {
        stubs: {
          NuxtImg: NuxtImgStub,
        },
      },
    })

    expect(wrapper.find('.base-image__label').text()).toBe('AI 概念图，仅供参考')
  })
})

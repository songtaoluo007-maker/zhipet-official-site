import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseIcon from '../../app/components/base/BaseIcon.vue'

describe('BaseIcon', () => {
  it('renders the requested icon and optional accessible label', () => {
    const wrapper = mount(BaseIcon, {
      props: {
        name: 'menu',
        label: '打开导航',
      },
    })

    expect(wrapper.find('svg').attributes('role')).toBe('img')
    expect(wrapper.find('title').text()).toBe('打开导航')
    expect(wrapper.findAll('path')).toHaveLength(3)
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseInput from '../../app/components/base/BaseInput.vue'

describe('BaseInput', () => {
  it('updates model value', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (value: string | number) => wrapper.setProps({ modelValue: value }),
      },
    })

    await wrapper.find('input').setValue('ZHIPET')

    expect(wrapper.props('modelValue')).toBe('ZHIPET')
  })

  it('renders invalid and accessible attributes', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'phone',
        invalid: true,
        describedBy: 'phone-error',
      },
    })

    const input = wrapper.find('input')

    expect(input.classes()).toContain('is-invalid')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('phone-error')
  })

  it('supports disabled state', () => {
    const wrapper = mount(BaseInput, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})

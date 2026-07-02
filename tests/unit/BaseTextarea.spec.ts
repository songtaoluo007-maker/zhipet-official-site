import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseTextarea from '../../app/components/base/BaseTextarea.vue'

describe('BaseTextarea', () => {
  it('binds text input and exposes accessible invalid state', async () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        id: 'message',
        name: 'message',
        modelValue: '',
        placeholder: '请输入需求',
        invalid: true,
        describedBy: 'message-error',
      },
    })

    const textarea = wrapper.get('textarea')

    expect(textarea.attributes('aria-invalid')).toBe('true')
    expect(textarea.attributes('aria-describedby')).toBe('message-error')
    expect(textarea.attributes('name')).toBe('message')

    await textarea.setValue('希望了解家庭养宠方案')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['希望了解家庭养宠方案'])
  })
})

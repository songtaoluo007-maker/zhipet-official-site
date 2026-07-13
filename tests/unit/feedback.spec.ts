import { describe, expect, it } from 'vitest'
import { parseFeedbackInput } from '../../server/domain/feedback'

describe('feedback validation', () => {
  it('accepts and trims valid feedback', () => {
    const result = parseFeedbackInput({
      category: 'device',
      message: ' 希望补充设备连接失败时的排查说明。 ',
      contact: ' demo@example.com ',
      acceptedPrivacy: true,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.output.message).toBe('希望补充设备连接失败时的排查说明。')
      expect(result.output.contact).toBe('demo@example.com')
    }
  })

  it('rejects short feedback and missing consent', () => {
    const result = parseFeedbackInput({
      category: 'product',
      message: '太短',
      acceptedPrivacy: false,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.map((issue) => issue.message)).toEqual(
        expect.arrayContaining(['反馈内容至少需要 10 个字符。', '请先确认已阅读当前隐私说明。']),
      )
    }
  })
})

import * as v from 'valibot'
import { feedbackCategories } from '~~/shared/types/feedback'

export const feedbackInputSchema = v.strictObject({
  category: v.picklist(feedbackCategories, '请选择有效的反馈分类。'),
  message: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, '反馈内容至少需要 10 个字符。'),
    v.maxLength(2000, '反馈内容不能超过 2000 个字符。'),
  ),
  contact: v.optional(
    v.pipe(v.string(), v.trim(), v.maxLength(160, '联系方式不能超过 160 个字符。')),
    '',
  ),
  acceptedPrivacy: v.literal(true, '请先确认已阅读当前隐私说明。'),
})

export const parseFeedbackInput = (input: unknown) => v.safeParse(feedbackInputSchema, input)

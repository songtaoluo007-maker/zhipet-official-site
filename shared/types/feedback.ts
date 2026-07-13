export const feedbackCategories = [
  'product',
  'device',
  'app',
  'content',
  'privacy',
  'other',
] as const

export type FeedbackCategoryValue = (typeof feedbackCategories)[number]

export interface FeedbackInput {
  category: FeedbackCategoryValue
  message: string
  contact?: string
  acceptedPrivacy: true
}

export interface FeedbackResponse {
  data: {
    feedbackId: string
    status: 'pending'
    submittedAt: string
  }
  message: string
}

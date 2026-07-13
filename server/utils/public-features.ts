import { createError, type H3Event } from 'h3'

const assertFeatureEnabled = (enabled: boolean, message: string) => {
  if (enabled) {
    return
  }

  throw createError({
    statusCode: 503,
    message,
  })
}

export const assertFeedbackEnabled = (event: H3Event) => {
  const config = useRuntimeConfig(event)
  assertFeatureEnabled(config.public.feedbackEnabled === true, '在线反馈暂未开放')
}

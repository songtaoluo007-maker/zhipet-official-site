import { FeedbackCategory } from '@prisma/client'
import type { FeedbackCategoryValue, FeedbackResponse } from '~~/shared/types/feedback'
import { addRetentionDays, dataGovernance } from '~~/shared/constants/data-governance'
import { parseFeedbackInput } from '~~/server/domain/feedback'
import { formatValidationIssues } from '~~/server/domain/validation'
import { prisma } from '~~/server/utils/prisma'
import { assertFeedbackEnabled } from '~~/server/utils/public-features'
import { assertRateLimit } from '~~/server/utils/rate-limit'
import { readJsonBodyWithLimit } from '~~/server/utils/request-body'
import {
  createFeedbackNotificationMail,
  enqueueEmail,
} from '~~/server/utils/mail-outbox'

const feedbackBodyLimitBytes = 16 * 1024
const feedbackRateLimit = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
}

const databaseCategoryByInput: Record<FeedbackCategoryValue, FeedbackCategory> = {
  product: FeedbackCategory.PRODUCT,
  device: FeedbackCategory.DEVICE,
  app: FeedbackCategory.APP,
  content: FeedbackCategory.CONTENT,
  privacy: FeedbackCategory.PRIVACY,
  other: FeedbackCategory.OTHER,
}

const categoryLabelByInput: Record<FeedbackCategoryValue, string> = {
  product: '产品建议',
  device: '设备问题',
  app: 'App 使用',
  content: '官网内容',
  privacy: '隐私与数据',
  other: '其他',
}

export default defineEventHandler(async (event): Promise<FeedbackResponse> => {
  assertFeedbackEnabled(event)
  assertRateLimit(event, 'feedback-submit', feedbackRateLimit)
  const result = parseFeedbackInput(
    await readJsonBodyWithLimit(event, feedbackBodyLimitBytes),
  )

  if (!result.success) {
    throw createError({
      statusCode: 422,
      message: '反馈信息校验失败',
      data: {
        issues: formatValidationIssues(result.issues),
      },
    })
  }

  const config = useRuntimeConfig(event)
  const submittedAt = new Date()
  const feedback = await prisma.$transaction(async (transaction) => {
    const created = await transaction.feedback.create({
      data: {
        category: databaseCategoryByInput[result.output.category],
        message: result.output.message,
        contact: result.output.contact || null,
        acceptedPrivacyAt: submittedAt,
        privacyPolicyVersion: config.privacyPolicyVersion,
        retentionExpiresAt: addRetentionDays(
          submittedAt,
          dataGovernance.retentionDays.feedback,
        ),
      },
      select: {
        id: true,
        createdAt: true,
      },
    })
    const email = createFeedbackNotificationMail({
      recordId: created.id,
      recordedAt: created.createdAt,
      categoryLabel: categoryLabelByInput[result.output.category],
      message: result.output.message,
      contact: result.output.contact,
    })
    await enqueueEmail(transaction, {
      ...email,
      deduplicationKey: `feedback:${created.id}`,
      queuedAt: created.createdAt,
    })

    return created
  })

  setResponseStatus(event, 201)

  return {
    data: {
      feedbackId: feedback.id,
      status: 'pending',
      submittedAt: feedback.createdAt.toISOString(),
    },
    message: '反馈已提交。',
  }
})

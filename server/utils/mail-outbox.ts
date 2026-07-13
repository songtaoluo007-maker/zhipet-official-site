import { EmailTemplate, type Prisma } from '@prisma/client'
import { addRetentionDays, dataGovernance } from '~~/shared/constants/data-governance'
import { projectContact } from '~~/shared/constants/project-contact'

type EmailOutboxClient = Pick<Prisma.TransactionClient, 'emailOutbox'>

interface QueueEmailInput {
  deduplicationKey: string
  template: EmailTemplate
  recipient: string
  subject: string
  textBody: string
  queuedAt?: Date
  retentionExpiresAt?: Date
}

interface FeedbackNotificationInput {
  recordId: string
  recordedAt: Date
  categoryLabel: string
  message: string
  contact?: string
}

const cleanHeaderValue = (value: string) => value.replace(/[\r\n]+/g, ' ').trim()
const emailAddressPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const cleanEmailAddress = (value: string) => {
  const cleaned = cleanHeaderValue(value)
  if (!emailAddressPattern.test(cleaned)) {
    throw new Error('Invalid email recipient')
  }

  return cleaned
}

export const getOperatorNotificationEmail = () => {
  const configured = process.env.MAIL_NOTIFICATION_TO?.trim()
  if (!configured) return projectContact.email

  try {
    return cleanEmailAddress(configured)
  } catch {
    return projectContact.email
  }
}

export const createFeedbackNotificationMail = (input: FeedbackNotificationInput) => ({
  template: EmailTemplate.OPERATOR_FEEDBACK,
  recipient: getOperatorNotificationEmail(),
  subject: `[知宠] 新的意见问题反馈：${cleanHeaderValue(input.categoryLabel)}`,
  textBody: [
    '知宠官网收到一条新的意见问题反馈。',
    '',
    `记录编号：${input.recordId}`,
    `记录时间：${input.recordedAt.toISOString()}`,
    `反馈分类：${input.categoryLabel}`,
    `联系方式：${input.contact?.trim() || '未填写'}`,
    '',
    '反馈内容：',
    input.message,
  ].join('\n'),
})

export const enqueueEmail = (client: EmailOutboxClient, input: QueueEmailInput) => {
  const queuedAt = input.queuedAt ?? new Date()

  return client.emailOutbox.create({
    data: {
      deduplicationKey: cleanHeaderValue(input.deduplicationKey),
      template: input.template,
      recipient: cleanEmailAddress(input.recipient),
      subject: cleanHeaderValue(input.subject),
      textBody: input.textBody,
      nextAttemptAt: queuedAt,
      retentionExpiresAt:
        input.retentionExpiresAt ??
        addRetentionDays(queuedAt, dataGovernance.retentionDays.emailOutbox),
    },
  })
}

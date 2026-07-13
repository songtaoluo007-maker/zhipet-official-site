import { afterEach, describe, expect, it } from 'vitest'
import {
  createFeedbackNotificationMail,
  getOperatorNotificationEmail,
} from '../../server/utils/mail-outbox'

const originalNotificationEmail = process.env.MAIL_NOTIFICATION_TO

afterEach(() => {
  if (originalNotificationEmail === undefined) {
    delete process.env.MAIL_NOTIFICATION_TO
  } else {
    process.env.MAIL_NOTIFICATION_TO = originalNotificationEmail
  }
})

describe('mail outbox content', () => {
  it('creates a feedback notification that can be handled without a website admin', () => {
    process.env.MAIL_NOTIFICATION_TO = 'ops@example.com'
    const mail = createFeedbackNotificationMail({
      recordId: 'feedback_123',
      recordedAt: new Date('2026-07-12T08:00:00.000Z'),
      categoryLabel: '设备问题',
      message: '设备连接后反复断开，希望补充排查步骤。',
      contact: 'owner@example.com',
    })

    expect(getOperatorNotificationEmail()).toBe('ops@example.com')
    expect(mail.subject).toBe('[知宠] 新的意见问题反馈：设备问题')
    expect(mail.textBody).toContain('feedback_123')
    expect(mail.textBody).toContain('设备连接后反复断开')
    expect(mail.textBody).toContain('owner@example.com')
    expect(mail.textBody).not.toContain('/admin')
  })

  it('falls back to the public project email after header injection', () => {
    process.env.MAIL_NOTIFICATION_TO = 'ops@example.com\r\nBcc: invalid@example.com'

    expect(getOperatorNotificationEmail()).toBe('petSense@126.com')
  })
})

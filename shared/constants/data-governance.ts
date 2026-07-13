export const dataGovernance = {
  privacyVersion: '2026-07-12',
  termsVersion: '2026-07-12',
  updatedLabel: '2026年7月12日',
  retentionDays: {
    feedback: 365,
    emailOutbox: 30,
    deliveredEmailAudit: 7,
  },
  rightsResponseBusinessDays: 15,
} as const

export const addRetentionDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000)

import type * as v from 'valibot'

export const formatValidationIssues = (issues: readonly v.BaseIssue<unknown>[]) =>
  issues.map((issue) => ({
    field: issue.path?.map((item) => String(item.key)).join('.') ?? 'form',
    message: issue.message,
  }))

import { describe, expect, it } from 'vitest'
import { familySolution, solutionCards } from '../../app/data/solutions'

describe('solution content', () => {
  it('keeps household solution details clearly bounded while content is unconfirmed', () => {
    const guardrailText = familySolution.guardrails.map((item) => item.description).join(' ')
    const unknownValues = familySolution.confirmationItems.map((item) => item.value)

    expect(solutionCards).toHaveLength(3)
    expect(familySolution.status).toContain('方案定义')
    expect(unknownValues).toContain('待项目方确认')
    expect(guardrailText).toContain('不替代专业诊疗')
  })
})

import { describe, expect, it } from 'vitest'
import {
  familySolution,
  hospitalSolution,
  solutionCards,
  storeSolution,
} from '../../app/data/solutions'

describe('solution content', () => {
  it('keeps household solution details clearly bounded while content is unconfirmed', () => {
    const guardrailText = familySolution.guardrails.map((item) => item.description).join(' ')
    const unknownValues = familySolution.confirmationItems.map((item) => item.value)

    expect(solutionCards).toHaveLength(3)
    expect(familySolution.status).toContain('方案定义')
    expect(unknownValues).toContain('待项目方确认')
    expect(guardrailText).toContain('不替代专业诊疗')
  })

  it('keeps hospital and store solution details bounded until project confirmation', () => {
    const detailPages = [hospitalSolution, storeSolution]
    const newCards = solutionCards.filter((card) => ['hospital', 'store'].includes(card.id))

    expect(newCards).toHaveLength(2)
    expect(newCards.every((card) => card.href?.startsWith('/solutions/'))).toBe(true)
    expect(hospitalSolution.status).toContain('场景验证')
    expect(storeSolution.status).toContain('服务流程规划')

    for (const solution of detailPages) {
      const confirmationValues = solution.confirmationItems.map((item) => item.value)
      const guardrailText = solution.guardrails
        .map((item) => `${item.title} ${item.description}`)
        .join(' ')

      expect(solution.summary).toMatch(/待项目方确认|以项目方确认为准/)
      expect(solution.cover).toContain('/images/concepts/')
      expect(confirmationValues).toContain('待项目方确认')
      expect(guardrailText).toMatch(/不替代专业诊疗|授权|待项目方确认/)
    }
  })
})

import { describe, expect, it } from 'vitest'
import {
  familySolution,
  hospitalSolution,
  solutionCards,
  storeSolution,
} from '../../app/data/solutions'

const solutionText = (solution: typeof familySolution) => JSON.stringify(solution)

describe('solution content', () => {
  it('keeps household solution details clearly bounded while content is unconfirmed', () => {
    const guardrailText = familySolution.guardrails.map((item) => item.description).join(' ')
    const unknownValues = familySolution.confirmationItems.map((item) => item.value)

    expect(solutionCards).toHaveLength(3)
    expect(familySolution.status).toContain('方案定义')
    expect(unknownValues).toContain('待项目方确认')
    expect(guardrailText).toContain('不替代专业诊疗')
  })

  it('adds AI pet understanding to the household solution without translation claims', () => {
    const text = solutionText(familySolution)
    const workflowTitles = familySolution.workflow.map((step) => step.title)

    expect(text).toContain('宠物叫声和状态理解')
    expect(text).toContain('日常行为变化分析')
    expect(text).toContain('情绪趋势记录')
    expect(text).toContain('长期个体画像')
    expect(text).toContain('主人自然语言询问')
    expect(text).toContain('陪伴和观察建议')
    expect(workflowTitles).toEqual([
      '设备或手机采集',
      '数据记录',
      '多模态分析',
      '状态解释',
      '主人反馈',
      '个体画像持续更新',
    ])
    expect(familySolution.secondaryAction?.to).toBe('/ai-pet-understanding')
    expect(text).not.toMatch(/逐字翻译|准确翻译宠物语言|宠物在说它想吃饭|医疗级/)
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
      expect(solution.cover).toMatch(/^\/images\/(generated|concepts)\//)
      expect(confirmationValues).toContain('待项目方确认')
      expect(guardrailText).toMatch(/不替代专业诊疗|授权|待项目方确认/)
    }
  })
})

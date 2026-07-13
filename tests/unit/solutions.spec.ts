import { describe, expect, it } from 'vitest'
import { familySolution, hospitalSolution, storeSolution } from '../../app/data/solutions'

const solutionText = (solution: typeof familySolution) => JSON.stringify(solution)

describe('solution content', () => {
  it('keeps all public solutions free of internal project-state wording', () => {
    const solutions = [familySolution, hospitalSolution, storeSolution]
    const combinedText = solutions.map(solutionText).join(' ')

    expect(solutions).toHaveLength(3)
    expect(new Set(solutions.map((solution) => solution.cover)).size).toBe(3)
    expect(combinedText).not.toMatch(/待项目方确认|待确认|样机|规划中|验证阶段|项目阶段/)
    expect(combinedText).not.toMatch(/已合作客户|客户 Logo 已确认|医疗级/)
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

  it('keeps professional scenarios bounded by authorization and veterinary judgment', () => {
    for (const solution of [hospitalSolution, storeSolution]) {
      const guardrailText = solution.guardrails
        .map((item) => `${item.title} ${item.description}`)
        .join(' ')

      expect(solution.cover).toMatch(/^\/images\/(generated|concepts)\//)
      expect(guardrailText).toMatch(/专业诊疗|授权|专业判断/)
    }
  })
})

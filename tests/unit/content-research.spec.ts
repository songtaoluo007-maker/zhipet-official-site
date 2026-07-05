import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const contentDir = join(process.cwd(), 'content', 'research')

describe('research markdown content', () => {
  it('keeps research drafts operational and safely bounded', () => {
    const files = readdirSync(contentDir).filter((file) => file.endsWith('.md'))
    const combinedText = files
      .map((file) => readFileSync(join(contentDir, file), 'utf8'))
      .join('\n')

    expect(files.sort()).toEqual([
      'ai-state-boundary.md',
      'continuous-observation.md',
      'health-signals.md',
      'product-journey.md',
      'safety-first.md',
      'trend-report-draft.md',
    ])
    expect(combinedText).toContain('发布日期待项目方确认')
    expect(combinedText).toContain('待项目方确认')
    expect(combinedText).toContain('可能')
    expect(combinedText).not.toMatch(
      /已合作客户|真实客户授权|医疗级|联系电话：|备案号：|准确率[:：]\s*\d|样本规模[:：]\s*\d/u,
    )
  })
})

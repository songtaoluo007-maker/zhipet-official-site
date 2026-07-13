import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const contentDir = join(process.cwd(), 'content', 'research')

describe('research markdown content', () => {
  it('publishes bounded articles without exposing internal project state', () => {
    const files = readdirSync(contentDir).filter((file) => file.endsWith('.md'))
    const combinedText = files
      .map((file) => readFileSync(join(contentDir, file), 'utf8'))
      .join('\n')

    expect(files.sort()).toEqual([
      'ai-state-boundary.md',
      'continuous-observation.md',
      'health-signals.md',
      'product-journey.md',
      'responsible-data.md',
      'safety-first.md',
    ])
    expect(combinedText).toContain('publishedLabel: 知宠研究院')
    expect(combinedText).toContain('status: 专题文章')
    expect(combinedText).toContain('可能')
    expect(combinedText).not.toMatch(/草案|待确认|样机|项目阶段|原型验证/)
    expect(combinedText).not.toMatch(
      /已合作客户|真实客户授权|医疗级|联系电话：|备案号：|准确率[:：]\s*\d|样本规模[:：]\s*\d/u,
    )
  })
})

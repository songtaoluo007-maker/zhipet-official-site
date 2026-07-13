import { describe, expect, it } from 'vitest'
import {
  aboutPrinciples,
  caseStudies,
  legalDocuments,
  partnerScenarios,
  researchItems,
} from '../../app/data/corporate'

describe('corporate content', () => {
  it('uses team identity and keeps public content free of internal status wording', () => {
    const combinedText = [
      ...aboutPrinciples.map((item) => `${item.title} ${item.description}`),
      ...partnerScenarios.map((item) => `${item.title} ${item.summary}`),
      ...caseStudies.map((item) => `${item.title} ${item.summary}`),
      ...researchItems.map((item) => `${item.title} ${item.summary}`),
      ...legalDocuments.flatMap((item) => [
        `${item.title} ${item.status}`,
        ...item.sections.map((section) => `${section.title} ${section.body}`),
      ]),
    ].join(' ')

    expect(aboutPrinciples).toHaveLength(3)
    expect(partnerScenarios).toHaveLength(3)
    expect(caseStudies).toHaveLength(2)
    expect(researchItems).toHaveLength(3)
    expect(legalDocuments.map((document) => document.title)).toEqual(['隐私说明', '使用条款'])
    expect(combinedText).toContain('知宠团队')
    expect(combinedText).not.toMatch(/草案|待项目方确认|项目运营者|预孵化|项目阶段|杨浩强/)
    expect(combinedText).not.toMatch(/联系电话|备案号：|已合作客户|客户 Logo 已确认|真实客户授权/)
  })
})

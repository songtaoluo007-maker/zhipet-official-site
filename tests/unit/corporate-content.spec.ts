import { describe, expect, it } from 'vitest'
import {
  aboutPrinciples,
  caseStudies,
  legalDocuments,
  newsItems,
  partnerScenarios,
} from '../../app/data/corporate'

describe('corporate content', () => {
  it('keeps about, partner, case, news, and legal content safely bounded', () => {
    const combinedText = [
      ...aboutPrinciples.map((item) => `${item.title} ${item.description}`),
      ...partnerScenarios.map((item) => `${item.title} ${item.summary}`),
      ...caseStudies.map((item) => `${item.title} ${item.summary}`),
      ...newsItems.map((item) => `${item.title} ${item.summary}`),
      ...legalDocuments.map((item) => `${item.title} ${item.status}`),
    ].join(' ')

    expect(aboutPrinciples).toHaveLength(3)
    expect(partnerScenarios).toHaveLength(3)
    expect(caseStudies).toHaveLength(2)
    expect(newsItems).toHaveLength(3)
    expect(legalDocuments).toHaveLength(2)
    expect(combinedText).toContain('待项目方确认')
    expect(combinedText).not.toMatch(/联系电话|备案号：|已合作客户|客户 Logo 已确认|真实客户授权/)
  })
})

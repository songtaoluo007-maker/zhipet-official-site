import { describe, expect, it } from 'vitest'
import { healthPlatformProduct, smartCollarProduct, zhipetAppProduct } from '../../app/data/products'

describe('product content', () => {
  it('keeps prototype specifications clearly marked instead of inventing hardware data', () => {
    const values = smartCollarProduct.specifications.map((item) => item.value)
    const notes = smartCollarProduct.specifications.map((item) => item.note).filter(Boolean)

    expect(smartCollarProduct.status).toContain('样机')
    expect(values).toContain('待项目方确认')
    expect(notes.some((note) => note?.includes('样机参数，仅供展示'))).toBe(true)
  })

  it('keeps app and platform product pages in planning language with unconfirmed values', () => {
    const productNames = [smartCollarProduct, zhipetAppProduct, healthPlatformProduct].map(
      (product) => product.name,
    )
    const unconfirmedValues = [zhipetAppProduct, healthPlatformProduct]
      .flatMap((product) => product.specifications)
      .map((item) => item.value)

    expect(productNames).toEqual(['知宠智能项圈', '知宠 App', '健康管理平台'])
    expect(zhipetAppProduct.status).toContain('规划')
    expect(healthPlatformProduct.status).toContain('验证')
    expect(unconfirmedValues).toContain('待项目方确认')
  })
})
import { describe, expect, it } from 'vitest'
import { healthPlatformProduct, smartCollarProduct, zhipetAppProduct } from '../../app/data/products'

const productText = (product: typeof smartCollarProduct) => JSON.stringify(product)

describe('product content', () => {
  it('keeps prototype specifications clearly marked instead of inventing hardware data', () => {
    const values = smartCollarProduct.specifications.map((item) => item.value)
    const notes = smartCollarProduct.specifications.map((item) => item.note).filter(Boolean)

    expect(smartCollarProduct.status).toContain('样机')
    expect(values).toContain('待项目方确认')
    expect(notes.some((note) => note?.includes('样机参数，仅供展示'))).toBe(true)
  })

  it('positions the sensing device without unconfirmed collar or medical-grade claims', () => {
    const text = productText(smartCollarProduct)

    expect(smartCollarProduct.name).toMatch(/知宠智能挂件|知宠智能感知设备|TODO/)
    expect(text).toContain('宠物声音采集')
    expect(text).toContain('动作与活动趋势记录')
    expect(text).toContain('行为姿态感知')
    expect(text).toContain('定位与安全提醒')
    expect(text).toContain('PetSense')
    expect(smartCollarProduct.secondaryAction?.to).toBe('/ai-pet-understanding')
    expect(text).not.toMatch(/智能项圈|生命体征监测|医疗级|心率监测|体温监测|呼吸监测|疾病诊断|IP 等级/)
  })

  it('keeps app and platform product pages in planning language with unconfirmed values', () => {
    const productNames = [smartCollarProduct, zhipetAppProduct, healthPlatformProduct].map(
      (product) => product.name,
    )
    const unconfirmedValues = [zhipetAppProduct, healthPlatformProduct]
      .flatMap((product) => product.specifications)
      .map((item) => item.value)

    expect(productNames).toEqual(['知宠智能挂件', '知宠 App', '健康管理平台'])
    expect(zhipetAppProduct.status).toContain('规划')
    expect(healthPlatformProduct.status).toContain('验证')
    expect(unconfirmedValues).toContain('待项目方确认')
  })
})
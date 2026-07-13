import { describe, expect, it } from 'vitest'
import { healthPlatformProduct, smartCollarProduct, zhipetAppProduct } from '../../app/data/products'

const productText = (product: typeof smartCollarProduct) => JSON.stringify(product)

describe('product content', () => {
  it('uses stable product categories instead of internal project-state labels', () => {
    const products = [smartCollarProduct, zhipetAppProduct, healthPlatformProduct]
    const combinedText = products.map(productText).join(' ')

    expect(products.map((product) => product.status)).toEqual([
      '智能感知设备',
      '家庭端应用',
      '专业服务平台',
    ])
    expect(combinedText).toContain('以正式产品说明为准')
    expect(combinedText).not.toMatch(/样机|待项目方确认|规划中|验证阶段|项目阶段/)
  })

  it('positions the sensing device without medical-grade claims', () => {
    const text = productText(smartCollarProduct)

    expect(smartCollarProduct.name).toBe('知宠智能挂件')
    expect(text).toContain('宠物声音采集')
    expect(text).toContain('动作与活动趋势记录')
    expect(text).toContain('行为姿态感知')
    expect(text).toContain('定位与安全提醒')
    expect(text).toContain('PetSense')
    expect(smartCollarProduct.secondaryAction?.to).toBe('/ai-pet-understanding')
    expect(text).not.toMatch(/生命体征监测|医疗级|心率监测|体温监测|呼吸监测|疾病诊断|IP 等级/)
  })

  it('keeps the public product family complete', () => {
    expect([smartCollarProduct, zhipetAppProduct, healthPlatformProduct].map((product) => product.name))
      .toEqual(['知宠智能挂件', '知宠 App', '健康管理平台'])
  })
})

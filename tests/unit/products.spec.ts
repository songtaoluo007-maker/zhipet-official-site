import { describe, expect, it } from 'vitest'
import { smartCollarProduct } from '../../app/data/products'

describe('smartCollarProduct', () => {
  it('keeps prototype specifications clearly marked instead of inventing hardware data', () => {
    const values = smartCollarProduct.specifications.map((item) => item.value)
    const notes = smartCollarProduct.specifications.map((item) => item.note).filter(Boolean)

    expect(smartCollarProduct.status).toContain('样机')
    expect(values).toContain('待项目方确认')
    expect(notes.some((note) => note?.includes('样机参数，仅供展示'))).toBe(true)
  })
})

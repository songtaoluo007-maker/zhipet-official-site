import { describe, expect, it } from 'vitest'
import { parseJsonRequestText } from '../../server/domain/json-request'

describe('JSON request body limits', () => {
  it('parses valid JSON within the byte limit', () => {
    expect(parseJsonRequestText('{"message":"反馈内容"}', 64)).toEqual({
      success: true,
      value: { message: '反馈内容' },
    })
  })

  it('rejects a body larger than the byte limit', () => {
    expect(parseJsonRequestText('{"message":"反馈内容"}', 8)).toEqual(
      expect.objectContaining({ success: false, statusCode: 413 }),
    )
  })

  it('rejects invalid JSON', () => {
    expect(parseJsonRequestText('{invalid}', 64)).toEqual(
      expect.objectContaining({ success: false, statusCode: 400 }),
    )
  })
})

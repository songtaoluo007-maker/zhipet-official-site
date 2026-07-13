export type JsonRequestParseResult =
  | { success: true; value: unknown }
  | { success: false; statusCode: 400 | 413; message: string }

export const parseJsonRequestText = (
  body: string,
  maxBytes: number,
): JsonRequestParseResult => {
  if (Buffer.byteLength(body, 'utf8') > maxBytes) {
    return {
      success: false,
      statusCode: 413,
      message: '请求内容过大',
    }
  }

  try {
    return {
      success: true,
      value: JSON.parse(body) as unknown,
    }
  } catch {
    return {
      success: false,
      statusCode: 400,
      message: '请求内容不是有效的 JSON',
    }
  }
}

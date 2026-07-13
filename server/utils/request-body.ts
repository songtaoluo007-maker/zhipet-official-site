import {
  createError,
  getRequestHeader,
  readRawBody,
  type H3Event,
} from 'h3'
import { parseJsonRequestText } from '~~/server/domain/json-request'

const jsonContentType = 'application/json'

const requestError = (statusCode: number, message: string) =>
  createError({
    statusCode,
    message,
  })

export const readJsonBodyWithLimit = async (
  event: H3Event,
  maxBytes: number,
): Promise<unknown> => {
  const contentType = getRequestHeader(event, 'content-type')
    ?.split(';', 1)[0]
    ?.trim()
    .toLowerCase()

  if (contentType !== jsonContentType) {
    throw requestError(415, '请求必须使用 application/json')
  }

  const contentLengthHeader = getRequestHeader(event, 'content-length')
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : 0

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw requestError(413, '请求内容过大')
  }

  const body = await readRawBody(event, 'utf8')

  if (!body) {
    throw requestError(400, '请求内容不能为空')
  }

  const result = parseJsonRequestText(body, maxBytes)

  if (!result.success) {
    throw requestError(result.statusCode, result.message)
  }

  return result.value
}

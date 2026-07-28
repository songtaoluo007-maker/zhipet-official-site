import { isLoopbackAddress } from './rate-limit'

export interface RequestIdInput {
  remoteAddress: string | undefined
  forwardedRequestId: string | undefined
  generatedRequestId: string
}

const forwardedRequestIdPattern =
  /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i

export const resolveRequestId = ({
  remoteAddress,
  forwardedRequestId,
  generatedRequestId,
}: RequestIdInput): string => {
  if (isLoopbackAddress(remoteAddress) && forwardedRequestIdPattern.test(forwardedRequestId ?? '')) {
    return forwardedRequestId
  }

  return generatedRequestId
}

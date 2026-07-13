import { appDownloadChannelDefinitions, appDownloadPath } from '~/data/app-download'
import type { AppDownloadChannel } from '~/types/site'
import {
  isSha256Digest,
  parseAllowedDownloadHosts,
  toSafeDownloadHref,
} from '~/utils/app-download'

export const useAppDownload = () => {
  const config = useRuntimeConfig()
  const downloadConfig = config.public.appDownload
  const allowedHosts = parseAllowedDownloadHosts(downloadConfig.allowedHosts)
  const configuredUrls = {
    ios: downloadConfig.iosUrl,
    android: downloadConfig.androidUrl,
  }
  const channels: AppDownloadChannel[] = appDownloadChannelDefinitions.map((channel) => {
    const href = downloadConfig.enabled
      ? toSafeDownloadHref(configuredUrls[channel.id], allowedHosts)
      : undefined

    return {
      ...channel,
      href,
      available: Boolean(href),
    }
  })

  return {
    path: appDownloadPath,
    enabled: downloadConfig.enabled,
    channels,
    version: downloadConfig.version.trim() || undefined,
    publishedAt: downloadConfig.publishedAt.trim() || undefined,
    androidSha256: isSha256Digest(downloadConfig.androidSha256)
      ? downloadConfig.androidSha256.trim().toLowerCase()
      : undefined,
    hasAvailableChannel: channels.some((channel) => channel.available),
  }
}

import type { AppDownloadChannelDefinition } from '~/types/site'

export const appDownloadPath = '/download'

export const appDownloadChannelDefinitions: AppDownloadChannelDefinition[] = [
  {
    id: 'ios',
    label: 'iPhone 与 iPad',
    sourceLabel: 'App Store',
    description: '通过 Apple 官方应用商店获取知宠 App。',
  },
  {
    id: 'android',
    label: 'Android 设备',
    sourceLabel: 'Android 官方渠道',
    description: '通过知宠官网确认的应用商店或安装包地址获取。',
  },
]

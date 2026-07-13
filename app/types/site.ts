export interface NavigationItem {
  label: string
  href: string
  description?: string
  children?: NavigationItem[]
}

export interface FooterGroup {
  title: string
  links: NavigationItem[]
}

export interface SiteContact {
  teamName: string
  email: string
  registrationNumber?: string
}

export interface SiteConfig {
  name: string
  brand: string
  descriptor: string
  description: string
  contact: SiteContact
}

export type AppDownloadPlatform = 'ios' | 'android'

export interface AppDownloadChannelDefinition {
  id: AppDownloadPlatform
  label: string
  sourceLabel: string
  description: string
}

export interface AppDownloadChannel extends AppDownloadChannelDefinition {
  href?: string
  available: boolean
}

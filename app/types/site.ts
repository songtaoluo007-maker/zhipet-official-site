export interface NavigationItem {
  label: string
  href: string
  children?: NavigationItem[]
}

export interface FooterGroup {
  title: string
  links: NavigationItem[]
}

export interface SiteContact {
  phone: string
  email: string
  address: string
  registrationNumber: string
  qrCode: string
}

export interface SiteConfig {
  name: string
  brand: string
  description: string
  contact: SiteContact
}

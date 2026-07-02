import type { IconName } from './ui'

export interface HomeHeroPoint {
  label: string
  value: string
  description: string
}

export interface HomePillar {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface HomeProduct {
  id: string
  icon: IconName
  name: string
  status: string
  summary: string
  image: string
  alt: string
  features: string[]
}

export interface HomeSolution {
  id: string
  icon: IconName
  title: string
  audience: string
  description: string
}

export interface HomeCase {
  id: string
  label: string
  title: string
  clientType: string
  summary: string
  results: string[]
}

export interface HomeBrandNote {
  title: string
  description: string
}

export interface HomeTimelineItem {
  date: string
  title: string
  description: string
}

import type { IconName } from './ui'

export interface ProductValue {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface ProductEcosystemStep {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface ProductScenario {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface ProductSpecification {
  label: string
  value: string
  note?: string
}

export interface ProductProcessStep {
  id: string
  order: string
  title: string
  description: string
}

export interface ProductDetail {
  slug: string
  name: string
  headline: string
  summary: string
  status: string
  cover: string
  coverAlt: string
  values: ProductValue[]
  ecosystem: ProductEcosystemStep[]
  scenarios: ProductScenario[]
  specifications: ProductSpecification[]
  process: ProductProcessStep[]
}

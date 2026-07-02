import type { IconName } from './ui'

export interface AiPetUnderstandingAction {
  label: string
  href: string
}

export interface AiPetUnderstandingHero {
  title: string
  description: string
  note: string
  primaryAction: AiPetUnderstandingAction
  secondaryAction: AiPetUnderstandingAction
  image: {
    src: string
    alt: string
  }
  visualLabels: string[]
}

export interface AiPetExpressionDimension {
  label: string
  description: string
}

export interface AiPetExpressionSection {
  title: string
  description: string
  image: {
    src: string
    alt: string
  }
  dimensions: AiPetExpressionDimension[]
}

export interface AiPetProcessStep {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface AiPetCapability {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface AiPetAnalysisExample {
  label: string
  title: string
  possibleState: string
  confidenceLabel: string
  riskLevel: string
  basis: string[]
  alternatives: string[]
  recommendation: string
  uncertainty: string
  medicalBoundary: string
}

export interface AiPetProfileSection {
  title: string
  description: string
  image: {
    src: string
    alt: string
  }
  attributes: string[]
}

export interface AiPetScenario {
  id: string
  title: string
  description: string
}

export interface AiPetBoundaryItem {
  title: string
  description: string
}

export interface AiPetUnderstandingPageData {
  hero: AiPetUnderstandingHero
  expression: AiPetExpressionSection
  process: AiPetProcessStep[]
  capabilities: AiPetCapability[]
  analysisExample: AiPetAnalysisExample
  profile: AiPetProfileSection
  scenarios: AiPetScenario[]
  boundaries: AiPetBoundaryItem[]
  cta: {
    title: string
    description: string
    action: AiPetUnderstandingAction
  }
}
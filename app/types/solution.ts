import type { IconName } from './ui'

export interface SolutionPainPoint {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface SolutionWorkflowStep {
  id: string
  order: string
  title: string
  description: string
}

export interface SolutionModule {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface SolutionGuardrail {
  id: string
  title: string
  description: string
}

export interface SolutionDetailSections {
  painTitle: string
  painDescription: string
  workflowTitle: string
  workflowDescription: string
  modulesTitle: string
  modulesDescription: string
  boundaryTitle: string
  boundaryDescription: string
  ctaTitle: string
  ctaDescription: string
}

export interface SolutionDetailAction {
  label: string
  to: string
}

export interface SolutionDetail {
  slug: string
  title: string
  breadcrumbLabel: string
  headline: string
  summary: string
  cover: string
  coverAlt: string
  painPoints: SolutionPainPoint[]
  workflow: SolutionWorkflowStep[]
  modules: SolutionModule[]
  secondaryAction?: SolutionDetailAction
  guardrails: SolutionGuardrail[]
  sections: SolutionDetailSections
}

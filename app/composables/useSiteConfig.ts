import type { SiteConfig } from '~/types/site'
import { projectContact } from '~~/shared/constants/project-contact'

export const useSiteConfig = (): SiteConfig => ({
  name: '知宠',
  brand: 'ZHIPET',
  descriptor: '宠物健康科技团队',
  description: '围绕宠物安全、健康趋势与状态理解，连接设备、App 与专业服务。',
  contact: projectContact,
})

export interface ResearchVisual {
  src: string
  alt: string
  objectPosition: string
}

const fallbackVisual: ResearchVisual = {
  src: '/images/generated/zhipet-health-archive.webp',
  alt: '犬猫在家庭环境中休息并接受日常健康观察',
  objectPosition: 'center',
}

const researchVisuals: Record<string, ResearchVisual> = {
  '/research/health-signals': {
    src: '/images/generated/zhipet-health-archive.webp',
    alt: '犬猫在家庭环境中休息并接受日常健康观察',
    objectPosition: 'center',
  },
  '/research/safety-first': {
    src: '/images/generated/zhipet-safety-collar.webp',
    alt: '佩戴智能挂件的犬猫在明亮家庭空间中活动',
    objectPosition: 'center',
  },
  '/research/ai-state-boundary': {
    src: '/images/generated/pages/zhipet-app-profile-scene.webp',
    alt: '宠物主人查看犬只健康档案与趋势信息',
    objectPosition: 'center',
  },
  '/research/continuous-observation': {
    src: '/images/generated/zhipet-home-companion.webp',
    alt: '犬猫在日常家庭环境中自然相处',
    objectPosition: 'center',
  },
  '/research/product-journey': {
    src: '/images/generated/home-ecosystem/ecosystem-collar.webp',
    alt: '知宠智能挂件在暖白环境中的产品展示',
    objectPosition: 'center',
  },
  '/research/responsible-data': {
    src: '/images/generated/home-ecosystem/ecosystem-desktop.webp',
    alt: '桌面端宠物健康档案与趋势界面',
    objectPosition: 'center',
  },
}

export const resolveResearchVisual = (path: string): ResearchVisual =>
  researchVisuals[path] ?? fallbackVisual

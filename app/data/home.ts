import type {
  HomeAiUnderstanding,
  HomeBrandNote,
  HomeCase,
  HomeFeaturedProduct,
  HomeHeroPoint,
  HomePillar,
  HomeProduct,
  HomeSolution,
  HomeTimelineItem,
} from '~/types/home'

export const heroPoints: HomeHeroPoint[] = [
  {
    label: 'AI 宠物理解',
    value: '声音 / 动作 / 长期数据',
    description: '综合分析宠物可能的情绪、需求、行为意图和异常状态。',
  },
  {
    label: '当前资料状态',
    value: '真实信息待确认',
    description: '客户、资质、团队、联系方式、备案信息和能力验证资料确认后再正式展示。',
  },
]

export const homePillars: HomePillar[] = [
  {
    id: 'health-management',
    icon: 'heart-pulse',
    title: '宠物健康管理',
    description: '把日常活动、照护记录和健康档案连续记录起来，帮助用户更早发现变化趋势。',
  },
  {
    id: 'smart-assistant',
    icon: 'sparkles',
    title: '智能养宠助手',
    description: '以 App 和提醒能力承接日常照护、异常提示、记录归档和服务连接。',
  },
  {
    id: 'industry-solution',
    icon: 'building',
    title: '行业数字化解决方案',
    description: '面向宠物医院、门店与合作机构，探索设备、数据与服务流程协同。',
  },
]

export const homeAiUnderstanding: HomeAiUnderstanding = {
  title: '不只是听见，更要理解',
  description:
    '知宠通过声音、动作、场景和长期个体数据进行综合分析，将复杂的宠物行为转化为主人能够理解的状态提示和陪伴建议。',
  linkLabel: '了解 PetSense 多模态理解引擎',
  linkTo: '/ai-pet-understanding',
  image: '/images/concepts/family-solution.svg',
  alt: '知宠 AI 宠物理解家庭陪伴场景概念视觉',
  statusLabel: '当前可能状态',
  statusValue: '可能焦虑或寻求关注',
  confidenceLabel: '置信度示例 74%，需结合持续观察',
  analysisBasis: ['连续短促叫声增多', '门口区域反复移动', '与独处历史模式相似'],
  abilities: [
    {
      title: '声音理解',
      description: '识别叫声节律、强弱和持续变化。',
    },
    {
      title: '行为识别',
      description: '结合动作姿态和活动轨迹观察行为趋势。',
    },
    {
      title: '情绪推测',
      description: '以概率方式提示可能情绪，不直接下结论。',
    },
    {
      title: '个体画像',
      description: '长期学习每只宠物自己的习惯和异常阈值。',
    },
  ],
}

export const homeFeaturedProducts: HomeFeaturedProduct[] = [
  {
    id: 'smart-sensing-device',
    icon: 'collar',
    name: '知宠智能挂件 / 感知设备',
    status: '样机与产品定义阶段',
    summary: '面向日常佩戴与家庭陪伴场景，探索宠物声音、活动和行为变化的连续感知。',
    image: '/images/concepts/smart-collar.svg',
    alt: '知宠智能挂件和感知设备概念视觉',
    features: ['声音与活动采集', '行为变化提示', '设备状态提醒'],
    detailTo: '/products/smart-collar',
    detailLabel: '查看硬件方向',
  },
  {
    id: 'zhipet-app',
    icon: 'phone',
    name: '知宠 App',
    status: '体验流程规划中',
    summary: '承接状态提示、照护建议、长期记录和主人反馈，让家庭成员更容易协同照护。',
    image: '/images/concepts/app-platform.svg',
    alt: '知宠 App 和宠物理解结果概念视觉',
    features: ['状态提示', '照护建议', '长期记录'],
    detailTo: '/products/app',
    detailLabel: '查看 App 规划',
  },
  {
    id: 'ai-understanding-engine',
    icon: 'sparkles',
    name: 'AI 宠物理解引擎',
    status: '能力验证与产品定义阶段',
    summary: 'PetSense 融合多模态数据，输出可能状态、分析依据、置信度、其他解释和风险提示。',
    image: '/images/concepts/hero-care-scene.svg',
    alt: 'PetSense 多模态宠物理解引擎概念视觉',
    features: ['多模态分析', '置信度提示', '不确定性说明'],
    detailTo: '/ai-pet-understanding',
    detailLabel: '探索 AI 宠物理解',
  },
]

export const homeProducts: HomeProduct[] = [
  {
    id: 'smart-collar',
    icon: 'collar',
    name: '知宠智能挂件',
    status: '样机与产品定义阶段',
    summary: '面向家庭日常陪伴和安全提醒场景，探索宠物声音采集、动作与活动趋势记录和行为姿态感知。',
    image: '/images/concepts/smart-collar.svg',
    alt: '知宠智能挂件概念视觉',
    features: ['宠物声音采集', '动作与活动趋势记录', '定位与安全提醒'],
  },
  {
    id: 'zhipet-app',
    icon: 'phone',
    name: '知宠 App',
    status: '体验流程规划中',
    summary: '沉淀健康档案、趋势记录、提醒通知和家庭成员协作，减少分散记录。',
    image: '/images/concepts/app-platform.svg',
    alt: '知宠 App 和健康管理平台概念视觉',
    features: ['健康档案', '趋势记录', '提醒协作'],
  },
  {
    id: 'health-platform',
    icon: 'chart',
    name: '健康管理平台',
    status: '场景验证阶段',
    summary: '为医院、门店与合作机构提供设备数据接入、客户服务和运营辅助能力。',
    image: '/images/concepts/clinic-workflow.svg',
    alt: '宠物健康管理平台概念视觉',
    features: ['设备数据接入', '服务流程记录', '运营辅助看板'],
  },
]

export const homeSolutions: HomeSolution[] = [
  {
    id: 'family',
    icon: 'home',
    title: '家庭养宠',
    audience: '家庭用户',
    description:
      '让日常陪伴、异常变化和长期习惯更容易被理解，帮助家庭做出更有依据的照护判断。',
    scenarios: [
      '宠物持续叫唤时的状态分析',
      '主人不在家时的行为变化',
      '夜间或日常活动突然异常',
      '长期个体习惯变化',
    ],
  },
  {
    id: 'hospital',
    icon: 'hospital',
    title: '宠物医院',
    audience: '医疗机构',
    description:
      '围绕复诊、健康档案、院外行为变化和专业服务平台，探索更完整的健康管理链路。',
  },
  {
    id: 'store',
    icon: 'store',
    title: '宠物门店',
    audience: '门店与服务机构',
    description:
      '帮助门店把会员健康服务、行为趋势提醒和日常照护记录变成长期服务资产。',
  },
]

export const homeCases: HomeCase[] = [
  {
    id: 'clinic-proof',
    label: '概念验证项目',
    title: '宠物医院健康档案协同示范',
    clientType: '宠物医院场景',
    summary: '用于展示设备数据、复诊记录与院外提醒如何协同，不代表真实客户案例。',
    results: ['流程标准化', '数据连续化', '服务触达清晰化'],
  },
  {
    id: 'store-proof',
    label: '示范案例',
    title: '门店会员健康服务示范',
    clientType: '宠物门店场景',
    summary: '用于展示门店如何围绕健康提醒与服务记录建立长期关系，待真实授权后替换。',
    results: ['会员服务数字化', '照护记录归档', '运营决策可视化'],
  },
]

export const brandNotes: HomeBrandNote[] = [
  {
    title: '项目愿景',
    description: '让宠物健康信息更容易被理解、被记录、被行动，减少养宠过程中的不确定感。',
  },
  {
    title: '技术路线',
    description:
      '围绕感知设备、知宠 App、PetSense 多模态理解引擎和专业服务平台，逐步验证产品闭环。',
  },
  {
    title: '发展状态',
    description: '当前处于官网、需求验证与产品定义阶段，真实团队、资质和案例资料待项目方确认。',
  },
]

export const homeTimeline: HomeTimelineItem[] = [
  {
    date: '2026.06',
    title: '项目正式启动',
    description: '梳理品牌定位、核心场景和第一阶段官网需求。',
  },
  {
    date: '2026.07',
    title: '官网与需求验证',
    description: '建立工程底座、设计系统和首页内容框架。',
  },
  {
    date: '待补充',
    title: '产品与合作节点',
    description: '后续节点以项目方确认资料为准。',
  },
]

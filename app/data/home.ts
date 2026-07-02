import type {
  HomeBrandNote,
  HomeCase,
  HomeHeroPoint,
  HomePillar,
  HomeProduct,
  HomeSolution,
  HomeTimelineItem,
} from '~/types/home'

export const heroPoints: HomeHeroPoint[] = [
  {
    label: '服务对象',
    value: '家庭 / 医院 / 门店',
    description: '围绕宠物健康管理与服务连接，覆盖第一阶段核心验证场景。',
  },
  {
    label: '当前资料状态',
    value: '真实信息待确认',
    description: '客户、资质、团队、联系方式和备案信息确认后再正式展示。',
  },
]

export const homePillars: HomePillar[] = [
  {
    id: 'health-management',
    icon: 'heart-pulse',
    title: '宠物健康管理',
    description: '把日常体征、行为活动和健康档案连续记录起来，帮助用户更早发现变化。',
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

export const homeProducts: HomeProduct[] = [
  {
    id: 'smart-collar',
    icon: 'collar',
    name: '知宠智能项圈',
    status: '样机与产品定义阶段',
    summary: '面向宠物日常佩戴场景，探索生命体征监测、行为活动分析和异常提醒。',
    image: '/images/concepts/smart-collar.svg',
    alt: '知宠智能项圈概念视觉',
    features: ['生命体征监测', '行为活动分析', '异常预警提醒'],
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
    description: '让健康记录更连续、异常提醒更及时，帮助家庭做出更科学的养宠判断。',
  },
  {
    id: 'hospital',
    icon: 'hospital',
    title: '宠物医院',
    audience: '医疗机构',
    description: '围绕复诊、健康档案和设备数据接入，探索更完整的院外健康管理链路。',
  },
  {
    id: 'store',
    icon: 'store',
    title: '宠物门店',
    audience: '门店与服务机构',
    description: '帮助门店把会员健康服务、提醒触达和日常照护记录变成长期服务资产。',
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
    description: '围绕智能硬件、App、健康数据分析和专业服务连接，逐步验证产品闭环。',
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

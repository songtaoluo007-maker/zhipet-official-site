import type { IconName } from '~/types/ui'

export interface IconTextItem {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface TextItem {
  id: string
  title: string
  description: string
}

export interface ProductVariant {
  id: string
  title: string
  description: string
  status: string
  tags: string[]
  presentation: 'featured' | 'alternative' | 'future'
  comparison: Array<{
    label: string
    value: string
  }>
}

export interface SolutionScenario {
  id: string
  track: 'household' | 'professional'
  icon: IconName
  title: string
  audience: string
  description: string
  abilities: string[]
  boundary?: string
  image: string
  imagePosition?: string
  alt: string
  href: string
}

export interface HomeStoryPanelMetric {
  id: string
  label: string
  value: string
}

export interface HomeStoryAppPanel {
  title: string
  score: string
  summary: string
  progress: number
  metrics: HomeStoryPanelMetric[]
}

export interface HomeStorySignal extends IconTextItem {
  panel: HomeStoryAppPanel
}

export interface HomeStoryStage {
  id: string
  eyebrow: string
  icon: IconName
  title: string
  description: string
  asset: string
  assetAlt: string
  tone: 'light' | 'warm' | 'deep'
  phoneTitle: string
  phoneScore: string
  phoneSummary: string
  signals: HomeStorySignal[]
  metrics: HomeStoryPanelMetric[]
}

export interface HomeStoryActions {
  primaryLabel: string
  primaryTo: string
  secondaryLabel: string
  secondaryTo: string
}

export type HomeStoryActionId = 'companionship' | 'safety' | 'health' | 'collaboration'

export const homeStoryActions: Record<HomeStoryActionId, HomeStoryActions> = {
  companionship: {
    primaryLabel: '了解产品',
    primaryTo: '/products',
    secondaryLabel: 'App 下载',
    secondaryTo: '/download',
  },
  safety: {
    primaryLabel: '了解安全能力',
    primaryTo: '/products/smart-collar',
    secondaryLabel: 'App 下载',
    secondaryTo: '/download',
  },
  health: {
    primaryLabel: '查看健康研究',
    primaryTo: '/research',
    secondaryLabel: 'App 下载',
    secondaryTo: '/download',
  },
  collaboration: {
    primaryLabel: '了解解决方案',
    primaryTo: '/solutions',
    secondaryLabel: '联系知宠团队',
    secondaryTo: '/contact',
  },
}

export const resolveHomeStoryActions = (id: string): HomeStoryActions => {
  if (id in homeStoryActions) {
    return homeStoryActions[id as HomeStoryActionId]
  }

  return homeStoryActions.companionship
}

export interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
  keywords: string[]
}

export const homeMetricCards: TextItem[] = [
  {
    id: 'safety',
    title: '安全提醒',
    description: '定位、围栏与提醒会受设备、网络和环境条件影响',
  },
  {
    id: 'health',
    title: '健康趋势',
    description: '围绕活动、休息和照护记录做连续观察',
  },
  {
    id: 'state',
    title: '状态解释',
    description: '以可能、趋势和风险提示表达 AI 判断',
  },
  {
    id: 'archive',
    title: '健康档案',
    description: '记录范围遵循最小必要与用户授权原则',
  },
]

export const solutionJourneySteps: IconTextItem[] = [
  {
    id: 'choose',
    icon: 'home',
    title: '选择使用场景',
    description: '先明确家庭日常或专业服务任务，让后续信息围绕真实照护关系展开。',
  },
  {
    id: 'authorize',
    icon: 'shield-check',
    title: '明确授权边界',
    description: '说明记录、查看与共享范围，敏感信息只在必要且获得授权的前提下流转。',
  },
  {
    id: 'continue',
    icon: 'chart',
    title: '持续观察与沟通',
    description: '用趋势和照护记录形成连续线索，同时保留不确定性与专业判断空间。',
  },
]

export const homeStoryStages: HomeStoryStage[] = [
  {
    id: 'companionship',
    eyebrow: '01 / 陪伴守护',
    icon: 'heart-pulse',
    title: '宠物不会说话，但日常会留下线索',
    description:
      '首页以犬猫、智能项圈和 App 面板组成一个连续场景，让用户先看到“陪伴被记录下来”的故事，而不是先看参数表。',
    asset: '/images/generated/zhipet-home-companion.webp',
    assetAlt: '知宠犬猫陪伴与 App 概念视觉',
    tone: 'light',
    phoneTitle: '今日观察',
    phoneScore: '96',
    phoneSummary: '依据活动、休息和照护记录形成趋势提示，并保留必要的不确定性。',
    signals: [
      {
        id: 'heart',
        icon: 'heart-pulse',
        title: '健康趋势',
        description: '可能平稳',
        panel: {
          title: '健康趋势',
          score: '96',
          summary: '依据活动、休息和照护记录形成趋势提示，仍需结合主人反馈确认。',
          progress: 76,
          metrics: [
            { id: 'activity', label: '活动', value: '趋势平稳' },
            { id: 'care', label: '照护', value: '记录同步' },
            { id: 'sleep', label: '睡眠', value: '片段观察' },
            { id: 'basis', label: '依据', value: '主人反馈' },
          ],
        },
      },
      {
        id: 'sleep',
        icon: 'sparkles',
        title: '睡眠分析',
        description: '片段待观察',
        panel: {
          title: '睡眠分析',
          score: '8h 24m',
          summary: '夜间休息片段可能变短，建议观察环境噪声、作息变化与近期活动量。',
          progress: 64,
          metrics: [
            { id: 'rest', label: '休息', value: '片段变短' },
            { id: 'basis', label: '依据', value: '连续记录' },
            { id: 'environment', label: '环境', value: '结合家庭情况' },
            { id: 'advice', label: '建议', value: '继续观察' },
          ],
        },
      },
      {
        id: 'location',
        icon: 'map-pin',
        title: '位置线索',
        description: '范围由用户设置',
        panel: {
          title: '位置线索',
          score: '附近',
          summary: '位置展示用于辅助理解活动范围，刷新频率和误差会受到网络与环境影响。',
          progress: 58,
          metrics: [
            { id: 'range', label: '围栏', value: '由用户设置' },
            { id: 'refresh', label: '刷新', value: '以设备状态为准' },
            { id: 'share', label: '共享', value: '授权后' },
            { id: 'basis', label: '依据', value: '设备回传' },
          ],
        },
      },
      {
        id: 'shield',
        icon: 'shield-check',
        title: '风险提醒',
        description: '需主人复核',
        panel: {
          title: '风险提醒',
          score: '待定',
          summary: '提醒仅作为风险提示，阈值、触达方式和通知对象仍需项目方确认。',
          progress: 52,
          metrics: [
            { id: 'trigger', label: '触发', value: '结合个体基线' },
            { id: 'review', label: '复核', value: '主人确认' },
            { id: 'evidence', label: '依据', value: '多项记录' },
            { id: 'boundary', label: '边界', value: '非诊断' },
          ],
        },
      },
    ],
    metrics: [
      { id: 'activity', label: '活动', value: '趋势观察' },
      { id: 'care', label: '照护', value: '记录同步' },
    ],
  },
  {
    id: 'safety',
    eyebrow: '02 / 安全边界',
    icon: 'map-pin',
    title: '从一次佩戴，到一次安心出门',
    description:
      '产品叙事围绕安全范围、异常提醒和触达规则展开，同时说明定位、刷新和提醒能力受设备、网络与环境条件影响。',
    asset: '/images/generated/zhipet-safety-collar.webp',
    assetAlt: '知宠智能项圈模块概念视觉',
    tone: 'warm',
    phoneTitle: '安全范围',
    phoneScore: '待定',
    phoneSummary: '围栏、定位和触达策略为规划展示，不写成已验证承诺。',
    signals: [
      {
        id: 'location',
        icon: 'map-pin',
        title: '位置线索',
        description: '规则由用户设置',
        panel: {
          title: '位置线索',
          score: '附近',
          summary: '位置展示用于辅助理解活动范围，刷新频率和误差会受到网络与环境影响。',
          progress: 58,
          metrics: [
            { id: 'range', label: '围栏', value: '由用户设置' },
            { id: 'refresh', label: '刷新', value: '以设备状态为准' },
          ],
        },
      },
      {
        id: 'shield',
        icon: 'shield-check',
        title: '异常提醒',
        description: '需主人复核',
        panel: {
          title: '异常提醒',
          score: '待定',
          summary: '提醒仅作为风险提示，触达方式、阈值和通知对象需由项目方确认。',
          progress: 52,
          metrics: [
            { id: 'trigger', label: '触发', value: '结合个体基线' },
            { id: 'review', label: '复核', value: '主人确认' },
          ],
        },
      },
    ],
    metrics: [
      { id: 'range', label: '围栏', value: '由用户设置' },
      { id: 'notify', label: '触达', value: '由用户授权' },
    ],
  },
  {
    id: 'health',
    eyebrow: '03 / 长期健康',
    icon: 'chart',
    title: '健康不是单次结论，而是长期趋势',
    description:
      '下滑切换到 App 与档案视角，强调持续观察、依据和不确定性，避免把 AI 提示包装成诊断。',
    asset: '/images/generated/zhipet-health-archive.webp',
    assetAlt: '知宠 App 健康档案平台概念视觉',
    tone: 'deep',
    phoneTitle: '趋势档案',
    phoneScore: '观察',
    phoneSummary: '健康趋势只作为风险提示和沟通线索，不替代执业兽医判断。',
    signals: [
      {
        id: 'archive',
        icon: 'phone',
        title: '健康档案',
        description: '遵循授权范围',
        panel: {
          title: '健康档案',
          score: '观察',
          summary: '围绕活动、休息和照护记录建立长期档案，信息范围遵循最小必要原则。',
          progress: 70,
          metrics: [
            { id: 'evidence', label: '依据', value: '连续记录' },
            { id: 'export', label: '共享', value: '授权前提' },
          ],
        },
      },
      {
        id: 'privacy',
        icon: 'lock',
        title: '隐私授权',
        description: '由用户自主控制',
        panel: {
          title: '隐私授权',
          score: '需结合观察',
          summary: '原始音频、家庭环境音频和宠物数据均按敏感数据处理，删除与共享规则需确认。',
          progress: 48,
          metrics: [
            { id: 'permission', label: '授权', value: '用户可管理' },
            { id: 'delete', label: '删除', value: '提供管理路径' },
          ],
        },
      },
    ],
    metrics: [
      { id: 'evidence', label: '依据', value: '连续记录' },
      { id: 'uncertainty', label: '不确定性', value: '明确展示' },
    ],
  },
]

export const homeTeasers: Array<TextItem & { label: string }> = [
  {
    id: 'trace',
    label: '01',
    title: '宠物不会说话，但健康会留下痕迹',
    description: '从叫声、活动、休息和照护记录中发现可能变化。',
  },
  {
    id: 'journey',
    label: '02',
    title: '从一次佩戴，到长期健康管理',
    description: '设备只是入口，长期记录和主人反馈才让状态更清楚。',
  },
  {
    id: 'collab',
    label: '03',
    title: '连接家庭、宠物与医院',
    description: '在授权前提下整理沟通线索，不替代专业诊疗判断。',
  },
]

export const productVariants: ProductVariant[] = [
  {
    id: 'collar-integrated',
    title: '项圈一体版',
    description: '面向开箱即用和长期佩戴体验，关注舒适贴合与日常稳定性。',
    status: '核心形态',
    tags: ['长期佩戴', '完整体验', '舒适贴合'],
    presentation: 'featured',
    comparison: [
      { label: '适合场景', value: '长期日常佩戴' },
      { label: '安装方式', value: '项圈一体' },
    ],
  },
  {
    id: 'clip-basic',
    title: '夹扣基础版',
    description: '适配已有项圈，面向轻便日常出行和低打扰佩戴。',
    status: '基础形态',
    tags: ['轻便灵活', '适配已有项圈', '猫与小型犬友好'],
    presentation: 'alternative',
    comparison: [
      { label: '适合场景', value: '轻便日常出行' },
      { label: '安装方式', value: '夹扣已有项圈' },
    ],
  },
  {
    id: 'clip-safe',
    title: '夹扣安全版',
    description: '面向日常安全场景，强调稳定固定与清晰提醒。',
    status: '安全形态',
    tags: ['日常安全', '稳定固定', '异常提醒'],
    presentation: 'alternative',
    comparison: [
      { label: '适合场景', value: '日常安全关注' },
      { label: '安装方式', value: '夹扣固定' },
    ],
  },
  {
    id: 'harness',
    title: '胸背带进阶版',
    description: '作为后续拓展形态展示，不声明已发布或量产。',
    status: '后续拓展',
    tags: ['进阶场景', '活跃宠物', '稳固佩戴'],
    presentation: 'future',
    comparison: [],
  },
]

export const valueLayers: IconTextItem[] = [
  {
    id: 'safety',
    icon: 'shield-check',
    title: '第一层 · 安全',
    description: '围绕异常提醒、活动区域和安全触达建立清晰入口。',
  },
  {
    id: 'health',
    icon: 'heart-pulse',
    title: '第二层 · 健康',
    description: '通过连续记录观察活动、休息、照护备注等趋势，不声明医疗级能力。',
  },
  {
    id: 'state',
    icon: 'sparkles',
    title: '第三层 · 状态解读',
    description: '将复杂信号转化为可能状态、依据、不确定性和建议观察。',
  },
]

export const productFeatureStrip = [
  '轻盈佩戴方向',
  '续航以正式产品说明为准',
  '防护能力以正式产品说明为准',
  '材质信息以正式产品说明为准',
  'App 连接规划',
]

export const solutionScenarios: SolutionScenario[] = [
  {
    id: 'family',
    track: 'household',
    icon: 'home',
    title: '科学养宠，守护日常点滴',
    audience: '家庭养宠',
    description: '把防走失、异常提醒、长期趋势和家庭共享放在同一套照护路径里。',
    abilities: ['安全提醒', '异常变化观察', '长期趋势', '家庭协作'],
    image: '/images/generated/pages/zhipet-family-care-scene.webp',
    imagePosition: 'center',
    alt: '知宠家庭养宠解决方案概念视觉',
    href: '/solutions/family',
  },
  {
    id: 'hospital',
    track: 'professional',
    icon: 'hospital',
    title: '让诊疗沟通更完整',
    audience: '宠物医院',
    description: '整理院外连续记录、授权共享和就诊前摘要，用于辅助家庭与专业人员沟通。',
    abilities: ['院外记录', '授权共享', '健康档案', '就诊前摘要'],
    boundary: '辅助沟通，不替代诊断',
    image: '/images/generated/pages/zhipet-hospital-collab-scene.webp',
    imagePosition: 'center',
    alt: '宠物医院健康管理协同概念视觉',
    href: '/solutions/hospital',
  },
  {
    id: 'store',
    track: 'professional',
    icon: 'store',
    title: '服务更贴心，连接更长远',
    audience: '宠物门店 / 机构',
    description: '围绕会员健康服务、回访提醒、行为趋势和服务记录建立长期连接。',
    abilities: ['会员健康服务', '回访提醒', '行为趋势', '服务记录归档'],
    image: '/images/generated/pages/zhipet-store-service-scene.webp',
    imagePosition: 'center',
    alt: '宠物门店服务连接概念视觉',
    href: '/solutions/store',
  },
]

export const trustStrip: IconTextItem[] = [
  {
    id: 'privacy',
    icon: 'shield-check',
    title: '数据安全',
    description: '以清晰授权、最小化采集和可撤回机制保护数据。',
  },
  {
    id: 'sync',
    icon: 'phone',
    title: '跨端协同',
    description: '让设备、手机与服务流程保持一致的信息链路。',
  },
  {
    id: 'open',
    icon: 'building',
    title: '开放合作',
    description: '围绕真实场景建立清晰、克制的协作边界。',
  },
  {
    id: 'evidence',
    icon: 'chart',
    title: '科学循证',
    description: '让趋势提示保留依据、不确定性和专业判断边界。',
  },
]

export const aboutAbilities: IconTextItem[] = [
  {
    id: 'safety',
    icon: 'shield-check',
    title: '安全',
    description: '守护每一次出行，也守护家庭和宠物数据的授权边界。',
  },
  {
    id: 'health',
    icon: 'heart-pulse',
    title: '健康',
    description: '长期观察活动、休息、照护记录等趋势，不声明医疗级生命体征能力。',
  },
  {
    id: 'state',
    icon: 'sparkles',
    title: '状态解读',
    description: '将复杂信号转化为可理解的状态提示、依据和不确定性。',
  },
]

export const productBoundaries: TextItem[] = [
  {
    id: 'no-translation',
    title: '不做逐字翻译',
    description: '知宠不会把 AI 宠物理解描述成宠物语言逐字翻译。',
  },
  {
    id: 'no-diagnosis',
    title: '不做医疗诊断',
    description: '状态提示、趋势观察和风险提示不能替代执业兽医意见。',
  },
  {
    id: 'assistive',
    title: '提供辅助线索',
    description: '围绕状态解释、趋势观察、风险提示与就诊前数据辅助建立产品边界。',
  },
]

export const helpCategories: IconTextItem[] = [
  {
    id: 'wear',
    icon: 'collar',
    title: '安装与佩戴',
    description: '了解日常佩戴、舒适度观察和使用注意事项。',
  },
  {
    id: 'connect',
    icon: 'phone',
    title: '连接与定位',
    description: '了解设备连接、位置刷新和安全提醒的使用边界。',
  },
  {
    id: 'health',
    icon: 'heart-pulse',
    title: '健康提醒',
    description: '健康趋势观察不替代专业诊疗判断。',
  },
  {
    id: 'privacy',
    icon: 'shield-check',
    title: '数据与隐私',
    description: '了解最小必要、用户授权、信息管理和隐私权利。',
  },
  {
    id: 'support',
    icon: 'mail',
    title: '意见反馈',
    description: '提交产品建议、官网内容问题和使用体验反馈。',
  },
  {
    id: 'more',
    icon: 'sparkles',
    title: '更多问题',
    description: '查找其他常见说明，或直接联系知宠团队。',
  },
]

export const faqItems: FaqItem[] = [
  {
    id: 'location-refresh',
    category: '连接与定位',
    question: '定位不更新或偏差大怎么办？',
    answer:
      '请先检查设备电量、连接状态和网络环境。位置刷新可能受室内遮挡、网络与设备状态影响，具体能力以正式产品说明为准。',
    keywords: ['定位', '刷新', '偏差'],
  },
  {
    id: 'health-frequency',
    category: '健康提醒',
    question: '健康数据多久更新一次？',
    answer:
      '不同记录的更新节奏可能不同，页面应同时显示最近更新时间。健康提醒只用于趋势观察和风险提示，不替代专业诊疗。',
    keywords: ['健康', '数据', '更新'],
  },
  {
    id: 'battery',
    category: '安装与佩戴',
    question: '设备续航时间是多久？',
    answer:
      '续航会受到连接方式、位置刷新频率、网络、温度和使用习惯影响，具体时长以正式产品说明与设备页面为准。',
    keywords: ['续航', '电量', '设备'],
  },
  {
    id: 'privacy',
    category: '数据与隐私',
    question: '如何保障我的数据隐私？',
    answer:
      '知宠将原始音频、家庭环境信息和宠物数据视为敏感信息，并坚持最小必要、清晰授权与用户可管理原则。官网意见反馈的处理方式可查看隐私说明。',
    keywords: ['隐私', '数据', '音频'],
  },
]

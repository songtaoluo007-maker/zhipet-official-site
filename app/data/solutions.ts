import type { SolutionCard, SolutionDetail } from '~/types/solution'

export const solutionCards: SolutionCard[] = [
  {
    id: 'family',
    icon: 'home',
    title: '家庭养宠',
    audience: '家庭用户',
    status: '方案定义阶段',
    summary: '围绕日常佩戴、健康记录、异常提醒和家庭成员协作，帮助家庭把宠物健康变化看得更清楚。',
    image: '/images/concepts/family-solution.svg',
    alt: '知宠家庭养宠解决方案概念视觉',
    features: ['健康趋势记录', '异常提醒协作', '复诊资料整理'],
    href: '/solutions/family',
  },
  {
    id: 'hospital',
    icon: 'hospital',
    title: '宠物医院',
    audience: '医疗机构',
    status: '场景验证阶段',
    summary: '探索院外健康记录、复诊沟通和设备数据接入，真实合作流程待机构确认后再展示。',
    image: '/images/concepts/clinic-workflow.svg',
    alt: '宠物医院健康管理协同概念视觉',
    features: ['院外管理', '复诊沟通', '数据接入'],
  },
  {
    id: 'store',
    icon: 'store',
    title: '宠物门店',
    audience: '门店与服务机构',
    status: '服务流程规划中',
    summary: '围绕会员健康服务、提醒触达和照护记录归档建立长期连接，具体方案待项目方确认。',
    image: '/images/concepts/app-platform.svg',
    alt: '宠物门店服务连接概念视觉',
    features: ['会员服务', '提醒触达', '照护归档'],
  },
]

export const familySolution: SolutionDetail = {
  slug: 'family',
  title: '家庭养宠解决方案',
  headline: '把日常健康变化看得更清楚',
  summary:
    '知宠家庭养宠解决方案面向日常陪伴、健康记录和异常提醒场景，连接智能项圈、知宠 App 与后续服务流程。当前内容用于方案定义展示，真实服务范围与上线节奏以项目方确认为准。',
  status: '家庭场景方案定义阶段',
  cover: '/images/concepts/family-solution.svg',
  coverAlt: '知宠家庭养宠解决方案概念视觉',
  painPoints: [
    {
      id: 'scattered-records',
      icon: 'chart',
      title: '记录分散',
      description: '体重、活动、异常表现和复诊信息常散落在聊天记录或纸质单据里，难以持续回看。',
    },
    {
      id: 'late-awareness',
      icon: 'heart-pulse',
      title: '异常发现滞后',
      description: '宠物无法清楚表达不适，家庭往往只能在明显变化后才意识到需要进一步关注。',
    },
    {
      id: 'family-collaboration',
      icon: 'users',
      title: '家庭协作不清晰',
      description: '多人照护时，喂养、活动、提醒和就诊安排容易重复或遗漏，需要更清晰的协同线索。',
    },
  ],
  workflow: [
    {
      id: 'profile',
      order: '01',
      title: '建立宠物档案',
      description: '在知宠 App 中记录宠物基础信息、家庭成员和日常照护偏好。',
    },
    {
      id: 'device',
      order: '02',
      title: '佩戴智能项圈',
      description: '通过样机阶段定义的设备能力，探索健康与活动趋势的连续记录方式。',
    },
    {
      id: 'notice',
      order: '03',
      title: '接收提醒与记录',
      description: '当趋势出现异常或需要复核时，通过 App 承接提醒、备注和家庭协作。',
    },
    {
      id: 'review',
      order: '04',
      title: '整理复诊参考',
      description: '将近期趋势、异常记录和照护备注汇总为沟通线索，辅助后续专业判断。',
    },
  ],
  modules: [
    {
      id: 'collar',
      icon: 'collar',
      title: '智能项圈',
      description: '承担日常佩戴和基础数据记录角色，具体传感器、续航和防护等级待项目方确认。',
    },
    {
      id: 'app',
      icon: 'phone',
      title: '知宠 App',
      description: '集中呈现宠物档案、趋势记录、提醒通知和家庭成员协作，减少信息分散。',
    },
    {
      id: 'service',
      icon: 'shield-check',
      title: '服务连接',
      description: '为后续医院、门店或合作机构服务留出连接位置，不在当前阶段承诺具体服务结果。',
    },
  ],
  guardrails: [
    {
      id: 'medical-boundary',
      title: '不替代专业诊疗',
      description: '页面展示的趋势记录和提醒不替代专业诊疗，医疗判断仍应以执业兽医意见为准。',
    },
    {
      id: 'prototype-boundary',
      title: '样机能力待确认',
      description: '智能项圈、App 与服务流程仍处于方案定义阶段，具体能力以项目方确认资料为准。',
    },
    {
      id: 'privacy-boundary',
      title: '隐私与授权待完善',
      description: '家庭成员协作、数据共享和机构连接需要明确授权机制，相关规则待项目方确认。',
    },
  ],
  confirmationItems: [
    {
      label: '服务上线状态',
      value: '待项目方确认',
      note: '当前为方案定义展示',
    },
    {
      label: '硬件适配范围',
      value: '待项目方确认',
      note: '犬猫体型、佩戴方式和舒适性需样机验证',
    },
    {
      label: '提醒规则',
      value: '待项目方确认',
      note: '阈值、频率和触达方式需结合真实测试确定',
    },
    {
      label: '合作服务入口',
      value: '待项目方确认',
      note: '医院、门店或客服流程确认后再展示',
    },
  ],
}

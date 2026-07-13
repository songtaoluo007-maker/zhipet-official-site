import type { SolutionDetail } from '~/types/solution'

export const familySolution: SolutionDetail = {
  slug: 'family',
  title: '家庭养宠解决方案',
  breadcrumbLabel: '家庭养宠',
  headline: '把日常行为和陪伴状态看得更清楚',
  summary:
    '知宠家庭养宠解决方案面向日常陪伴、状态理解和异常变化观察场景，将声音、动作、活动、场景与长期记录组织成更容易理解的照护线索。',
  cover: '/images/generated/pages/zhipet-family-care-scene.webp',
  coverAlt: '知宠家庭养宠解决方案概念视觉',
  painPoints: [
    {
      id: 'sound-state',
      icon: 'sparkles',
      title: '宠物叫声和状态理解',
      description: '宠物持续叫唤、短促叫声或叫声节律变化时，主人需要结合场景判断它可能是焦虑、寻求关注还是受环境影响。',
    },
    {
      id: 'behavior-change',
      icon: 'chart',
      title: '日常行为变化分析',
      description: '独处活动增加、门口徘徊、夜间突然活跃等变化需要被连续记录，避免只凭单次印象下结论。',
    },
    {
      id: 'emotion-trend',
      icon: 'heart-pulse',
      title: '情绪趋势记录',
      description: '把叫声、活动、作息和主人反馈放在一起回看，帮助家庭理解宠物可能的情绪趋势和陪伴需求。',
    },
  ],
  workflow: [
    {
      id: 'capture',
      order: '01',
      title: '设备或手机采集',
      description: '通过智能挂件、手机记录或 App 手动补充，采集声音、动作、活动、场景和照护备注。',
    },
    {
      id: 'record',
      order: '02',
      title: '数据记录',
      description: '把叫声节律、活动趋势、常见场景和主人补充信息沉淀为可回看的家庭记录。',
    },
    {
      id: 'analyze',
      order: '03',
      title: '多模态分析',
      description: 'PetSense 结合声音、动作、场景和历史数据，推测宠物可能的情绪、需求和异常状态。',
    },
    {
      id: 'interpret',
      order: '04',
      title: '状态解释',
      description: 'App 展示可能状态、分析依据、置信度和其他可能解释，帮助主人理解为什么会得到这个提示。',
    },
    {
      id: 'feedback',
      order: '05',
      title: '主人反馈',
      description: '主人可补充实际情况、安抚结果或误判反馈，让后续提示更贴近这只宠物的日常。',
    },
    {
      id: 'profile',
      order: '06',
      title: '个体画像持续更新',
      description: '系统围绕品种年龄、作息、常见叫声、行为习惯和异常阈值持续完善长期个体画像。',
    },
  ],
  modules: [
    {
      id: 'profile',
      icon: 'chart',
      title: '长期个体画像',
      description: '记录品种和年龄、日常作息、常见叫声、行为习惯、主人反馈和个体异常阈值。',
    },
    {
      id: 'natural-question',
      icon: 'phone',
      title: '主人自然语言询问',
      description: '主人可在 App 中询问近期叫唤、独处状态或行为变化，获得带依据的可能解释。',
    },
    {
      id: 'care-advice',
      icon: 'shield-check',
      title: '陪伴和观察建议',
      description: '围绕远程安抚、持续观察、家庭协作和专业咨询边界给出克制建议，不替代专业判断。',
    },
  ],
  secondaryAction: {
    label: '了解 AI 宠物理解',
    to: '/ai-pet-understanding',
  },
  guardrails: [
    {
      id: 'medical-boundary',
      title: '不替代专业诊疗',
      description: '页面展示的状态提示、趋势记录和陪伴建议不替代专业诊疗，健康判断仍应以执业兽医意见为准。',
    },
    {
      id: 'probability-boundary',
      title: '使用概率表达',
      description: 'AI 结果应使用可能、推测、趋势和风险提示等表达，数据不足时需要明确说明不确定性。',
    },
    {
      id: 'privacy-boundary',
      title: '尊重隐私与授权',
      description: '原始音频、家庭环境音频和宠物数据均应视为敏感数据，采集、删除和共享需要清晰授权。',
    },
  ],
  sections: {
    painTitle: '家庭养宠常见难点',
    painDescription: '方案先解决日常叫声、行为、情绪趋势和长期习惯的理解缺口，不做未验证诊疗承诺。',
    workflowTitle: '家庭宠物理解流程',
    workflowDescription: '从设备或手机采集到主人反馈，形成可持续更新的个体画像和陪伴建议。',
    modulesTitle: '家庭端能力组成',
    modulesDescription: '以长期个体画像、自然语言询问和陪伴建议组织体验，避免额外堆叠功能模块。',
    boundaryTitle: '使用边界',
    boundaryDescription: '把概率分析、专业诊疗边界和敏感数据授权写清楚，比把概念写成确定承诺更重要。',
    ctaTitle: '想确认家庭宠物理解方案是否适合您？',
    ctaDescription: '通过公开邮箱了解 App 流程和 AI 宠物理解边界。',
  },
}

export const hospitalSolution: SolutionDetail = {
  slug: 'hospital',
  title: '宠物医院解决方案',
  breadcrumbLabel: '宠物医院',
  headline: '让院外健康记录成为复诊沟通线索',
  summary:
    '知宠宠物医院解决方案面向院外观察、复诊沟通和授权数据协同场景，让家庭记录成为更清晰的沟通线索。',
  cover: '/images/generated/pages/zhipet-hospital-collab-scene.webp',
  coverAlt: '宠物医院健康管理协同概念视觉',
  painPoints: [
    {
      id: 'out-of-clinic-gap',
      icon: 'chart',
      title: '院外记录断点',
      description: '复诊前后的活动、食欲、异常表现和照护备注常由主人零散描述，缺少可回看的连续线索。',
    },
    {
      id: 'follow-up-cost',
      icon: 'hospital',
      title: '复诊沟通成本高',
      description: '机构与家庭之间需要反复确认症状变化和照护执行情况，流程边界与信息格式仍需验证。',
    },
    {
      id: 'authorization-boundary',
      icon: 'shield-check',
      title: '授权边界要清楚',
      description: '健康记录与机构协同必须建立明确授权机制，不能默认共享，也不能替代专业诊疗判断。',
    },
  ],
  workflow: [
    {
      id: 'authorize',
      order: '01',
      title: '确认授权与档案',
      description: '在项目方确认的授权流程下，建立宠物档案与机构沟通所需的基础信息。',
    },
    {
      id: 'observe',
      order: '02',
      title: '记录院外变化',
      description: '围绕可读取的日常数据，沉淀活动趋势、异常备注和照护执行情况。',
    },
    {
      id: 'summarize',
      order: '03',
      title: '形成复诊摘要',
      description: '把近期趋势和主人备注整理为复诊沟通线索，减少重复询问和信息遗漏。',
    },
    {
      id: 'handoff',
      order: '04',
      title: '机构侧参考沟通',
      description: '在主人授权前提下，为医生端、客服端或院内系统提供清晰的参考摘要。',
    },
  ],
  modules: [
    {
      id: 'record-entry',
      icon: 'collar',
      title: '院外记录入口',
      description: '承接智能挂件与 App 的趋势记录能力，整理与复诊沟通相关的连续线索。',
    },
    {
      id: 'clinic-view',
      icon: 'hospital',
      title: '机构协同视图',
      description: '预留复诊摘要、备注归档和授权查看入口，真实界面形态需结合机构流程验证。',
    },
    {
      id: 'privacy-rule',
      icon: 'shield-check',
      title: '授权与隐私规则',
      description: '以主人授权为前提处理数据查看、撤回和留痕，避免默认共享。',
    },
  ],
  guardrails: [
    {
      id: 'medical-boundary',
      title: '不替代专业诊疗',
      description: '页面展示的记录、摘要和提醒只作为沟通参考，不替代执业兽医诊断、处方或治疗方案。',
    },
    {
      id: 'partner-boundary',
      title: '真实协作原则',
      description: '只基于真实授权关系开展协作，不以虚构案例或数据代替实际服务。',
    },
    {
      id: 'authorization-boundary',
      title: '授权流程清晰',
      description: '数据共享、查看权限、撤回机制和留痕规则需要对家庭与机构保持透明。',
    },
  ],
  sections: {
    painTitle: '医院场景常见难点',
    painDescription: '先梳理院外记录与复诊沟通中的信息缺口，再建立清晰的授权与协作方式。',
    workflowTitle: '院外健康协同流程',
    workflowDescription: '从授权建档到复诊摘要，流程强调可验证、可撤回和边界清晰。',
    modulesTitle: '方案组成',
    modulesDescription: '以院外记录、机构协同和授权规则三个层次组织能力。',
    boundaryTitle: '使用边界',
    boundaryDescription: '医疗场景必须把诊疗边界、授权机制和合作状态写得足够清楚。',
    ctaTitle: '想评估医院场景的协同方式？',
    ctaDescription: '通过公开邮箱沟通院外记录口径和机构协同边界。',
  },
}

export const storeSolution: SolutionDetail = {
  slug: 'store',
  title: '宠物门店解决方案',
  breadcrumbLabel: '宠物门店',
  headline: '把照护记录与会员服务连接起来',
  summary:
    '知宠宠物门店解决方案面向会员健康服务、提醒触达和照护记录归档场景，让每次服务都能成为长期照护的一部分。',
  cover: '/images/generated/pages/zhipet-store-service-scene.webp',
  coverAlt: '宠物门店服务连接概念视觉',
  painPoints: [
    {
      id: 'member-records',
      icon: 'users',
      title: '会员健康信息分散',
      description: '门店服务记录、宠物档案和主人偏好常分散在多个工具里，长期服务线索不够集中。',
    },
    {
      id: 'touchpoint',
      icon: 'phone',
      title: '提醒触达不稳定',
      description: '疫苗、护理、复购和复访提醒需要明确授权与频率，避免过度触达。',
    },
    {
      id: 'service-archive',
      icon: 'store',
      title: '服务记录难沉淀',
      description: '美容、寄养、护理和健康建议需要统一归档，便于后续回访与服务衔接。',
    },
  ],
  workflow: [
    {
      id: 'profile',
      order: '01',
      title: '建立会员宠物档案',
      description: '在确认授权的前提下，记录宠物基础信息、服务偏好和门店沟通备注。',
    },
    {
      id: 'service-record',
      order: '02',
      title: '同步照护记录',
      description: '把门店服务、健康提醒和主人补充信息整理成可追溯记录。',
    },
    {
      id: 'remind',
      order: '03',
      title: '触达提醒与复访',
      description: '围绕项目方确认的触达方式规划服务提醒，不展示未验证转化数据。',
    },
    {
      id: 'archive',
      order: '04',
      title: '沉淀服务线索',
      description: '将照护记录与会员服务历史归档，为后续精细化服务预留连接位置。',
    },
  ],
  modules: [
    {
      id: 'store-entry',
      icon: 'store',
      title: '门店服务入口',
      description: '承接门店会员、护理记录和回访任务，保持服务信息连贯。',
    },
    {
      id: 'member-app',
      icon: 'phone',
      title: '会员 App 协作',
      description: '让主人查看宠物档案、提醒和服务记录，账号与触达遵循清晰授权和用户自主控制。',
    },
    {
      id: 'archive-rule',
      icon: 'shield-check',
      title: '数据归档与授权',
      description: '围绕授权、撤回和记录留存设计流程，避免把服务数据默认公开或过度共享。',
    },
  ],
  guardrails: [
    {
      id: 'business-boundary',
      title: '不承诺经营结果',
      description: '页面不展示虚构转化率、复购率或门店案例，经营效果需真实合作数据支撑。',
    },
    {
      id: 'medical-boundary',
      title: '不替代专业诊疗',
      description: '门店健康提醒和照护记录只作为服务参考，不替代专业诊疗或医疗判断。',
    },
    {
      id: 'authorization-boundary',
      title: '授权与触达克制',
      description: '会员通知、数据查看和门店协作需要建立清晰授权机制。',
    },
  ],
  sections: {
    painTitle: '门店服务常见难点',
    painDescription: '先把会员服务链路中的信息分散、授权触达和记录归档问题讲清楚。',
    workflowTitle: '会员健康服务流程',
    workflowDescription: '从会员档案到服务归档，流程以可确认、可调整和可授权为前提。',
    modulesTitle: '方案组成',
    modulesDescription: '以门店服务入口、会员 App 协作和授权归档三个层次组织方案。',
    boundaryTitle: '使用边界',
    boundaryDescription: '门店场景不虚构经营结果，也不把服务提醒包装成医疗判断。',
    ctaTitle: '想确认门店服务流程是否匹配？',
    ctaDescription: '通过公开邮箱沟通会员场景、触达方式和服务边界。',
  },
}

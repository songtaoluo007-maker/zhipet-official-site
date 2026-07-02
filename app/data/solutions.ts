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
    href: '/solutions/hospital',
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
    href: '/solutions/store',
  },
]

export const familySolution: SolutionDetail = {
  slug: 'family',
  title: '家庭养宠解决方案',
  breadcrumbLabel: '家庭养宠',
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
  sections: {
    painTitle: '家庭养宠常见难点',
    painDescription: '方案先解决日常信息缺口，不做未验证诊疗承诺，也不展示虚构用户数据。',
    workflowTitle: '家庭健康管理流程',
    workflowDescription: '从建立档案到整理复诊参考，流程保持轻量清晰，后续再接入真实设备绑定能力。',
    workflowImage: '/images/concepts/collar-ecosystem.svg',
    workflowImageAlt: '智能项圈、App 和平台协同概念视觉',
    modulesTitle: '方案组成',
    modulesDescription: '以智能硬件、用户端 App 和服务连接三个层次组织能力，具体产品能力仍以确认资料为准。',
    boundaryTitle: '边界与待确认项',
    boundaryDescription: '把页面边界写清楚，比把概念写成确定承诺更重要。',
    ctaTitle: '想确认家庭养宠方案是否适合您？',
    ctaDescription: '预约演示，了解当前样机能力、App 流程和后续服务规划。',
  },
}

export const hospitalSolution: SolutionDetail = {
  slug: 'hospital',
  title: '宠物医院解决方案',
  breadcrumbLabel: '宠物医院',
  headline: '让院外健康记录成为复诊沟通线索',
  summary:
    '知宠宠物医院解决方案面向院外观察、复诊沟通和授权数据协同场景。当前内容用于场景验证展示，真实合作机构、数据接入范围和服务流程待项目方确认。',
  status: '场景验证阶段',
  cover: '/images/concepts/clinic-workflow.svg',
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
      description: '围绕样机阶段可验证的数据能力，沉淀活动趋势、异常备注和照护执行情况。',
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
      description: '在真实合作流程确认后，再展示医生端、客服端或院内系统的具体连接方式。',
    },
  ],
  modules: [
    {
      id: 'record-entry',
      icon: 'collar',
      title: '院外记录入口',
      description: '承接智能项圈与 App 的趋势记录能力，具体硬件指标和记录颗粒度待项目方确认。',
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
      description: '以主人授权为前提处理数据查看、撤回和留痕，具体合规规则待项目方确认。',
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
      title: '合作机构待确认',
      description: '不展示虚构医院名称、合作案例或落地数据，机构名单需由项目方确认后再发布。',
    },
    {
      id: 'authorization-boundary',
      title: '授权流程待确认',
      description: '数据共享、查看权限、撤回机制和留痕规则均需项目方确认后再进入正式官网口径。',
    },
  ],
  confirmationItems: [
    {
      label: '合作机构名单',
      value: '待项目方确认',
      note: '不使用虚构医院或客户 Logo',
    },
    {
      label: '数据接入范围',
      value: '待项目方确认',
      note: '设备、App 或院内系统字段需真实确认',
    },
    {
      label: '医生端流程',
      value: '待项目方确认',
      note: '问诊、复诊、客服角色边界需验证',
    },
    {
      label: '服务上线状态',
      value: '待项目方确认',
      note: '当前为场景验证展示',
    },
  ],
  sections: {
    painTitle: '医院场景常见难点',
    painDescription: '先梳理院外记录与复诊沟通中的信息缺口，不把概念流程写成已上线合作。',
    workflowTitle: '院外健康协同流程',
    workflowDescription: '从授权建档到复诊摘要，流程强调可验证、可撤回和边界清晰。',
    workflowImage: '/images/concepts/clinic-workflow.svg',
    workflowImageAlt: '宠物医院院外健康协同概念视觉',
    modulesTitle: '方案组成',
    modulesDescription: '以院外记录、机构协同和授权规则三个层次组织能力，真实接入方式待项目方确认。',
    boundaryTitle: '边界与待确认项',
    boundaryDescription: '医疗场景必须把诊疗边界、授权机制和合作状态写得足够清楚。',
    ctaTitle: '想评估医院场景的协同方式？',
    ctaDescription: '预约演示，确认当前样机能力、院外记录口径和机构协同边界。',
  },
}

export const storeSolution: SolutionDetail = {
  slug: 'store',
  title: '宠物门店解决方案',
  breadcrumbLabel: '宠物门店',
  headline: '把照护记录与会员服务连接起来',
  summary:
    '知宠宠物门店解决方案面向会员健康服务、提醒触达和照护记录归档场景。当前内容用于服务流程规划展示，合作门店、上线范围和触达规则待项目方确认。',
  status: '服务流程规划中',
  cover: '/images/concepts/app-platform.svg',
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
      description: '疫苗、护理、复购和复访提醒需要明确授权与频率，当前不承诺具体触达效果。',
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
      description: '承接门店会员、护理记录和回访任务，具体功能范围待项目方确认。',
    },
    {
      id: 'member-app',
      icon: 'phone',
      title: '会员 App 协作',
      description: '让主人查看宠物档案、提醒和服务记录，真实账号体系和触达方式待确认。',
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
      title: '授权与触达规则待确认',
      description: '会员通知、数据查看和门店协作需建立清晰授权机制，规则待项目方确认。',
    },
  ],
  confirmationItems: [
    {
      label: '合作门店名单',
      value: '待项目方确认',
      note: '不使用虚构门店或客户 Logo',
    },
    {
      label: '会员服务范围',
      value: '待项目方确认',
      note: '美容、护理、寄养等场景需逐项确认',
    },
    {
      label: '提醒触达方式',
      value: '待项目方确认',
      note: '短信、App、企业微信等入口需真实配置',
    },
    {
      label: '服务上线节奏',
      value: '待项目方确认',
      note: '当前为服务流程规划展示',
    },
  ],
  sections: {
    painTitle: '门店服务常见难点',
    painDescription: '先把会员服务链路中的信息分散、授权触达和记录归档问题讲清楚。',
    workflowTitle: '会员健康服务流程',
    workflowDescription: '从会员档案到服务归档，流程以可确认、可调整和可授权为前提。',
    workflowImage: '/images/concepts/app-platform.svg',
    workflowImageAlt: '宠物门店会员服务连接概念视觉',
    modulesTitle: '方案组成',
    modulesDescription: '以门店服务入口、会员 App 协作和授权归档三个层次组织当前方案。',
    boundaryTitle: '边界与待确认项',
    boundaryDescription: '门店场景不虚构经营结果，也不把服务提醒包装成医疗判断。',
    ctaTitle: '想确认门店服务流程是否匹配？',
    ctaDescription: '预约演示，确认会员场景、触达方式和当前规划边界。',
  },
}

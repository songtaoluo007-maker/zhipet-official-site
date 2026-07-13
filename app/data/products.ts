import type { ProductDetail } from '~/types/product'

export const smartCollarProduct: ProductDetail = {
  slug: 'smart-collar',
  name: '知宠智能挂件',
  headline: '记录声音、动作和安全变化，让陪伴更有依据',
  summary:
    '知宠智能挂件面向家庭日常陪伴和安全提醒场景，记录宠物声音、动作与活动趋势，辅助理解行为变化、位置线索和安全风险，并与知宠 App 和 PetSense 多模态宠物理解引擎协同。',
  status: '智能感知设备',
  cover: '/images/generated/pages/zhipet-product-closeup-scene.webp',
  coverAlt: '知宠智能挂件产品概念视觉',
  values: [
    {
      id: 'sound-capture',
      icon: 'chart',
      title: '宠物声音采集',
      description: '记录叫声节律、持续时长和强弱变化，为后续状态推测提供声音线索。',
    },
    {
      id: 'activity-trend',
      icon: 'collar',
      title: '动作与活动趋势记录',
      description: '围绕活动、休息、移动频率和日常节律形成连续记录，帮助主人观察变化趋势。',
    },
    {
      id: 'posture-safety',
      icon: 'shield-check',
      title: '行为姿态感知与安全提醒',
      description: '结合行为姿态、位置线索与安全提醒，具体表现会受到设备、网络和环境条件影响。',
    },
  ],
  ecosystemTitle: '设备、App 与 AI 引擎协同',
  ecosystemDescription:
    '智能设备负责感知，App 负责呈现和交互，PetSense 引擎负责多模态分析；页面不把设备能力包装成医疗诊断或确定结论。',
  secondaryAction: {
    label: '了解 AI 宠物理解',
    to: '/ai-pet-understanding',
  },
  ecosystem: [
    {
      id: 'device',
      icon: 'collar',
      title: '智能设备',
      description: '智能设备负责记录宠物声音、动作、活动趋势和位置变化，参数以正式产品说明为准。',
    },
    {
      id: 'app',
      icon: 'phone',
      title: '知宠 App',
      description: 'App 负责呈现状态提示、趋势记录、主人反馈和自然语言交互，避免日常信息分散。',
    },
    {
      id: 'petsense',
      icon: 'sparkles',
      title: 'PetSense 引擎',
      description: 'PetSense 负责融合声音、动作、场景和历史数据，推测可能状态并说明依据、不确定性和照护建议。',
    },
  ],
  scenarios: [
    {
      id: 'family',
      icon: 'home',
      title: '家庭养宠',
      description: '帮助家庭观察持续叫唤、独处活动增加、夜间异常活跃等变化，并在 App 中查看可能解释。',
    },
    {
      id: 'safety',
      icon: 'shield-check',
      title: '定位与安全提醒',
      description: '围绕走失风险、活动区域和安全提醒提供辅助线索，实际表现受网络与环境影响。',
    },
    {
      id: 'service',
      icon: 'users',
      title: '服务协同参考',
      description: '在主人授权前提下，为后续医院、门店或专业服务沟通提供连续观察线索。',
    },
  ],
  specifications: [
    {
      label: '产品状态',
      value: '智能感知设备',
      note: '面向家庭陪伴与安全提醒',
    },
    {
      label: '产品命名',
      value: '知宠智能挂件',
      note: '连接设备、App 与健康档案',
    },
    {
      label: '核心能力',
      value: '宠物声音采集 / 动作与活动趋势记录 / 行为姿态感知 / 定位与安全提醒 / 与 App 和 AI 引擎协同',
      note: '具体能力以正式产品说明为准',
    },
    {
      label: '定位与通信',
      value: '依使用与网络环境而异',
      note: '不展示未确认参数',
    },
    {
      label: '供电与续航',
      value: '以正式产品说明为准',
      note: '不展示未确认数据',
    },
    {
      label: '防护能力',
      value: '以正式产品说明为准',
      note: '不声明未确认等级',
    },
  ],
  specificationsCaption: '知宠智能挂件产品信息',
  process: [
    {
      id: 'wear',
      order: '01',
      title: '佩戴或安装设备',
      description: '根据宠物体型、舒适度和产品说明完成佩戴，并持续观察皮肤与活动状态。',
    },
    {
      id: 'bind',
      order: '02',
      title: '绑定知宠 App',
      description: '将设备与知宠 App 绑定，建立宠物档案、提醒偏好和主人反馈入口。',
    },
    {
      id: 'record',
      order: '03',
      title: '记录声音与活动',
      description: '持续记录叫声、动作、活动节律和安全相关变化，作为多模态分析输入。',
    },
    {
      id: 'understand',
      order: '04',
      title: '查看可能状态与建议',
      description: 'App 展示 PetSense 的可能状态、分析依据、不确定性和陪伴建议，帮助主人持续观察。',
    },
  ],
}

export const zhipetAppProduct: ProductDetail = {
  slug: 'app',
  name: '知宠 App',
  headline: '把宠物健康档案装进口袋',
  summary:
    '知宠 App 面向家庭日常照护和机构服务连接场景，规划健康档案、趋势记录、提醒协作与复诊资料整理。当前内容用于体验流程展示，最终功能以项目方确认资料为准。',
  status: '家庭端应用',
  cover: '/images/generated/pages/zhipet-app-profile-scene.webp',
  coverAlt: '知宠 App 体验流程概念视觉',
  values: [
    {
      id: 'profile',
      icon: 'phone',
      title: '健康档案集中管理',
      description: '将宠物基础信息、健康记录和照护备注集中在同一入口，减少分散记录。',
    },
    {
      id: 'trend',
      icon: 'chart',
      title: '趋势记录与回看',
      description: '围绕设备和手动记录沉淀连续趋势，帮助家庭和机构更清楚地回看变化。',
    },
    {
      id: 'collaboration',
      icon: 'users',
      title: '家庭成员协作',
      description: '规划提醒、备注和共享能力，让多人照护时的任务和信息更清晰。',
    },
  ],
  ecosystem: [
    {
      id: 'device',
      icon: 'collar',
      title: '智能挂件',
      description: '作为数据入口之一，连接方式和同步节奏以设备及正式产品说明为准。',
    },
    {
      id: 'app',
      icon: 'phone',
      title: '知宠 App',
      description: '承接档案、趋势、提醒和复诊参考资料，是家庭用户的主要使用入口。',
    },
    {
      id: 'platform',
      icon: 'building',
      title: '健康管理平台',
      description: '在用户授权前提下，为医院、门店或专业服务连接提供沟通入口。',
    },
  ],
  scenarios: [
    {
      id: 'family',
      icon: 'home',
      title: '家庭日常照护',
      description: '记录宠物日常健康变化、提醒事项和家庭成员协作信息。',
    },
    {
      id: 'hospital',
      icon: 'hospital',
      title: '复诊沟通准备',
      description: '整理近期趋势和异常记录，为与专业机构沟通提供连续参考。',
    },
    {
      id: 'store',
      icon: 'store',
      title: '门店服务连接',
      description: '为会员健康服务、提醒触达和照护记录归档预留入口。',
    },
  ],
  specifications: [
    {
      label: '产品状态',
      value: '家庭端应用',
      note: '规划参数，仅供展示',
    },
    {
      label: '适用对象',
      value: '家庭用户、宠物医院和宠物门店',
      note: '按照用户授权范围展示',
    },
    {
      label: '核心能力',
      value: '健康档案 / 趋势记录 / 提醒协作 / 复诊资料整理',
      note: '规划参数，仅供展示',
    },
    {
      label: '上线版本',
      value: '以 App 产品说明为准',
    },
    {
      label: '账号体系',
      value: '由用户自主管理',
    },
    {
      label: '数据授权规则',
      value: '遵循最小必要原则',
    },
  ],
  specificationsCaption: '知宠 App 规划参数，仅供展示',
  process: [
    {
      id: 'create-profile',
      order: '01',
      title: '建立宠物档案',
      description: '录入宠物基础信息、家庭成员和照护偏好，形成统一记录入口。',
    },
    {
      id: 'connect-device',
      order: '02',
      title: '连接设备或手动记录',
      description: '规划接入智能挂件数据，也支持后续补充手动记录能力。',
    },
    {
      id: 'review-trends',
      order: '03',
      title: '查看趋势与提醒',
      description: '集中查看健康变化、提醒事项和异常备注，减少信息遗漏。',
    },
    {
      id: 'share-reference',
      order: '04',
      title: '整理沟通参考',
      description: '将近期趋势和记录整理为复诊或服务沟通线索。',
    },
  ],
}

export const healthPlatformProduct: ProductDetail = {
  slug: 'health-platform',
  name: '健康管理平台',
  headline: '连接设备数据与机构服务流程',
  summary:
    '健康管理平台面向宠物医院、门店与合作机构，探索设备数据接入、服务流程记录和运营辅助能力。当前内容用于场景验证展示，真实部署方式和接口范围以项目方确认为准。',
  status: '专业服务平台',
  cover: '/images/generated/pages/zhipet-hospital-collab-scene.webp',
  coverAlt: '知宠健康管理平台场景验证概念视觉',
  values: [
    {
      id: 'data-access',
      icon: 'chart',
      title: '设备数据接入',
      description: '探索把智能挂件和 App 记录汇总到机构侧，形成更连续的健康服务参考。',
    },
    {
      id: 'service-record',
      icon: 'hospital',
      title: '服务流程记录',
      description: '规划客户档案、复诊沟通和服务备注，让机构服务过程更清晰。',
    },
    {
      id: 'operation',
      icon: 'building',
      title: '运营辅助看板',
      description: '围绕会员服务和提醒触达探索运营辅助，不展示未确认数据或效果承诺。',
    },
  ],
  ecosystem: [
    {
      id: 'device',
      icon: 'collar',
      title: '智能挂件',
      description: '作为设备数据来源之一，接入范围、频率和数据字段遵循最小必要原则。',
    },
    {
      id: 'app',
      icon: 'phone',
      title: '知宠 App',
      description: '承接用户授权、家庭记录和服务触达，并提供清晰的数据管理路径。',
    },
    {
      id: 'platform',
      icon: 'building',
      title: '健康管理平台',
      description: '为医院、门店与合作机构提供记录、协作和运营辅助的场景验证入口。',
    },
  ],
  scenarios: [
    {
      id: 'hospital',
      icon: 'hospital',
      title: '宠物医院',
      description: '探索复诊沟通、院外健康记录和客户服务流程协同。',
    },
    {
      id: 'store',
      icon: 'store',
      title: '宠物门店',
      description: '支持会员健康服务、提醒触达和日常照护记录归档的规划方向。',
    },
    {
      id: 'partner',
      icon: 'users',
      title: '合作机构',
      description: '为合作伙伴的数据授权和服务连接提供结构，范围由用户与服务关系共同决定。',
    },
  ],
  specifications: [
    {
      label: '产品状态',
      value: '专业服务平台',
      note: '规划参数，仅供展示',
    },
    {
      label: '服务对象',
      value: '宠物医院、门店与合作机构',
      note: '按角色和用户授权范围开放',
    },
    {
      label: '核心能力',
      value: '设备数据接入 / 服务流程记录 / 运营辅助看板',
      note: '规划参数，仅供展示',
    },
    {
      label: '部署方式',
      value: '按最小必要范围接入',
    },
    {
      label: '权限体系',
      value: '由用户授权管理',
    },
    {
      label: '接口范围',
      value: '以服务协议为准',
    },
  ],
  specificationsCaption: '健康管理平台规划参数，仅供展示',
  process: [
    {
      id: 'connect',
      order: '01',
      title: '确认接入场景',
      description: '先确认机构类型、服务流程和需要承接的数据范围。',
    },
    {
      id: 'authorize',
      order: '02',
      title: '建立授权与档案',
      description: '围绕用户授权、宠物档案和机构服务记录建立基础结构。',
    },
    {
      id: 'record',
      order: '03',
      title: '记录服务过程',
      description: '沉淀复诊、会员服务和提醒触达过程，减少信息断点。',
    },
    {
      id: 'review',
      order: '04',
      title: '复盘趋势与运营',
      description: '查看健康服务趋势和运营辅助信息，指标范围以授权与服务目标为准。',
    },
  ],
}

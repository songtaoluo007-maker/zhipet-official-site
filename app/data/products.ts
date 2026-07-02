import type { ProductDetail } from '~/types/product'

export const smartCollarProduct: ProductDetail = {
  slug: 'smart-collar',
  name: '知宠智能项圈',
  headline: '24 小时健康守护，让爱更安心',
  summary:
    '知宠智能项圈面向家庭日常佩戴和机构健康管理场景，探索生命体征监测、行为活动分析与异常预警提醒。当前内容用于产品定义与样机展示，最终参数以项目方确认资料为准。',
  status: '样机与产品定义阶段',
  cover: '/images/concepts/smart-collar.svg',
  coverAlt: '知宠智能项圈样机概念视觉',
  values: [
    {
      id: 'vitals',
      icon: 'heart-pulse',
      title: '生命体征监测',
      description: '围绕宠物日常健康变化，探索持续记录和趋势识别能力，帮助用户更早注意异常。',
    },
    {
      id: 'activity',
      icon: 'chart',
      title: '行为活动分析',
      description: '记录活动、休息和行为节律，为家庭照护、复诊沟通和机构服务提供连续参考。',
    },
    {
      id: 'alerts',
      icon: 'shield-check',
      title: '异常预警提醒',
      description: '将设备数据、App 提醒和服务流程连接起来，减少异常信息被遗漏的风险。',
    },
  ],
  ecosystem: [
    {
      id: 'device',
      icon: 'collar',
      title: '智能项圈',
      description: '采集样机阶段定义的健康与活动信号，佩戴舒适性、续航和防护能力待项目方确认。',
    },
    {
      id: 'app',
      icon: 'phone',
      title: '知宠 App',
      description: '承接健康档案、趋势记录、提醒通知和家庭成员协作，避免日常信息分散。',
    },
    {
      id: 'platform',
      icon: 'building',
      title: '健康管理平台',
      description: '面向医院、门店与合作机构，探索设备数据接入、服务记录和运营辅助能力。',
    },
  ],
  scenarios: [
    {
      id: 'family',
      icon: 'home',
      title: '家庭养宠',
      description: '帮助家庭连续记录宠物健康变化，并在异常趋势出现时获得更清晰的提醒。',
    },
    {
      id: 'hospital',
      icon: 'hospital',
      title: '宠物医院',
      description: '为复诊、院外管理和健康档案补充连续数据参考，具体流程待合作机构确认。',
    },
    {
      id: 'store',
      icon: 'store',
      title: '宠物门店',
      description: '将会员健康服务、照护记录和提醒触达结合起来，形成更长期的服务连接。',
    },
  ],
  specifications: [
    {
      label: '产品状态',
      value: '样机与产品定义阶段',
      note: '样机参数，仅供展示',
    },
    {
      label: '适用对象',
      value: '犬、猫等家庭宠物',
      note: '具体适配范围待项目方确认',
    },
    {
      label: '核心能力',
      value: '生命体征监测 / 行为活动分析 / 异常预警提醒',
      note: '样机参数，仅供展示',
    },
    {
      label: '连接方式',
      value: '待项目方确认',
    },
    {
      label: '续航能力',
      value: '待项目方确认',
    },
    {
      label: '防护等级',
      value: '待项目方确认',
    },
  ],
  specificationsCaption: '知宠智能项圈样机参数，仅供展示',
  process: [
    {
      id: 'wear',
      order: '01',
      title: '佩戴设备',
      description: '为宠物佩戴智能项圈，并根据实际体型和舒适度完成基础设置。',
    },
    {
      id: 'bind',
      order: '02',
      title: '绑定 App',
      description: '将设备与知宠 App 绑定，建立宠物健康档案和提醒偏好。',
    },
    {
      id: 'monitor',
      order: '03',
      title: '开始监测',
      description: '记录健康与活动变化，形成更连续的日常照护数据。',
    },
    {
      id: 'review',
      order: '04',
      title: '查看健康趋势',
      description: '通过 App 或机构平台查看趋势、提醒和服务建议，辅助后续照护判断。',
    },
  ],
}

export const zhipetAppProduct: ProductDetail = {
  slug: 'app',
  name: '知宠 App',
  headline: '把宠物健康档案装进口袋',
  summary:
    '知宠 App 面向家庭日常照护和机构服务连接场景，规划健康档案、趋势记录、提醒协作与复诊资料整理。当前内容用于体验流程展示，最终功能以项目方确认资料为准。',
  status: '体验流程规划中',
  cover: '/images/concepts/app-platform.svg',
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
      title: '智能项圈',
      description: '作为数据入口之一，采集能力、连接方式和同步频率待项目方确认。',
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
      description: '为后续医院、门店或合作机构连接预留能力，具体协作流程待确认。',
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
      value: '体验流程规划中',
      note: '规划参数，仅供展示',
    },
    {
      label: '适用对象',
      value: '家庭用户、宠物医院和宠物门店',
      note: '具体开放范围待项目方确认',
    },
    {
      label: '核心能力',
      value: '健康档案 / 趋势记录 / 提醒协作 / 复诊资料整理',
      note: '规划参数，仅供展示',
    },
    {
      label: '上线版本',
      value: '待项目方确认',
    },
    {
      label: '账号体系',
      value: '待项目方确认',
    },
    {
      label: '数据授权规则',
      value: '待项目方确认',
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
      description: '规划接入智能项圈数据，也支持后续补充手动记录能力。',
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
  status: '场景验证阶段',
  cover: '/images/concepts/clinic-workflow.svg',
  coverAlt: '知宠健康管理平台场景验证概念视觉',
  values: [
    {
      id: 'data-access',
      icon: 'chart',
      title: '设备数据接入',
      description: '探索把智能项圈和 App 记录汇总到机构侧，形成更连续的健康服务参考。',
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
      title: '智能项圈',
      description: '作为设备数据来源之一，接入范围、频率和数据字段待项目方确认。',
    },
    {
      id: 'app',
      icon: 'phone',
      title: '知宠 App',
      description: '承接用户授权、家庭记录和服务触达，具体授权流程待确认。',
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
      description: '为后续合作伙伴的数据授权和服务连接预留结构，具体范围待确认。',
    },
  ],
  specifications: [
    {
      label: '产品状态',
      value: '场景验证阶段',
      note: '规划参数，仅供展示',
    },
    {
      label: '服务对象',
      value: '宠物医院、门店与合作机构',
      note: '具体开放范围待项目方确认',
    },
    {
      label: '核心能力',
      value: '设备数据接入 / 服务流程记录 / 运营辅助看板',
      note: '规划参数，仅供展示',
    },
    {
      label: '部署方式',
      value: '待项目方确认',
    },
    {
      label: '权限体系',
      value: '待项目方确认',
    },
    {
      label: '接口范围',
      value: '待项目方确认',
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
      description: '查看健康服务趋势和运营辅助信息，具体指标待项目方确认。',
    },
  ],
}
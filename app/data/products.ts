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

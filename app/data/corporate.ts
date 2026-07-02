import type { IconName } from '~/types/ui'

export interface CorporatePrinciple {
  id: string
  icon: IconName
  title: string
  description: string
}

export interface PartnerScenario {
  id: string
  icon: IconName
  audience: string
  title: string
  summary: string
  needs: string[]
}

export interface CaseStudy {
  id: string
  label: string
  title: string
  scenario: string
  summary: string
  checkpoints: string[]
}

export interface NewsItem {
  id: string
  category: string
  title: string
  date: string
  summary: string
}

export interface LegalDocument {
  slug: 'privacy' | 'terms'
  title: string
  status: string
  sections: Array<{
    title: string
    body: string
  }>
}

export const aboutPrinciples: CorporatePrinciple[] = [
  {
    id: 'health-first',
    icon: 'heart-pulse',
    title: '以宠物健康为核心',
    description: '围绕日常记录、异常提醒和专业服务连接建设产品，不把概念能力写成医疗结论。',
  },
  {
    id: 'clear-boundary',
    icon: 'shield-check',
    title: '把边界写清楚',
    description: '团队、资质、公司信息和服务范围均以项目方确认为准，缺失资料保持待确认状态。',
  },
  {
    id: 'connected-service',
    icon: 'building',
    title: '连接家庭与机构',
    description: '面向家庭、医院、门店和合作机构，逐步验证设备、App 与服务流程的协同方式。',
  },
]

export const partnerScenarios: PartnerScenario[] = [
  {
    id: 'clinic',
    icon: 'hospital',
    audience: '宠物医院',
    title: '院外健康记录协同',
    summary: '探索复诊沟通、院外观察和授权数据查看流程，合作机构名单待项目方确认。',
    needs: ['复诊摘要', '院外观察', '授权查看'],
  },
  {
    id: 'store',
    icon: 'store',
    audience: '宠物门店',
    title: '会员健康服务连接',
    summary: '围绕会员宠物档案、服务提醒和照护记录归档建立长期服务线索。',
    needs: ['会员档案', '提醒触达', '服务归档'],
  },
  {
    id: 'ecosystem',
    icon: 'building',
    audience: '合作机构',
    title: '宠物健康生态合作',
    summary: '为后续保险、公益、研究或服务机构预留协作入口，具体合作方向待项目方确认。',
    needs: ['场景共创', '数据边界', '服务试点'],
  },
]

export const caseStudies: CaseStudy[] = [
  {
    id: 'clinic-proof',
    label: '概念验证项目',
    title: '宠物医院健康档案协同示范',
    scenario: '宠物医院场景',
    summary: '用于展示设备数据、复诊记录与院外提醒如何协同，不代表真实客户案例。',
    checkpoints: ['流程标准化', '数据连续化', '授权边界清晰化'],
  },
  {
    id: 'store-proof',
    label: '示范案例',
    title: '门店会员健康服务示范',
    scenario: '宠物门店场景',
    summary: '用于展示门店如何围绕健康提醒与服务记录建立长期关系，待真实授权后替换。',
    checkpoints: ['会员服务数字化', '照护记录归档', '触达规则待确认'],
  },
]

export const newsItems: NewsItem[] = [
  {
    id: 'product-direction',
    category: '产品动态',
    title: '知宠产品方向规划',
    date: '发布日期待项目方确认',
    summary: '围绕智能挂件、知宠 App 和健康管理平台梳理第一阶段产品定义，具体发布时间待项目方确认。',
  },
  {
    id: 'scenario-research',
    category: '场景研究',
    title: '家庭、医院与门店场景观察',
    date: '发布日期待项目方确认',
    summary: '整理宠物健康记录、复诊沟通和会员服务链路中的信息缺口，真实调研资料待项目方确认。',
  },
  {
    id: 'brand-progress',
    category: '品牌进展',
    title: '知宠官网内容建设说明',
    date: '发布日期待项目方确认',
    summary: '当前官网以概念展示和需求验证为主，团队、资质、联系方式和备案信息待项目方确认后更新。',
  },
]

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'privacy',
    title: '隐私政策',
    status: '法务与项目方确认后生效',
    sections: [
      {
        title: '占位说明',
        body: '当前页面为官网占位说明，不构成正式隐私政策。正式文本需由项目方、法务和实际服务流程共同确认。',
      },
      {
        title: '数据处理范围',
        body: '宠物档案、设备数据、联系表单和演示预约等处理范围待项目方确认，页面不展示未确认的数据规则。',
      },
      {
        title: '用户权利',
        body: '访问、更正、删除、撤回授权和投诉渠道需结合正式产品与服务流程确认后发布。',
      },
    ],
  },
  {
    slug: 'terms',
    title: '服务条款',
    status: '法务与项目方确认后生效',
    sections: [
      {
        title: '占位说明',
        body: '当前页面为官网占位说明，不构成正式服务协议。正式条款需在产品、服务范围和主体信息确认后发布。',
      },
      {
        title: '服务边界',
        body: '知宠展示的健康记录、提醒和协同能力不替代专业诊疗，具体服务范围以正式条款为准。',
      },
      {
        title: '联系方式',
        body: '客服、投诉、商务和法务联系入口待项目方确认后补充。',
      },
    ],
  },
]

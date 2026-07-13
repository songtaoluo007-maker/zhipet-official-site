import type { IconName } from '~/types/ui'
import { dataGovernance } from '~~/shared/constants/data-governance'
import { projectContact } from '~~/shared/constants/project-contact'

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

export interface ResearchItem {
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
    description: '以清晰、克制的方式说明能力依据、不确定性与专业判断边界。',
  },
  {
    id: 'connected-service',
    icon: 'building',
    title: '连接家庭与机构',
    description: '面向家庭、医院、门店和合作机构，连接设备、App 与专业服务流程。',
  },
]

export const partnerScenarios: PartnerScenario[] = [
  {
    id: 'clinic',
    icon: 'hospital',
    audience: '宠物医院',
    title: '院外健康记录协同',
    summary: '围绕复诊沟通、院外观察和授权数据查看，帮助专业服务获得更连续的背景信息。',
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
    summary: '围绕保险、公益、研究与服务场景，建立清晰授权和最小必要的数据协作边界。',
    needs: ['场景共创', '数据边界', '服务试点'],
  },
]

export const caseStudies: CaseStudy[] = [
  {
    id: 'clinic-proof',
    label: '场景示意',
    title: '宠物医院健康档案协同',
    scenario: '宠物医院场景',
    summary: '说明设备数据、复诊记录与院外提醒如何在用户授权下形成连续沟通线索。',
    checkpoints: ['流程标准化', '数据连续化', '授权边界清晰化'],
  },
  {
    id: 'store-proof',
    label: '场景示意',
    title: '门店会员健康服务连接',
    scenario: '宠物门店场景',
    summary: '说明门店如何围绕健康提醒与服务记录，为会员家庭提供更连贯的照护体验。',
    checkpoints: ['会员服务连接', '照护记录归档', '用户授权触达'],
  },
]

export const researchItems: ResearchItem[] = [
  {
    id: 'health-signals',
    category: '健康洞察',
    title: '宠物不会说话，但健康会留下痕迹',
    date: '知宠研究院',
    summary: '围绕活动、休息、叫声和照护记录解释连续观察的价值。',
  },
  {
    id: 'ai-state-boundary',
    category: 'AI 与技术',
    title: 'AI 状态解释不是“翻译”',
    date: '知宠研究院',
    summary: '说明 AI 状态解释需要依据和不确定性，不描述成宠物语言逐字翻译。',
  },
  {
    id: 'responsible-data',
    category: '数据与隐私',
    title: '如何负责地使用宠物健康数据',
    date: '知宠研究院',
    summary: '讨论最小必要、清晰授权与用户自主控制的数据使用原则。',
  },
]

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'privacy',
    title: '隐私说明',
    status: `更新于 ${dataGovernance.updatedLabel}`,
    sections: [
      {
        title: '维护团队与联络方式',
        body: `本官网由知宠团队维护，隐私相关事项可通过 ${projectContact.email} 联系我们。`,
      },
      {
        title: '处理目的与信息范围',
        body: '官网在线反馈可能处理反馈分类、反馈正文、用户自愿填写的邮箱或手机号，以及隐私说明确认时间和来源页面，用于识别、核实与回复意见或问题。通过公开邮箱联系我们时，邮件内容和发件地址由邮箱服务处理。官网不提供用户注册或登录，也不采集宠物档案。',
      },
      {
        title: '保存期限与到期处理',
        body: `在线反馈自提交之日起最多保存 ${dataGovernance.retentionDays.feedback} 天。待发送反馈邮件所需的收件地址和正文最多保存 ${dataGovernance.retentionDays.emailOutbox} 天；成功发送后立即清除收件地址和正文，仅保留不含反馈内容的投递状态最多 ${dataGovernance.retentionDays.deliveredEmailAudit} 天。到期记录由数据库清理任务删除。直接发送到公开邮箱的邮件保存期限以邮箱中的实际处理情况为准，可通过公开邮箱提出删除请求。`,
      },
      {
        title: '处理方式与安全措施',
        body: '在线反馈通过 Nuxt Server API 提交并存入 PostgreSQL 数据库，同时排入邮件队列。启用系统邮件后，反馈分类、正文和用户自愿填写的联系方式会通过配置的 SMTP 邮箱服务发送给知宠团队，以便人工处理。官网不接入广告画像、第三方行为追踪或网站账号系统；服务商或处理方式变化时，我们会同步更新本说明。',
      },
      {
        title: '个人权利与响应流程',
        body: `如需查阅、复制、更正、删除反馈信息或撤回同意，请以“个人信息权利请求”为邮件主题发送至 ${projectContact.email}，并提供反馈编号或足以核验提交关系的信息。知宠团队一般在 ${dataGovernance.rightsResponseBusinessDays} 个工作日内完成处理或说明情况。`,
      },
    ],
  },
  {
    slug: 'terms',
    title: '使用条款',
    status: `更新于 ${dataGovernance.updatedLabel}`,
    sections: [
      {
        title: '服务范围',
        body: '知宠官网用于介绍品牌理念、产品方向、解决方案与健康科普内容，并提供公开邮箱和意见问题反馈入口。',
      },
      {
        title: '使用边界',
        body: '健康记录、趋势提示和状态解读仅用于辅助观察，不替代执业兽医的诊断与治疗建议。页面中的功能描述应以正式产品说明为准。',
      },
      {
        title: '官网服务范围',
        body: '官网不提供用户注册、账号登录或在线交易。知宠 App 与其他独立服务如涉及账号、数据处理或付费规则，将通过对应产品协议另行说明。',
      },
      {
        title: '联系与规则更新',
        body: `本官网由知宠团队维护，联系邮箱为 ${projectContact.email}。服务范围、数据处理或使用规则发生变化时，我们会更新相应页面并标注更新时间。`,
      },
    ],
  },
]

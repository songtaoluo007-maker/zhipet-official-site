import type { AiPetUnderstandingPageData } from '~/types/ai-pet-understanding'

export const aiPetUnderstandingPage: AiPetUnderstandingPageData = {
  hero: {
    title: '用 AI，更好地理解宠物',
    description:
      '知宠融合叫声、动作、活动、场景与长期个体数据，分析宠物可能的情绪、需求和异常状态，让每一次陪伴更有依据。',
    note: '知宠提供概率分析和风险提示，不对宠物语言进行逐字翻译，也不替代专业兽医诊断。',
    primaryAction: {
      label: '了解分析原理',
      href: '#principles',
    },
    secondaryAction: {
      label: '查看应用场景',
      href: '#scenarios',
    },
    image: {
      src: '/images/concepts/family-solution.svg',
      alt: '知宠 AI 宠物理解场景概念视觉',
    },
    visualLabels: ['短促叫声', '门口徘徊', '可能焦虑', '持续观察'],
  },
  expression: {
    title: '宠物如何表达自己',
    description:
      '宠物不会只通过一种信号表达状态。叫声、姿态、活动节律、当前环境和个体历史需要放在一起理解，才能减少误判。',
    image: {
      src: '/images/concepts/hero-care-scene.svg',
      alt: '宠物声音、动作与场景信息融合的概念视觉',
    },
    dimensions: [
      { label: '叫声特征', description: '识别叫声节奏、长短、强弱和连续性变化。' },
      { label: '身体姿态', description: '结合移动方向、停留区域和姿态变化推测行为含义。' },
      { label: '活动节律', description: '对比日常活动、休息、进食和独处时段的变化。' },
      { label: '当前场景', description: '把门口、夜间、主人离家等环境线索纳入分析。' },
      { label: '个体历史', description: '参考每只宠物过去的叫声、习惯和主人反馈。' },
    ],
  },
  process: [
    {
      id: 'capture',
      icon: 'collar',
      title: '声音与动作采集',
      description: '通过智能挂件 / 感知设备和 App 记录声音、活动与场景线索。',
    },
    {
      id: 'features',
      icon: 'chart',
      title: '特征识别',
      description: '提取叫声节奏、运动变化、停留位置和行为片段等关键特征。',
    },
    {
      id: 'context',
      icon: 'home',
      title: '场景和历史融合',
      description: '结合当前环境、主人状态和每只宠物的长期个体画像。',
    },
    {
      id: 'inference',
      icon: 'sparkles',
      title: '情绪、需求和异常推测',
      description: '以概率方式生成当前可能状态、风险等级和其他可能解释。',
    },
    {
      id: 'guidance',
      icon: 'shield-check',
      title: '生成给主人可理解的建议',
      description: '展示分析依据、置信度、不确定性和照护建议，而不是直接下结论。',
    },
  ],
  capabilities: [
    {
      id: 'emotion',
      icon: 'heart-pulse',
      title: '情绪状态理解',
      description: '推测宠物可能处于放松、焦虑、兴奋、寻求关注等状态。',
    },
    {
      id: 'intent',
      icon: 'sparkles',
      title: '行为意图推测',
      description: '结合场景判断宠物可能是在期待互动、请求外出或表达不适。',
    },
    {
      id: 'change',
      icon: 'chart',
      title: '异常变化识别',
      description: '识别与日常节律不同的叫声、活动和停留模式，并提示风险。',
    },
    {
      id: 'learning',
      icon: 'users',
      title: '个体化长期学习',
      description: '通过长期数据和主人反馈逐步形成每只宠物的个体理解。',
    },
  ],
  analysisExample: {
    label: '界面与分析逻辑示例',
    title: '一次“持续叫唤”的分析结果',
    possibleState: '宠物当前可能处于焦虑或寻求关注状态。',
    confidenceLabel: '置信度：中等偏高',
    riskLevel: '风险等级：中低风险，建议持续观察',
    basis: [
      '出现连续短促叫声',
      '在门口区域反复移动',
      '主人离开后活动明显增加',
      '与过去独处时的行为模式相似',
    ],
    alternatives: ['环境中出现陌生声音', '期待外出活动'],
    recommendation:
      '先进行远程安抚并持续观察；若异常行为长时间持续，应咨询专业人员。',
    uncertainty: '当前分析基于可获得的声音、活动和场景数据；若环境噪声较强或设备佩戴状态异常，结果可能不完整。',
    medicalBoundary: '该结果不替代专业兽医诊断，高风险症状或持续异常应及时联系兽医。',
  },
  profile: {
    title: '越用越懂每一只宠物',
    description:
      'PetSense 会在用户授权范围内学习每只宠物的长期特征。它关注的是个体差异，而不是把所有宠物套进同一个固定标签。',
    image: {
      src: '/images/concepts/app-platform.svg',
      alt: '知宠 App 记录宠物个体画像的概念视觉',
    },
    attributes: ['品种和年龄', '日常作息', '常见叫声', '行为习惯', '主人反馈', '个体异常阈值'],
  },
  scenarios: [
    {
      id: 'calling',
      title: '宠物持续叫唤',
      description:
        '知宠会结合叫声节奏、发生时间、活动位置和历史模式，提示可能原因与观察建议，而不是直接翻译成一句话。',
    },
    {
      id: 'away',
      title: '主人不在家',
      description:
        '当宠物独处时活动突然增加，系统会提示可能的焦虑、期待互动或环境刺激，并展示分析依据。',
    },
    {
      id: 'change',
      title: '日常行为突然改变',
      description:
        '当叫声、睡眠、移动或停留习惯偏离个体基线，知宠会给出趋势和风险提示，建议主人持续观察。',
    },
  ],
  boundaries: [
    {
      title: '不是宠物语言逐字翻译',
      description: '知宠展示的是多模态概率分析，不把宠物叫声包装成逐字翻译或人宠无障碍对话。',
    },
    {
      title: '不是兽医诊断',
      description: 'AI 结果只用于日常照护参考，不替代专业兽医诊断、治疗或急救判断。',
    },
    {
      title: '数据不足时可能无法判断',
      description: '当声音、动作、场景或历史数据不足时，系统应明确提示不确定性。',
    },
    {
      title: '噪声和设备状态会影响结果',
      description: '家庭环境音、佩戴位置、设备电量和连接状态都可能影响分析质量。',
    },
    {
      title: '高风险症状需要立即联系兽医',
      description: '若出现持续异常、疼痛表现、呼吸困难、抽搐等高风险情况，应立即联系专业兽医。',
    },
    {
      title: '用户可控制数据采集与删除',
      description: '原始音频、家庭环境音频和宠物数据均应视为敏感数据，用户应可管理采集和删除。',
    },
  ],
  cta: {
    title: '让科技帮助我们更懂它们',
    description: '体验知宠产品，了解智能挂件、App 和 PetSense 引擎如何协同工作。',
    action: {
      label: '体验知宠产品',
      href: '/products',
    },
  },
}

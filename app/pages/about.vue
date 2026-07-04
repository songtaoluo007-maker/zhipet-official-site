<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { aboutPrinciples } from '~/data/corporate'
import { homeTimeline } from '~/data/home'
import type { IconName } from '~/types/ui'

const { register } = useScrollReveal()

const transparencyItems: Array<{
  id: string
  icon: IconName
  title: string
  description: string
}> = [
  {
    id: 'truthful-profile',
    icon: 'shield-check',
    title: '真实资料优先',
    description: '公司主体、团队、地址、电话、资质和客户案例确认前不生成替代内容。',
  },
  {
    id: 'ai-boundary',
    icon: 'sparkles',
    title: 'AI 判断有边界',
    description: '宠物状态提示使用可能、推测和趋势表达，不写成逐字翻译或诊疗结论。',
  },
  {
    id: 'sensitive-data',
    icon: 'heart-pulse',
    title: '敏感数据谨慎处理',
    description: '原始音频、家庭环境音频和宠物数据均按敏感信息看待，规则待确认后发布。',
  },
]

const confirmationItems = [
  { label: '公司主体信息', value: '待项目方确认' },
  { label: '团队成员资料', value: '待项目方确认' },
  { label: '资质与荣誉证明', value: '待项目方确认' },
  { label: '办公地址与联系方式', value: '待项目方确认' },
]

useSeoMeta({
  title: '关于知宠 | 知宠 ZHIPET',
  description:
    '了解知宠 ZHIPET 的项目愿景、产品方向和当前资料状态。团队、资质、公司主体与联系方式待项目方确认。',
  ogTitle: '关于知宠 | 知宠 ZHIPET',
  ogDescription: '展示知宠当前品牌方向与待确认资料边界。',
  ogType: 'website',
})
</script>

<template>
  <div class="about-page">
    <section class="about-hero" aria-labelledby="about-title">
      <BaseContainer class="about-hero__inner" width="wide">
        <div class="about-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>关于我们</span>
          </nav>
          <BaseTag tone="concept">品牌资料建设中</BaseTag>
          <h1 id="about-title">关于知宠</h1>
          <p>
            知宠 ZHIPET
            正在围绕宠物健康记录、智能设备、App 协作和行业服务连接建设第一阶段官网内容。当前页面展示品牌方向和项目边界，真实公司、团队与资质信息待项目方确认后更新。
          </p>
          <div class="about-hero__actions">
            <BaseButton to="/demo" size="lg">
              预约演示
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="/contact" variant="text" size="lg">联系项目方</BaseButton>
          </div>
        </div>
        <div class="about-hero__visual">
          <BaseImage
            src="/images/concepts/team-lab.svg"
            alt="知宠团队与宠物健康技术探索概念视觉"
            aspect-ratio="3 / 2"
            radius="lg"
            priority
            concept
            label-placement="below"
          />
          <div class="about-hero__status">
            <span>资料状态</span>
            <strong>品牌方向已整理，正式信息待确认</strong>
            <p>确认前只使用待项目方确认标记，不虚构证明材料。</p>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="about-section transparency-section"
      width="wide"
      aria-labelledby="transparency-title"
    >
      <SectionHeading
        id="transparency-title"
        title="官网内容怎么更新"
        description="先公开可确认的边界，再逐步补齐真实资料，避免把概念内容写成事实证明。"
      />
      <div class="transparency-list">
        <article v-for="item in transparencyItems" :key="item.id" class="transparency-item">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>
    </BaseContainer>

    <BaseContainer
      :ref="register"
      tag="section"
      class="about-section"
      width="wide"
      aria-labelledby="principles-title"
    >
      <SectionHeading
        id="principles-title"
        title="我们坚持的方向"
        description="先把知宠正在做什么、不会越界承诺什么讲清楚，再逐步补充真实资料。"
      />
      <div class="principle-grid">
        <article v-for="item in aboutPrinciples" :key="item.id" class="principle-card">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="about-section status-section"
      aria-labelledby="status-title"
    >
      <BaseContainer width="wide">
        <div class="status-layout">
          <div>
            <SectionHeading
              id="status-title"
              title="团队与资质信息"
              description="团队成员、企业资质、办公地址和备案信息均需要真实资料支撑，当前不使用生成内容冒充证明。"
            />
            <div class="confirmation-panel">
              <div v-for="item in confirmationItems" :key="item.label" class="confirmation-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </div>
          <ol class="timeline-list" aria-label="知宠项目阶段">
            <li v-for="item in homeTimeline" :key="item.date + item.title">
              <span>{{ item.date }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </li>
          </ol>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="想进一步了解知宠当前阶段？"
      description="预约演示，确认产品规划、合作方式和可公开展示的真实资料清单。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.about-page {
  overflow: hidden;
}

.about-hero {
  padding-block: var(--space-8) var(--space-7);
}

.about-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.78fr);
  gap: var(--space-8);
  align-items: center;
}

.about-hero__copy {
  display: grid;
  gap: var(--space-4);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 650;
}

.breadcrumb a {
  color: var(--color-text-secondary);
}

.breadcrumb a:hover {
  color: var(--color-accent-600);
}

.about-hero h1 {
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.about-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
}

.about-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.about-hero__visual {
  position: relative;
  min-width: 0;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 86%), rgb(246 241 233 / 72%)),
    var(--color-surface-soft);
}

.about-hero__visual::before {
  position: absolute;
  inset: -18px 24px 24px -18px;
  z-index: -1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

.about-hero__visual :deep(.base-image__frame) {
  box-shadow: 0 24px 64px rgb(47 36 27 / 10%);
}

.about-hero__status {
  position: absolute;
  right: var(--space-7);
  bottom: var(--space-8);
  display: grid;
  max-width: 280px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 88%);
}

.about-hero__status span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.about-hero__status strong {
  color: var(--color-brand-900);
  font-size: 18px;
  line-height: 1.35;
}

.about-hero__status p {
  font-size: 13px;
}

.about-section {
  @include section-spacing;
}

.transparency-section {
  padding-top: var(--space-6);
}

.transparency-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-block: 1px solid var(--color-border);
}

.transparency-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-5);
  border-right: 1px solid var(--color-border);
}

.transparency-item:last-child {
  border-right: 0;
}

.transparency-item h2 {
  margin-bottom: var(--space-2);
  font-size: 20px;
}

.transparency-item p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.principle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.principle-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.principle-card h2 {
  font-size: 22px;
}

.principle-card p,
.timeline-list p {
  color: var(--color-text-secondary);
}

.icon-shell {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  color: var(--color-accent-600);
  background: var(--color-accent-100);
  font-size: 22px;
}

.status-section {
  background: var(--color-surface-soft);
}

.status-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(360px, 0.68fr);
  gap: var(--space-7);
  align-items: start;
}

.confirmation-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.confirmation-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.45fr) minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
}

.confirmation-row:first-child {
  border-top: 0;
}

.confirmation-row span {
  color: var(--color-brand-900);
  font-weight: 750;
}

.confirmation-row strong {
  color: var(--color-accent-600);
}

.timeline-list {
  display: grid;
  gap: var(--space-4);
  padding: 0;
  margin: 0;
  list-style: none;
}

.timeline-list li {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.timeline-list span {
  color: var(--color-accent-600);
  font-size: 14px;
  font-weight: 800;
}

.timeline-list h3 {
  margin-bottom: var(--space-1);
  font-size: 18px;
}

@media (max-width: 1000px) {
  .about-hero__inner,
  .status-layout {
    grid-template-columns: 1fr;
  }

  .about-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 760px) {
  .principle-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .about-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .about-hero h1 {
    font-size: 36px;
  }

  .about-hero p {
    font-size: 15px;
  }

  .about-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .about-hero__visual {
    padding: var(--space-4);
  }

  .about-hero__visual::before {
    inset: -12px 16px 16px -12px;
  }

  .about-hero__status {
    position: static;
    max-width: none;
    margin-top: var(--space-3);
  }

  .confirmation-row,
  .timeline-list li {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}

@media (max-width: 760px) {
  .transparency-list {
    grid-template-columns: 1fr;
  }

  .transparency-item {
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }

  .transparency-item:last-child {
    border-bottom: 0;
  }
}
</style>

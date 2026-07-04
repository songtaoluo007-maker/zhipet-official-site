<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { partnerScenarios } from '~/data/corporate'

const { register } = useScrollReveal()

const processSteps = [
  {
    order: '01',
    title: '确认合作场景',
    description: '明确医院、门店或生态机构的使用边界，不提前展示未确认合作名单。',
  },
  {
    order: '02',
    title: '梳理数据与授权',
    description: '确认宠物档案、设备记录和服务流程中可查看、可撤回、可留痕的范围。',
  },
  {
    order: '03',
    title: '规划试点流程',
    description: '围绕真实业务流程设计小范围验证，试点结果确认后再进入官网案例口径。',
  },
]

const confirmationItems = [
  { label: '合作机构名单', value: '待项目方确认' },
  { label: '客户 Logo 授权', value: '待项目方确认' },
  { label: '合作城市与范围', value: '待项目方确认' },
  { label: '商务联系方式', value: '待项目方确认' },
]

useSeoMeta({
  title: '合作伙伴 | 知宠 ZHIPET',
  description:
    '知宠 ZHIPET 合作伙伴页面，展示宠物医院、宠物门店与合作机构的合作场景规划。合作名单和 Logo 授权待项目方确认。',
  ogTitle: '合作伙伴 | 知宠 ZHIPET',
  ogDescription: '展示知宠当前合作场景方向，不编造合作机构与客户 Logo。',
  ogType: 'website',
})
</script>

<template>
  <div class="partners-page">
    <section class="partners-hero" aria-labelledby="partners-title">
      <BaseContainer class="partners-hero__inner" width="wide">
        <div class="partners-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>合作伙伴</span>
          </nav>
          <BaseTag tone="concept">合作资料待确认</BaseTag>
          <h1 id="partners-title">合作伙伴</h1>
          <p>
            知宠面向宠物医院、宠物门店与宠物健康生态机构探索合作路径。当前页面只展示合作方向，不生成虚构客户、Logo、城市覆盖或落地成果。
          </p>
          <div class="partners-hero__actions">
            <BaseButton to="/contact" size="lg">
              联系合作
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="/cases" variant="secondary" size="lg">查看示范案例</BaseButton>
          </div>
        </div>
        <div class="partners-hero__visual">
          <BaseImage
            src="/images/concepts/clinic-workflow.svg"
            alt="知宠宠物医院与门店合作流程概念视觉"
            aspect-ratio="16 / 10"
            radius="lg"
            priority
            concept
            label-placement="below"
          />
          <div class="partners-hero__status" aria-label="合作资料公开状态">
            <span>公开边界</span>
            <strong>合作名单与授权资料待确认</strong>
            <p>确认前不展示客户 Logo、合作城市或落地成果。</p>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="partners-section"
      width="wide"
      aria-labelledby="scenario-title"
    >
      <SectionHeading
        id="scenario-title"
        title="适合合作的场景"
        description="围绕可验证的健康记录、服务连接与授权机制建立合作入口。"
      />
      <div class="scenario-grid">
        <article v-for="item in partnerScenarios" :key="item.id" class="scenario-card">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <BaseTag>{{ item.audience }}</BaseTag>
          <h2>{{ item.title }}</h2>
          <p>{{ item.summary }}</p>
          <ul>
            <li v-for="need in item.needs" :key="need">{{ need }}</li>
          </ul>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="partners-section process-section"
      aria-labelledby="process-title"
    >
      <BaseContainer width="wide">
        <div class="process-layout">
          <div>
            <SectionHeading
              id="process-title"
              title="合作推进方式"
              description="先确认真实业务流程，再决定是否进入案例、客户 Logo 或联合发布口径。"
            />
            <ol class="process-list">
              <li v-for="step in processSteps" :key="step.order">
                <span>{{ step.order }}</span>
                <div>
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.description }}</p>
                </div>
              </li>
            </ol>
          </div>
          <aside class="confirmation-panel" aria-labelledby="confirmation-title">
            <h2 id="confirmation-title">合作资料状态</h2>
            <div v-for="item in confirmationItems" :key="item.label" class="confirmation-row">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </aside>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="有真实合作场景需要评估？"
      description="联系知宠，确认当前产品规划、合作流程和可公开资料边界。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.partners-page {
  overflow: hidden;
}

.partners-hero {
  padding-block: var(--space-8) var(--space-7);
}

.partners-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.82fr);
  gap: var(--space-8);
  align-items: center;
}

.partners-hero__copy {
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

.partners-hero h1 {
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.partners-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.partners-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.partners-hero__visual {
  position: relative;
  overflow: hidden;
  min-width: 0;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 86%), rgb(246 241 233 / 72%)),
    var(--color-surface-soft);
}

.partners-hero__visual::before {
  position: absolute;
  inset: -18px 24px 24px -18px;
  z-index: -1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

.partners-hero__visual::after {
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(232 200 148 / 72%), transparent);
  content: '';
}

.partners-hero__visual :deep(.base-image__frame) {
  box-shadow: 0 22px 56px rgb(47 36 27 / 8%);
}

.partners-hero__status {
  position: absolute;
  right: var(--space-7);
  bottom: var(--space-8);
  display: grid;
  max-width: 300px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(10px);
}

.partners-hero__status span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.partners-hero__status strong {
  color: var(--color-brand-900);
  font-size: 18px;
  line-height: 1.35;
}

.partners-hero__status p {
  font-size: 13px;
}

.partners-section {
  @include section-spacing;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.scenario-card {
  @include subtle-lift(-1px);

  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.scenario-card h2 {
  font-size: 22px;
}

.scenario-card p,
.process-list p {
  color: var(--color-text-secondary);
}

.scenario-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.scenario-card li {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface-soft);
  color: var(--color-brand-900);
  font-size: 13px;
  font-weight: 650;
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

.process-section {
  background: var(--color-surface-soft);
}

.process-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(340px, 0.58fr);
  gap: var(--space-7);
  align-items: start;
}

.process-list {
  display: grid;
  gap: var(--space-4);
  padding: 0;
  margin: 0;
  list-style: none;
}

.process-list li {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: var(--space-4);
  padding-block: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.process-list li:hover {
  border-color: rgb(200 138 56 / 42%);
  transform: translateX(4px);
}

.process-list li:first-child {
  padding-top: 0;
}

.process-list span {
  color: var(--color-accent-600);
  font-size: 15px;
  font-weight: 800;
}

.confirmation-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.confirmation-panel h2 {
  padding: var(--space-5);
  font-size: 22px;
}

.confirmation-row {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
}

.confirmation-row span {
  color: var(--color-brand-900);
  font-weight: 750;
}

.confirmation-row strong {
  color: var(--color-accent-600);
}

@media (max-width: 1000px) {
  .partners-hero__inner,
  .process-layout {
    grid-template-columns: 1fr;
  }

  .partners-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 820px) {
  .scenario-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .partners-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .partners-hero h1 {
    font-size: 36px;
  }

  .partners-hero p {
    font-size: 15px;
  }

  .partners-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .partners-hero__visual {
    margin-inline: auto;
    padding: var(--space-4);
  }

  .partners-hero__visual::before {
    inset: -12px 16px 16px -12px;
  }

  .partners-hero__status {
    position: static;
    max-width: none;
    margin-top: var(--space-3);
  }

  .process-list li {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .process-list li:hover {
    transform: none;
  }
}
</style>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { familySolution as solution } from '~/data/solutions'

const { register } = useScrollReveal()

useSeoMeta({
  title: `${solution.title} | 知宠 ZHIPET`,
  description: `${solution.title}${solution.headline}，连接智能项圈、知宠 App 与家庭健康记录。当前服务范围以项目方确认为准。`,
  ogTitle: `${solution.title} | 知宠 ZHIPET`,
  ogDescription: solution.summary,
  ogType: 'website',
})
</script>

<template>
  <div class="family-solution-page">
    <section class="family-hero" aria-labelledby="family-solution-title">
      <BaseContainer class="family-hero__inner" width="wide">
        <div class="family-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <NuxtLink to="/solutions">解决方案</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>家庭养宠</span>
          </nav>
          <BaseTag tone="concept">{{ solution.status }}</BaseTag>
          <h1 id="family-solution-title">{{ solution.title }}</h1>
          <p class="family-hero__headline">{{ solution.headline }}</p>
          <p class="family-hero__summary">{{ solution.summary }}</p>
          <div class="family-hero__actions" aria-label="家庭方案主要操作">
            <BaseButton to="/demo" size="lg">
              预约方案演示
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="#workflow" variant="secondary" size="lg">查看流程</BaseButton>
          </div>
          <div class="family-hero__tags" aria-label="家庭方案模块">
            <BaseTag v-for="module in solution.modules" :key="module.id">{{ module.title }}</BaseTag>
          </div>
        </div>
        <div class="family-hero__visual">
          <BaseImage
            :src="solution.cover"
            :alt="solution.coverAlt"
            aspect-ratio="16 / 10"
            radius="lg"
            priority
            concept
          />
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="pain-points"
      :ref="register"
      tag="section"
      class="family-section pain-section"
      width="wide"
      aria-labelledby="pain-points-title"
    >
      <SectionHeading
        id="pain-points-title"
        title="家庭养宠常见难点"
        description="方案先解决日常信息缺口，不做未验证诊疗承诺，也不展示虚构用户数据。"
      />
      <div class="pain-grid">
        <article v-for="item in solution.painPoints" :key="item.id" class="pain-card">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <section
      id="workflow"
      :ref="register"
      class="family-section workflow-section"
      aria-labelledby="workflow-title"
    >
      <BaseContainer width="wide">
        <div class="workflow-layout">
          <div>
            <SectionHeading
              id="workflow-title"
              title="家庭健康管理流程"
              description="从建立档案到整理复诊参考，流程保持轻量清晰，后续再接入真实设备绑定能力。"
            />
            <ol class="workflow-list">
              <li v-for="step in solution.workflow" :key="step.id">
                <span>{{ step.order }}</span>
                <div>
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.description }}</p>
                </div>
              </li>
            </ol>
          </div>
          <BaseImage
            src="/images/concepts/collar-ecosystem.svg"
            alt="智能项圈、App 和平台协同概念视觉"
            aspect-ratio="16 / 10"
            radius="lg"
            concept
          />
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="family-section module-section"
      width="wide"
      aria-labelledby="modules-title"
    >
      <SectionHeading
        id="modules-title"
        title="方案组成"
        description="以智能硬件、用户端 App 和服务连接三个层次组织能力，具体产品能力仍以确认资料为准。"
      />
      <div class="module-list">
        <article v-for="module in solution.modules" :key="module.id" class="module-item">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="module.icon" />
          </span>
          <div>
            <h3>{{ module.title }}</h3>
            <p>{{ module.description }}</p>
          </div>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="family-section boundary-section"
      aria-labelledby="boundary-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="boundary-title"
          title="边界与待确认项"
          description="把页面边界写清楚，比把概念写成确定承诺更重要。"
        />
        <div class="boundary-layout">
          <div class="guardrail-list">
            <article v-for="item in solution.guardrails" :key="item.id" class="guardrail-item">
              <BaseIcon name="shield-check" />
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
          <div class="confirmation-panel">
            <div v-for="item in solution.confirmationItems" :key="item.label" class="confirmation-row">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
              <p v-if="item.note">{{ item.note }}</p>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="想确认家庭养宠方案是否适合您？"
      description="预约演示，了解当前样机能力、App 流程和后续服务规划。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.family-solution-page {
  overflow: hidden;
}

.family-hero {
  padding-block: var(--space-8) var(--space-7);
}

.family-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.82fr);
  gap: var(--space-8);
  align-items: center;
}

.family-hero__copy {
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

.family-hero h1 {
  max-width: 680px;
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.family-hero__headline {
  color: var(--color-brand-800);
  font-size: 24px;
  font-weight: 750;
}

.family-hero__summary {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 17px;
}

.family-hero__actions,
.family-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.family-hero__visual {
  position: relative;
}

.family-hero__visual::before {
  position: absolute;
  inset: -18px 24px 24px -18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

.family-hero__visual :deep(.base-image) {
  box-shadow: 0 24px 64px rgb(47 36 27 / 10%);
}

.family-section {
  @include section-spacing;
}

.pain-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.pain-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.pain-card p,
.workflow-list p,
.module-item p,
.guardrail-item p,
.confirmation-row p {
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

.workflow-section,
.boundary-section {
  background: var(--color-surface-soft);
}

.workflow-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(420px, 1fr);
  gap: var(--space-8);
  align-items: center;
}

.workflow-list {
  display: grid;
  gap: var(--space-4);
  padding: 0;
  margin: 0;
  list-style: none;
}

.workflow-list li {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: var(--space-4);
  align-items: start;
  padding-block: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.workflow-list li:first-child {
  padding-top: 0;
}

.workflow-list span {
  color: var(--color-accent-600);
  font-size: 15px;
  font-weight: 800;
}

.workflow-list h3,
.module-item h3,
.guardrail-item h3 {
  margin-bottom: var(--space-2);
}

.module-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.module-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  align-items: start;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.boundary-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(360px, 0.8fr);
  gap: var(--space-6);
}

.guardrail-list {
  display: grid;
  gap: var(--space-4);
}

.guardrail-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  align-items: start;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.guardrail-item .base-icon {
  width: 24px;
  height: 24px;
  color: var(--color-success);
}

.confirmation-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.confirmation-row {
  display: grid;
  gap: var(--space-1);
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
  font-weight: 750;
}

.confirmation-row p {
  margin: 0;
  font-size: 13px;
}

@media (max-width: 1100px) {
  .family-hero__inner,
  .workflow-layout,
  .boundary-layout {
    grid-template-columns: 1fr;
  }

  .family-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 820px) {
  .pain-grid,
  .module-list {
    grid-template-columns: 1fr;
  }

  .family-hero h1 {
    font-size: 38px;
  }

  .family-hero__headline {
    font-size: 20px;
  }
}

@media (max-width: 560px) {
  .family-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .family-hero__copy {
    gap: var(--space-3);
  }

  .family-hero h1 {
    font-size: 34px;
  }

  .family-hero__summary {
    font-size: 15px;
  }

  .family-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .family-hero__visual {
    width: min(100%, 280px);
    margin-inline: auto;
  }

  .family-hero__visual::before {
    inset: -12px 16px 16px -12px;
  }

  .workflow-list li,
  .module-item,
  .guardrail-item {
    grid-template-columns: 1fr;
  }
}
</style>


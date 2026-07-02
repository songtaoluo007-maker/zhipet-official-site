<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { caseStudies } from '~/data/corporate'

const { register } = useScrollReveal()

const confirmationItems = [
  { label: '真实客户授权', value: '待项目方确认' },
  { label: '客户名称与 Logo', value: '待项目方确认' },
  { label: '实施数据与成果', value: '待项目方确认' },
  { label: '公开发布时间', value: '待项目方确认' },
]

useSeoMeta({
  title: '客户案例 | 知宠 ZHIPET',
  description:
    '知宠 ZHIPET 客户案例页面当前展示示范案例与概念验证项目，不代表真实客户案例。真实客户授权和结果数据待项目方确认。',
  ogTitle: '客户案例 | 知宠 ZHIPET',
  ogDescription: '展示示范案例与概念验证，不冒充真实客户成果。',
  ogType: 'website',
})
</script>

<template>
  <div class="cases-page">
    <section class="cases-hero" aria-labelledby="cases-title">
      <BaseContainer class="cases-hero__inner" width="wide">
        <div class="cases-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>客户案例</span>
          </nav>
          <BaseTag tone="warning">示范内容，仅供展示</BaseTag>
          <h1 id="cases-title">客户案例</h1>
          <p>
            当前页面用于展示知宠在医院、门店等场景中的案例表达方式。真实客户名称、授权 Logo、实施结果和业务数据待项目方确认后再更新。
          </p>
          <BaseButton to="/partners" variant="secondary" size="lg">
            查看合作场景
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </div>
        <div class="cases-hero__visual">
          <BaseImage
            src="/images/concepts/family-solution.svg"
            alt="知宠客户案例与场景验证概念视觉"
            aspect-ratio="16 / 10"
            radius="lg"
            priority
            concept
          />
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="cases-section"
      width="wide"
      aria-labelledby="case-list-title"
    >
      <SectionHeading
        id="case-list-title"
        title="示范案例与概念验证"
        description="以下内容用于说明官网案例版式和场景逻辑，不代表真实客户案例或已交付成果。"
      />
      <div class="case-grid">
        <article v-for="item in caseStudies" :key="item.id" class="case-card">
          <div class="case-card__meta">
            <BaseTag tone="warning">{{ item.label }}</BaseTag>
            <span>{{ item.scenario }}</span>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.summary }}</p>
          <ul>
            <li v-for="checkpoint in item.checkpoints" :key="checkpoint">{{ checkpoint }}</li>
          </ul>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="cases-section proof-section"
      aria-labelledby="proof-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="proof-title"
          title="案例资料状态"
          description="真实客户案例需要客户授权、实施边界和结果数据共同确认。"
        />
        <div class="proof-list">
          <div v-for="item in confirmationItems" :key="item.label" class="proof-row">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="有真实案例资料需要整理？"
      description="确认授权口径、可公开信息和案例版式后，我们可以替换当前示范内容。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.cases-page {
  overflow: hidden;
}

.cases-hero {
  padding-block: var(--space-8) var(--space-7);
}

.cases-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.82fr);
  gap: var(--space-8);
  align-items: center;
}

.cases-hero__copy {
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

.cases-hero h1 {
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.cases-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
}

.cases-hero__visual {
  position: relative;
}

.cases-hero__visual::before {
  position: absolute;
  inset: -18px 24px 24px -18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

.cases-section {
  @include section-spacing;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.case-card {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.case-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 650;
}

.case-card h2 {
  font-size: 24px;
}

.case-card p {
  color: var(--color-text-secondary);
}

.case-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.case-card li {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface-soft);
  color: var(--color-brand-900);
  font-size: 13px;
  font-weight: 650;
}

.proof-section {
  background: var(--color-surface-soft);
}

.proof-list {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.proof-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.42fr) minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
}

.proof-row:first-child {
  border-top: 0;
}

.proof-row span {
  color: var(--color-brand-900);
  font-weight: 750;
}

.proof-row strong {
  color: var(--color-accent-600);
}

@media (max-width: 1000px) {
  .cases-hero__inner {
    grid-template-columns: 1fr;
  }

  .cases-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 760px) {
  .case-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .cases-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .cases-hero h1 {
    font-size: 36px;
  }

  .cases-hero p {
    font-size: 15px;
  }

  .cases-hero__visual {
    width: min(100%, 300px);
    margin-inline: auto;
  }

  .cases-hero__visual::before {
    inset: -12px 16px 16px -12px;
  }

  .proof-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>

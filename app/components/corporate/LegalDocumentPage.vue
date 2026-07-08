<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SceneFrame from '~/components/common/SceneFrame.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import type { LegalDocument } from '~/data/corporate'

defineProps<{
  document: LegalDocument
}>()
</script>

<template>
  <div class="legal-page">
    <section class="legal-hero" aria-labelledby="legal-title">
      <BaseContainer class="legal-hero__inner" width="wide">
        <div class="legal-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>{{ document.title }}</span>
          </nav>
          <BaseTag tone="warning">{{ document.status }}</BaseTag>
          <h1 id="legal-title">{{ document.title }}</h1>
          <p>
            当前页面用于官网信息架构占位，不构成正式法律文本。正式版本需在主体信息、产品流程和服务范围确认后发布。
          </p>
        </div>
        <SceneFrame
          class="legal-hero__visual"
          src="/images/generated/pages/zhipet-app-profile-scene.png"
          :alt="`${document.title} 页面概念视觉`"
          aspect-ratio="4 / 3"
          object-position="center"
        >
          <div class="legal-status-card">
            <span>{{ document.slug === 'privacy' ? '隐私与安全' : '服务条款' }}</span>
            <strong>{{ document.status }}</strong>
          </div>
        </SceneFrame>
      </BaseContainer>
    </section>

    <BaseContainer
      tag="section"
      class="legal-section"
      width="wide"
      aria-labelledby="legal-status-title"
    >
      <SectionHeading
        id="legal-status-title"
        :title="document.slug === 'privacy' ? '政策状态' : '条款状态'"
        description="先把法律文本的未确认状态写清楚，避免官网占位内容被误解为正式协议。"
      />
      <div class="legal-layout">
        <article v-for="section in document.sections" :key="section.title" class="legal-card">
          <BaseIcon name="shield-check" />
          <div>
            <h2>{{ section.title }}</h2>
            <p>{{ section.body }}</p>
          </div>
        </article>
        <aside class="legal-panel">
          <span>当前状态</span>
          <strong>{{ document.status }}</strong>
          <p>公司主体、联系方式、数据规则、用户权利与争议处理方式均待项目方确认。</p>
          <BaseButton to="/help" variant="text">
            帮助中心
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </aside>
      </div>
    </BaseContainer>

    <CTASection
      title="需要确认官网合规信息？"
      description="联系方式、备案信息、隐私政策和服务条款将在项目方确认后统一更新。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.legal-page {
  overflow: hidden;
}

.legal-hero {
  position: relative;
  isolation: isolate;
  padding-block: var(--space-8) var(--space-7);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 64%), rgb(251 248 242 / 0) 78%),
    radial-gradient(circle at 80% 16%, rgb(232 200 148 / 16%), transparent 30%);
}

.legal-hero::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, var(--color-bg) 0%, rgb(251 248 242 / 82%) 48%, rgb(251 248 242 / 36%) 100%),
    url('/images/generated/pages/zhipet-app-profile-scene.png') center / cover no-repeat;
  content: '';
  opacity: 0.14;
}

.legal-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(360px, 0.7fr);
  min-height: 420px;
  align-items: center;
  gap: var(--space-8);
}

.legal-hero__copy {
  display: grid;
  gap: var(--space-4);
}

.legal-hero__visual {
  min-height: 360px;
}

.legal-status-card {
  position: absolute;
  left: var(--space-4);
  bottom: var(--space-4);
  display: grid;
  gap: var(--space-2);
  width: min(260px, calc(100% - 32px));
  padding: var(--space-4);
  border: 1px solid rgb(255 255 255 / 72%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 86%);
  box-shadow: 0 14px 34px rgb(47 36 27 / 8%);
  backdrop-filter: blur(12px);
}

.legal-status-card span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.legal-status-card strong {
  color: var(--color-accent-600);
  font-size: 20px;
  line-height: 1.3;
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

.legal-hero h1 {
  font-size: 64px;
  line-height: 1.08;
  letter-spacing: 0;
}

.legal-hero p {
  max-width: 760px;
  color: var(--color-text-secondary);
  font-size: 18px;
}

.legal-section {
  @include section-spacing;

  padding-top: var(--space-8);
}

.legal-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.42fr);
  gap: var(--space-5);
  align-items: start;
}

.legal-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid rgb(255 255 255 / 68%);
  border-radius: 16px;
  background: rgb(255 255 255 / 74%);
  box-shadow: 0 12px 28px rgb(47 36 27 / 5%);
}

.legal-card + .legal-card {
  margin-top: var(--space-4);
}

.legal-card .base-icon {
  width: 24px;
  height: 24px;
  color: var(--color-success);
}

.legal-card h2 {
  margin-bottom: var(--space-2);
  font-size: 20px;
}

.legal-card p,
.legal-panel p {
  color: var(--color-text-secondary);
}

.legal-panel {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid rgb(255 255 255 / 68%);
  border-radius: 18px;
  background: rgb(255 255 255 / 72%);
  box-shadow: 0 16px 34px rgb(47 36 27 / 6%);
}

.legal-panel span {
  color: var(--color-brand-900);
  font-weight: 750;
}

.legal-panel strong {
  color: var(--color-accent-600);
  font-size: 22px;
}

@media (max-width: 900px) {
  .legal-hero__inner,
  .legal-layout {
    grid-template-columns: 1fr;
  }

  .legal-hero h1 {
    font-size: 42px;
  }
}

@media (max-width: 560px) {
  .legal-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .legal-hero h1 {
    font-size: 36px;
  }

  .legal-hero p {
    font-size: 15px;
  }

  .legal-card {
    grid-template-columns: 1fr;
  }
}
</style>

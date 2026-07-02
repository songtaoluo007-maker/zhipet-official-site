<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import PageHero from '~/components/common/PageHero.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
</script>

<template>
  <div>
    <PageHero
      label="工程底座"
      title="知宠 ZHIPET 官网基础组件系统"
      description="当前阶段只建立 Nuxt 4 工程、设计 Token、导航、页脚、基础按钮、表单和页面级组件；正式首页将在后续阶段单独实现。"
    >
      <template #actions>
        <BaseButton to="/demo">预约演示</BaseButton>
        <BaseButton to="/products" variant="secondary">查看产品</BaseButton>
      </template>
      <template #tags>
        <BaseTag>Nuxt 4</BaseTag>
        <BaseTag>Vue 3</BaseTag>
        <BaseTag tone="concept">AI 概念图，仅供参考</BaseTag>
      </template>
      <template #media>
        <div class="foundation-preview" aria-label="知宠官网基础组件预览">
          <span class="foundation-preview__mark">ZHIPET</span>
          <p>温暖、专业、可信、克制</p>
        </div>
      </template>
    </PageHero>

    <BaseContainer tag="section" class="foundation-section">
      <SectionHeading
        title="第一阶段组件范围"
        description="按钮、容器、标签、图片、表单输入、导航、移动菜单、页脚、Hero 和 CTA 已作为官网 UI Kit 的基础边界。"
      />
      <div class="foundation-grid">
        <div class="foundation-card">
          <h3>按钮体系</h3>
          <p>Primary、Secondary、Ghost、Text 和 IconButton，统一状态和触控尺寸。</p>
        </div>
        <div class="foundation-card">
          <h3>素材规则</h3>
          <p>概念图必须清楚标注；真实团队、资质、电话、备案信息保持待确认。</p>
        </div>
        <div class="foundation-card">
          <h3>克制动效</h3>
          <p>只保留导航吸顶、按钮反馈、轻量 reveal 和移动菜单过渡。</p>
        </div>
      </div>
    </BaseContainer>

    <CTASection />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.foundation-preview {
  display: grid;
  min-height: 360px;
  place-items: center;
  align-content: center;
  gap: var(--space-4);
  color: var(--color-brand-900);
}

.foundation-preview__mark {
  font-size: clamp(42px, 7vw, 76px);
  font-weight: 800;
  letter-spacing: 0.06em;
}

.foundation-section {
  @include section-spacing;
}

.foundation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.foundation-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

@media (max-width: 820px) {
  .foundation-grid {
    grid-template-columns: 1fr;
  }
}
</style>

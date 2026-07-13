<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import type { LegalDocument } from '~/data/corporate'

defineProps<{ document: LegalDocument }>()
</script>

<template>
  <main class="legal-page">
    <BaseContainer class="legal-hero" width="wide">
      <nav class="breadcrumb" aria-label="面包屑">
        <NuxtLink to="/">首页</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>{{ document.title }}</span>
      </nav>
      <p class="legal-hero__eyebrow">{{ document.slug === 'privacy' ? '隐私与数据' : '网站使用规则' }}</p>
      <h1>{{ document.title }}</h1>
      <div class="legal-hero__meta">
        <span>{{ document.status }}</span>
        <span>维护团队：知宠团队</span>
      </div>
      <p class="legal-hero__description">
        {{ document.slug === 'privacy'
          ? '说明本官网如何处理意见反馈与邮件联系中涉及的信息，以及你可以如何管理这些信息。'
          : '说明浏览与使用知宠官网时需要了解的服务范围、内容边界与联系路径。' }}
      </p>
    </BaseContainer>

    <BaseContainer tag="section" class="legal-layout" width="wide" aria-label="文档正文">
      <nav class="legal-toc" aria-label="本页目录">
        <p>本页目录</p>
        <a v-for="(section, index) in document.sections" :key="section.title" :href="`#legal-section-${index}`">
          <span>0{{ index + 1 }}</span>
          {{ section.title }}
        </a>
      </nav>

      <article class="legal-document">
        <section
          v-for="(section, index) in document.sections"
          :id="`legal-section-${index}`"
          :key="section.title"
        >
          <span>0{{ index + 1 }}</span>
          <div>
            <h2>{{ section.title }}</h2>
            <p>{{ section.body }}</p>
          </div>
        </section>
      </article>
    </BaseContainer>

    <section class="legal-contact" aria-labelledby="legal-contact-title">
      <BaseContainer class="legal-contact__inner" width="wide">
        <div>
          <p>需要进一步说明？</p>
          <h2 id="legal-contact-title">联系知宠团队</h2>
        </div>
        <p>隐私权利、内容纠错或使用规则问题，可通过反馈页面提交，或发送邮件联系我们。</p>
        <BaseButton to="/help#feedback" variant="secondary">
          意见问题反馈
          <template #iconRight><BaseIcon name="arrow-right" /></template>
        </BaseButton>
      </BaseContainer>
    </section>
  </main>
</template>

<style scoped lang="scss">
.legal-page {
  overflow: hidden;
}

.legal-hero {
  display: grid;
  min-height: 560px;
  align-content: center;
  padding-block: clamp(96px, 12vw, 152px);
  border-bottom: 1px solid var(--color-border);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.breadcrumb a {
  color: inherit;
}

.legal-hero__eyebrow {
  margin-bottom: var(--space-3);
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.legal-hero h1 {
  font-size: clamp(52px, 7vw, 86px);
  line-height: 1.04;
}

.legal-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-4);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.legal-hero__description {
  max-width: 720px;
  margin-top: var(--space-5);
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.8;
}

.legal-layout {
  display: grid;
  grid-template-columns: minmax(200px, 0.32fr) minmax(0, 1fr);
  gap: clamp(48px, 9vw, 128px);
  align-items: start;
  padding-block: clamp(96px, 11vw, 144px);
}

.legal-toc {
  position: sticky;
  top: 112px;
  display: grid;
  border-top: 1px solid var(--color-border-strong);
}

.legal-toc > p {
  padding-block: var(--space-4);
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.legal-toc a {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: var(--space-2);
  padding-block: var(--space-3);
  border-top: 1px solid var(--color-border);
  color: var(--color-brand-900);
  font-size: 14px;
}

.legal-toc a span,
.legal-document > section > span {
  color: var(--color-accent-600);
  font-size: 12px;
  font-weight: 800;
}

.legal-document {
  display: grid;
}

.legal-document section {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: var(--space-4);
  padding-block: var(--space-7);
  border-top: 1px solid var(--color-border-strong);
  scroll-margin-top: 120px;
}

.legal-document section:first-child {
  padding-top: 0;
  border-top: 0;
}

.legal-document h2 {
  margin-bottom: var(--space-3);
  font-size: 30px;
}

.legal-document p {
  color: var(--color-text-secondary);
  font-size: 17px;
  line-height: 1.9;
}

.legal-contact {
  color: #fff;
  background: var(--color-brand-900);
}

.legal-contact__inner {
  display: grid;
  grid-template-columns: minmax(220px, 0.55fr) minmax(320px, 1fr) auto;
  gap: var(--space-7);
  align-items: center;
  padding-block: clamp(64px, 8vw, 88px);
}

.legal-contact__inner > div p {
  margin-bottom: var(--space-2);
  color: var(--color-accent-300);
  font-size: 13px;
  font-weight: 800;
}

.legal-contact h2 {
  color: #fff;
  font-size: 32px;
}

.legal-contact__inner > p {
  color: rgb(255 255 255 / 70%);
  line-height: 1.8;
}

.legal-contact :deep(.base-button--secondary) {
  color: #fff;
  border-color: rgb(255 255 255 / 38%);
  background: transparent;
}

@media (max-width: 860px) {
  .legal-layout,
  .legal-contact__inner {
    grid-template-columns: 1fr;
  }

  .legal-toc {
    position: static;
  }
}

@media (max-width: 560px) {
  .legal-hero {
    min-height: 520px;
  }

  .legal-hero__description,
  .legal-document p {
    font-size: 16px;
  }

  .legal-document section {
    grid-template-columns: 1fr;
  }

  .legal-contact :deep(.base-button) {
    width: 100%;
  }
}
</style>

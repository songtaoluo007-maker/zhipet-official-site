<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'

export interface EditorialHeroCrumb {
  label: string
  to?: string
}

withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    description: string
    image: string
    imageAlt: string
    crumbs?: EditorialHeroCrumb[]
    objectPosition?: string
    primaryLabel?: string
    primaryTo?: string
    secondaryLabel?: string
    secondaryTo?: string
    priority?: boolean
  }>(),
  {
    crumbs: () => [],
    objectPosition: 'center',
    primaryLabel: undefined,
    primaryTo: undefined,
    secondaryLabel: undefined,
    secondaryTo: undefined,
    priority: false,
  },
)
</script>

<template>
  <section class="editorial-hero" :aria-labelledby="`editorial-hero-${eyebrow}`">
    <img
      class="editorial-hero__image"
      :src="image"
      :alt="imageAlt"
      :loading="priority ? 'eager' : 'lazy'"
      :style="{ objectPosition }"
    >
    <div class="editorial-hero__veil" aria-hidden="true" />
    <BaseContainer class="editorial-hero__inner" width="wide">
      <nav v-if="crumbs.length" class="editorial-hero__breadcrumb" aria-label="面包屑">
        <template v-for="(crumb, index) in crumbs" :key="`${crumb.label}-${index}`">
          <NuxtLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</NuxtLink>
          <span v-else>{{ crumb.label }}</span>
          <span v-if="index < crumbs.length - 1" aria-hidden="true">/</span>
        </template>
      </nav>
      <div class="editorial-hero__copy">
        <span class="editorial-hero__eyebrow">{{ eyebrow }}</span>
        <h1 :id="`editorial-hero-${eyebrow}`">{{ title }}</h1>
        <p>{{ description }}</p>
        <div v-if="primaryLabel && primaryTo" class="editorial-hero__actions">
          <BaseButton :to="primaryTo" size="lg">
            {{ primaryLabel }}
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
          <BaseButton
            v-if="secondaryLabel && secondaryTo"
            :to="secondaryTo"
            variant="secondary"
            size="lg"
          >
            {{ secondaryLabel }}
          </BaseButton>
        </div>
      </div>
      <span class="editorial-hero__caption">AI 概念图，仅供参考</span>
    </BaseContainer>
  </section>
</template>

<style scoped lang="scss">
.editorial-hero {
  position: relative;
  isolation: isolate;
  min-height: clamp(560px, calc(100svh - 80px), 720px);
  overflow: hidden;
  color: #fff;
  background: var(--color-brand-900);
}

.editorial-hero__image,
.editorial-hero__veil {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.editorial-hero__image {
  z-index: -2;
  object-fit: cover;
}

.editorial-hero__veil {
  z-index: -1;
  background:
    linear-gradient(90deg, rgb(22 29 24 / 78%) 0%, rgb(22 29 24 / 52%) 44%, rgb(22 29 24 / 8%) 78%),
    linear-gradient(0deg, rgb(22 29 24 / 46%) 0%, transparent 42%);
}

.editorial-hero__inner {
  display: grid;
  min-height: inherit;
  align-content: space-between;
  padding-block: var(--space-5) var(--space-7);
}

.editorial-hero__breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  color: rgb(255 255 255 / 72%);
  font-size: 13px;
  font-weight: 650;
}

.editorial-hero__breadcrumb a {
  color: inherit;
}

.editorial-hero__breadcrumb a:hover {
  color: #fff;
}

.editorial-hero__copy {
  display: grid;
  width: min(720px, 72%);
  gap: var(--space-4);
  align-self: end;
}

.editorial-hero__eyebrow {
  width: fit-content;
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--color-accent-300);
  color: var(--color-accent-300);
  font-size: 13px;
  font-weight: 800;
}

.editorial-hero h1 {
  max-width: 760px;
  color: #fff;
  font-size: 58px;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.editorial-hero__copy > p {
  max-width: 680px;
  color: rgb(255 255 255 / 82%);
  font-size: 18px;
  line-height: 1.75;
}

.editorial-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.editorial-hero__actions :deep(.base-button--primary) {
  color: var(--color-brand-900);
  border-color: #fff;
  background: #fff;
}

.editorial-hero__actions :deep(.base-button--secondary) {
  color: #fff;
  border-color: rgb(255 255 255 / 56%);
  background: rgb(255 255 255 / 8%);
}

.editorial-hero__caption {
  position: absolute;
  right: max(var(--space-4), calc((100vw - 1200px) / 2));
  bottom: var(--space-4);
  color: rgb(255 255 255 / 60%);
  font-size: 11px;
}

@media (max-width: 760px) {
  .editorial-hero {
    min-height: 620px;
  }

  .editorial-hero__veil {
    background:
      linear-gradient(0deg, rgb(22 29 24 / 82%) 0%, rgb(22 29 24 / 46%) 62%, rgb(22 29 24 / 10%) 100%);
  }

  .editorial-hero__inner {
    padding-block: var(--space-4) var(--space-7);
  }

  .editorial-hero__copy {
    width: 100%;
  }

  .editorial-hero h1 {
    font-size: 40px;
  }

  .editorial-hero__copy > p {
    font-size: 15px;
  }

  .editorial-hero__actions :deep(.base-button) {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .editorial-hero__image {
    transform: none;
  }
}
</style>

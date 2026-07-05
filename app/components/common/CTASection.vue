<template>
  <section class="cta-section">
    <BaseContainer class="cta-section__inner">
      <div class="cta-section__copy">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <div class="cta-section__actions">
        <BaseButton :to="primaryTo">{{ primaryLabel }}</BaseButton>
        <BaseButton v-if="showSecondary" :to="secondaryTo" variant="text">
          {{ secondaryLabel }}
        </BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    primaryLabel?: string
    primaryTo?: string
    secondaryLabel?: string
    secondaryTo?: string
    showSecondary?: boolean
  }>(),
  {
    title: '携手知宠，为更多宠物带来健康守护',
    description: '预约产品演示，了解适合您的合作方案。',
    primaryLabel: '预约演示',
    primaryTo: '/demo',
    secondaryLabel: '帮助中心',
    secondaryTo: '/help',
    showSecondary: true,
  },
)
</script>

<style scoped lang="scss">
.cta-section {
  padding-block: var(--space-10);
}

.cta-section__inner {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-7);
  border: 1px solid rgb(232 200 148 / 24%);
  border-radius: var(--radius-media);
  color: var(--color-surface);
  background:
    linear-gradient(135deg, rgb(47 36 27), rgb(68 51 38) 58%, rgb(102 80 60)),
    var(--color-brand-900);
}

.cta-section__inner::before {
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(232 200 148 / 70%), transparent);
  content: '';
}

.cta-section__copy {
  position: relative;
  display: grid;
  max-width: 680px;
  gap: var(--space-3);
}

.cta-section__copy h2 {
  color: var(--color-surface);
}

.cta-section__copy p {
  color: rgb(255 255 255 / 74%);
}

.cta-section__actions {
  position: relative;
  display: grid;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-items: end;
}

.cta-section__actions :deep(.base-button--primary) {
  color: var(--color-brand-900);
  border-color: var(--color-accent-300);
  background: var(--color-accent-300);
}

.cta-section__actions :deep(.base-button--primary:hover) {
  border-color: var(--color-surface);
  background: var(--color-surface);
}

.cta-section__actions :deep(.base-button--text) {
  color: var(--color-accent-300);
}

.cta-section__actions :deep(.base-button--text:hover) {
  color: var(--color-surface);
}

@media (max-width: 820px) {
  .cta-section__inner {
    align-items: flex-start;
    flex-direction: column;
    padding: var(--space-5);
  }

  .cta-section__actions {
    justify-items: start;
  }
}
</style>

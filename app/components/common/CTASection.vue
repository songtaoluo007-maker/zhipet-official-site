<template>
  <section class="cta-section">
    <BaseContainer class="cta-section__inner">
      <div class="cta-section__copy">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <div class="cta-section__actions">
        <BaseButton to="/demo">预约演示</BaseButton>
        <BaseButton to="/contact" variant="secondary">联系我们</BaseButton>
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
  }>(),
  {
    title: '携手知宠，为更多宠物带来健康守护',
    description: '预约产品演示，了解适合您的合作方案。',
  },
)
</script>

<style scoped lang="scss">
.cta-section {
  padding-block: var(--space-10);
}

.cta-section__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-7);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
}

.cta-section__copy {
  display: grid;
  max-width: 680px;
  gap: var(--space-3);
}

.cta-section__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 820px) {
  .cta-section__inner {
    align-items: flex-start;
    flex-direction: column;
    padding: var(--space-5);
  }
}
</style>

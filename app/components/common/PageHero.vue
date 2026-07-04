<template>
  <section class="page-hero">
    <BaseContainer class="page-hero__inner" width="wide">
      <div class="page-hero__copy">
        <slot name="breadcrumb" />
        <BaseTag v-if="label" tone="accent">{{ label }}</BaseTag>
        <h1>{{ title }}</h1>
        <p v-if="description" class="page-hero__description">{{ description }}</p>
        <div v-if="$slots.actions" class="page-hero__actions">
          <slot name="actions" />
        </div>
        <div v-if="$slots.tags" class="page-hero__tags">
          <slot name="tags" />
        </div>
      </div>
      <div v-if="$slots.media" class="page-hero__media">
        <slot name="media" />
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseTag from '~/components/base/BaseTag.vue'

defineProps<{
  title: string
  label?: string
  description?: string
}>()
</script>

<style scoped lang="scss">
.page-hero {
  padding-block: var(--space-9);
  background: linear-gradient(180deg, rgb(246 241 233 / 54%), rgb(250 248 244 / 0));
}

.page-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.8fr);
  gap: var(--space-8);
  align-items: center;
}

.page-hero__copy {
  display: grid;
  gap: var(--space-5);
}

.page-hero__copy h1 {
  max-width: 760px;
  text-wrap: balance;
}

.page-hero__description {
  max-width: 620px;
  font-size: 18px;
  line-height: 1.72;
}

.page-hero__actions,
.page-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.page-hero__media {
  position: relative;
  min-height: 360px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background:
    linear-gradient(135deg, rgb(246 234 216 / 65%), rgb(255 255 255 / 92%)),
    var(--color-surface);
}

.page-hero__media::before {
  position: absolute;
  inset: -16px 22px 22px -16px;
  z-index: -1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

@media (max-width: 899px) {
  .page-hero {
    padding-block: var(--space-7);
  }

  .page-hero__inner {
    grid-template-columns: 1fr;
  }

  .page-hero__media {
    min-height: 260px;
  }
}

@media (max-width: 560px) {
  .page-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .page-hero__description {
    font-size: 15px;
  }

  .page-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .page-hero__media::before {
    inset: -12px 16px 16px -12px;
  }
}
</style>

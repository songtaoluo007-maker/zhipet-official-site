<template>
  <figure class="base-image" :class="[`base-image--${radius}`]" :style="figureStyle">
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="priority ? 'eager' : 'lazy'"
      :preload="priority"
      class="base-image__media"
    />
    <figcaption v-if="concept" class="base-image__label">AI 概念图，仅供参考</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ImageRadius } from '~/types/ui'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    width?: number
    height?: number
    aspectRatio?: string
    radius?: ImageRadius
    priority?: boolean
    concept?: boolean
  }>(),
  {
    width: undefined,
    height: undefined,
    aspectRatio: undefined,
    radius: 'md',
    priority: false,
    concept: false,
  },
)

const figureStyle = computed(() => ({
  aspectRatio: props.aspectRatio,
}))
</script>

<style scoped lang="scss">
.base-image {
  position: relative;
  margin: 0;
  overflow: hidden;
  background: var(--color-surface-soft);
}

.base-image--none {
  border-radius: 0;
}

.base-image--sm {
  border-radius: var(--radius-button);
}

.base-image--md {
  border-radius: var(--radius-card);
}

.base-image--lg {
  border-radius: var(--radius-media);
}

.base-image__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.base-image__label {
  position: absolute;
  right: var(--space-3);
  bottom: var(--space-3);
  padding: 6px 10px;
  border: 1px solid rgb(232 200 148 / 70%);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: rgb(255 255 255 / 86%);
  font-size: 12px;
  font-weight: 650;
  backdrop-filter: blur(8px);
}
</style>

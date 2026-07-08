<template>
  <figure
    class="base-image"
    :class="[`base-image--${radius}`, `base-image--label-${labelPlacement}`]"
  >
    <div class="base-image__frame" :style="frameStyle">
      <img
        v-if="useRawImage"
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        :loading="priority ? 'eager' : 'lazy'"
        class="base-image__media"
        :style="mediaStyle"
      >
      <NuxtImg
        v-else
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        :loading="priority ? 'eager' : 'lazy'"
        :preload="priority"
        class="base-image__media"
        :style="mediaStyle"
      />
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ImageFit, ImageLabelPlacement, ImageRadius } from '~/types/ui'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    width?: number
    height?: number
    aspectRatio?: string
    fit?: ImageFit
    objectPosition?: string
    radius?: ImageRadius
    labelPlacement?: ImageLabelPlacement
    priority?: boolean
    concept?: boolean
    unoptimized?: boolean
  }>(),
  {
    width: undefined,
    height: undefined,
    aspectRatio: undefined,
    fit: 'cover',
    objectPosition: 'center',
    radius: 'md',
    labelPlacement: 'inside',
    priority: false,
    concept: false,
    unoptimized: false,
  },
)

const frameStyle = computed(() => ({
  aspectRatio: props.aspectRatio,
}))

const mediaStyle = computed(() => ({
  objectFit: props.fit,
  objectPosition: props.objectPosition,
}))

const useRawImage = computed(() => props.unoptimized || props.src.startsWith('/images/generated/'))
</script>

<style scoped lang="scss">
.base-image {
  margin: 0;
}

.base-image__frame {
  position: relative;
  overflow: hidden;
  background: var(--color-surface-soft);
}

.base-image--none .base-image__frame {
  border-radius: 0;
}

.base-image--sm .base-image__frame {
  border-radius: var(--radius-button);
}

.base-image--md .base-image__frame {
  border-radius: var(--radius-card);
}

.base-image--lg .base-image__frame {
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

.base-image__label--below {
  position: static;
  width: fit-content;
  margin: var(--space-2) 0 0 auto;
  background: transparent;
  backdrop-filter: none;
}
</style>

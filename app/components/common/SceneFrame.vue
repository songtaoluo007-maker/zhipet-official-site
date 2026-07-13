<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string
    alt: string
    aspectRatio?: string
    objectPosition?: string
    tone?: 'light' | 'dark'
  }>(),
  {
    aspectRatio: '16 / 10',
    objectPosition: 'center',
    tone: 'light',
  },
)
</script>

<template>
  <figure class="scene-frame" :class="`scene-frame--${tone}`" :style="{ aspectRatio }">
    <img class="scene-frame__image" :src="src" :alt="alt" :style="{ objectPosition }">
    <slot />
    <figcaption v-if="src.startsWith('/images/generated/')" class="scene-frame__label">
      AI 概念图，仅供参考
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.scene-frame {
  position: relative;
  overflow: hidden;
  min-width: 0;
  margin: 0;
  border: 1px solid rgb(255 255 255 / 72%);
  border-radius: 22px;
  background: var(--color-surface);
  box-shadow: 0 28px 88px rgb(47 36 27 / 10%);
  isolation: isolate;
}

.scene-frame::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 8%), rgb(35 57 45 / 16%)),
    radial-gradient(circle at 18% 18%, rgb(255 255 255 / 42%), transparent 30%);
  content: '';
  pointer-events: none;
}

.scene-frame--dark::after {
  background:
    linear-gradient(90deg, rgb(19 44 33 / 68%), rgb(19 44 33 / 8%) 60%),
    linear-gradient(180deg, transparent, rgb(19 44 33 / 28%));
}

.scene-frame__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scene-frame__label {
  position: absolute;
  right: 14px;
  bottom: 12px;
  z-index: 3;
  padding: 6px 9px;
  border: 1px solid rgb(255 255 255 / 62%);
  border-radius: var(--radius-pill);
  color: var(--color-text-secondary);
  background: rgb(255 255 255 / 80%);
  font-size: 12px;
  font-weight: 650;
  backdrop-filter: blur(10px);
}

:slotted(*) {
  z-index: 2;
}
</style>

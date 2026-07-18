<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseIconButton from '~/components/base/BaseIconButton.vue'

const isAtTop = ref(true)

const updateScrollState = () => {
  if (typeof window === 'undefined') {
    return
  }

  isAtTop.value = window.scrollY < 12
}

const scrollToTop = () => {
  if (typeof window === 'undefined') {
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
})
</script>

<template>
  <BaseIconButton
    class="back-to-top"
    :class="{ 'is-at-top': isAtTop }"
    :aria-hidden="isAtTop ? 'true' : undefined"
    :tabindex="isAtTop ? -1 : 0"
    label="返回页面顶部"
    variant="bordered"
    size="lg"
    @click="scrollToTop"
  >
    <BaseIcon name="arrow-up" :stroke-width="2" />
  </BaseIconButton>
</template>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  inset-inline-end: max(16px, var(--page-gutter));
  bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 80;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-pill);
  border-color: rgb(20 63 50 / 16%);
  color: var(--color-brand-900);
  background: rgb(251 248 242 / 86%);
  box-shadow: 0 14px 34px rgb(47 36 27 / 12%);
  backdrop-filter: blur(14px);
  transition:
    background var(--motion-duration-fast) var(--motion-ease-out),
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    box-shadow var(--motion-duration-fast) var(--motion-ease-out),
    opacity var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.back-to-top:hover,
.back-to-top:focus-visible {
  border-color: rgb(183 121 43 / 38%);
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 16px 42px rgb(47 36 27 / 16%);
  transform: translateY(-2px);
}

.back-to-top.is-at-top {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
}

@media (max-width: 639px) {
  .back-to-top {
    inset-inline-end: 16px;
    bottom: calc(18px + env(safe-area-inset-bottom));
    width: 46px;
    height: 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top {
    transition: none;
  }

  .back-to-top:hover,
  .back-to-top:focus-visible {
    transform: none;
  }
}
</style>

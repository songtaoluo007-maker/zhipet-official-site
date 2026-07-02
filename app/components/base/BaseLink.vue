<template>
  <NuxtLink v-if="safeHref && isInternal" :to="safeHref" class="base-link">
    <slot />
  </NuxtLink>
  <a
    v-else
    :href="safeHref"
    class="base-link"
    :target="safeHref ? '_blank' : undefined"
    :rel="safeHref ? 'noopener noreferrer' : undefined"
    :aria-disabled="safeHref ? undefined : 'true'"
    :tabindex="safeHref ? undefined : -1"
    @click="handleClick"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isInternalHref, toSafeHref } from '~/utils/safe-href'

const props = defineProps<{
  href: string
}>()

const safeHref = computed(() => toSafeHref(props.href))
const isInternal = computed(() => isInternalHref(safeHref.value))

const handleClick = (event: MouseEvent) => {
  if (!safeHref.value) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-link {
  @include focus-visible;

  color: var(--color-accent-600);
  font-weight: 650;
  text-underline-offset: 4px;

  &:hover {
    color: var(--color-brand-900);
    text-decoration: underline;
  }

  &[aria-disabled='true'] {
    color: var(--color-text-secondary);
    cursor: not-allowed;
    opacity: 0.64;
    pointer-events: none;
  }
}
</style>

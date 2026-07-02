<template>
  <component :is="tag" class="base-container" :class="`base-container--${width}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { ContainerWidth } from '~/types/ui'

withDefaults(
  defineProps<{
    width?: ContainerWidth
    tag?: 'div' | 'section' | 'main' | 'header' | 'footer'
  }>(),
  {
    width: 'default',
    tag: 'div',
  },
)
</script>

<style scoped lang="scss">
.base-container {
  width: min(100% - (var(--page-gutter) * 2), var(--container-default));
  margin-inline: auto;
}

.base-container--narrow {
  width: min(100% - (var(--page-gutter) * 2), var(--container-narrow));
}

.base-container--wide {
  width: min(100% - (var(--page-gutter) * 2), var(--container-wide));
}
</style>

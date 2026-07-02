<template>
  <NuxtLink v-if="isInternal" :to="href" class="base-link">
    <slot />
  </NuxtLink>
  <a v-else :href="href" class="base-link" target="_blank" rel="noopener noreferrer">
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  href: string
}>()

const isInternal = computed(() => props.href.startsWith('/'))
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
}
</style>

<template>
  <span class="base-tag" :class="`base-tag--${tone}`">
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { TagTone } from '~/types/ui'

withDefaults(
  defineProps<{
    tone?: TagTone
  }>(),
  {
    tone: 'neutral',
  },
)
</script>

<style scoped lang="scss">
.base-tag {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 28px;
  padding: 0 var(--space-3);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 650;
  line-height: 1;
}

.base-tag--neutral {
  color: var(--color-text-secondary);
  background: var(--color-surface-soft);
  border-color: var(--color-border);
}

.base-tag--accent {
  color: var(--color-brand-900);
  background: var(--color-accent-100);
  border-color: var(--color-accent-300);
}

.base-tag--success {
  color: var(--color-success);
  background: rgb(86 130 103 / 10%);
  border-color: rgb(86 130 103 / 22%);
}

.base-tag--warning,
.base-tag--concept {
  color: var(--color-accent-600);
  background: rgb(200 138 56 / 10%);
  border-color: rgb(200 138 56 / 24%);
}
</style>

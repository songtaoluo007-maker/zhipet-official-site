<template>
  <button
    class="base-icon-button"
    :class="[`base-icon-button--${variant}`, `base-icon-button--${size}`]"
    :type="type"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { ButtonSize } from '~/types/ui'

withDefaults(
  defineProps<{
    label: string
    variant?: 'plain' | 'surface' | 'bordered'
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'plain',
    size: 'md',
    type: 'button',
    disabled: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-icon-button {
  @include focus-visible;
  @include touch-target;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--radius-button);
  color: var(--color-brand-900);
  background: transparent;
  transition:
    background var(--motion-duration-fast) var(--motion-ease-out),
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    opacity var(--motion-duration-fast) var(--motion-ease-out);

  &:disabled {
    opacity: 0.5;
  }
}

.base-icon-button--sm {
  width: 40px;
  height: 40px;
}

.base-icon-button--md {
  width: 44px;
  height: 44px;
}

.base-icon-button--lg {
  width: 48px;
  height: 48px;
}

.base-icon-button--surface {
  background: var(--color-surface);
}

.base-icon-button--bordered {
  border-color: var(--color-border);
}

.base-icon-button:not(:disabled):hover {
  background: rgb(47 36 27 / 6%);
}
</style>

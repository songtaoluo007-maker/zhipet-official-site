<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="base-button"
    :class="buttonClasses"
    :aria-disabled="isUnavailable"
    @click="handleClick"
  >
    <span v-if="$slots.iconLeft" class="base-button__icon" aria-hidden="true">
      <slot name="iconLeft" />
    </span>
    <span class="base-button__label">
      <slot />
    </span>
    <span v-if="$slots.iconRight" class="base-button__icon base-button__icon--right" aria-hidden="true">
      <slot name="iconRight" />
    </span>
  </NuxtLink>
  <a
    v-else-if="href"
    :href="isUnavailable ? undefined : href"
    class="base-button"
    :class="buttonClasses"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :aria-disabled="isUnavailable"
    @click="handleClick"
  >
    <span v-if="$slots.iconLeft" class="base-button__icon" aria-hidden="true">
      <slot name="iconLeft" />
    </span>
    <span class="base-button__label">
      <slot />
    </span>
    <span v-if="$slots.iconRight" class="base-button__icon base-button__icon--right" aria-hidden="true">
      <slot name="iconRight" />
    </span>
  </a>
  <button
    v-else
    class="base-button"
    :class="buttonClasses"
    :type="type"
    :disabled="isUnavailable"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__loader" aria-hidden="true" />
    <span v-if="$slots.iconLeft && !loading" class="base-button__icon" aria-hidden="true">
      <slot name="iconLeft" />
    </span>
    <span class="base-button__label">
      <slot />
    </span>
    <span v-if="$slots.iconRight" class="base-button__icon base-button__icon--right" aria-hidden="true">
      <slot name="iconRight" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonSize, ButtonVariant } from '~/types/ui'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    to?: string
    href?: string
    external?: boolean
    loading?: boolean
    disabled?: boolean
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    to: undefined,
    href: undefined,
    external: false,
    loading: false,
    disabled: false,
    block: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isUnavailable = computed(() => props.disabled || props.loading)

const buttonClasses = computed(() => [
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--block': props.block,
    'is-loading': props.loading,
    'is-disabled': isUnavailable.value,
  },
])

const handleClick = (event: MouseEvent) => {
  if (isUnavailable.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-button {
  @include focus-visible;
  @include touch-target;

  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  width: fit-content;
  border: 1px solid transparent;
  border-radius: var(--radius-button);
  font-weight: 650;
  line-height: 1;
  text-align: center;
  transition:
    color var(--motion-duration-fast) var(--motion-ease-out),
    background var(--motion-duration-fast) var(--motion-ease-out),
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);

  &:not(.is-disabled):hover {
    transform: translateY(-1px);
  }

  &.is-disabled {
    opacity: 0.58;
    pointer-events: none;
  }
}

.base-button--sm {
  min-height: 40px;
  padding: 0 14px;
  font-size: 14px;
}

.base-button--md {
  min-height: 48px;
  padding: 0 20px;
  font-size: 15px;
}

.base-button--lg {
  min-height: 54px;
  padding: 0 24px;
  font-size: 16px;
}

.base-button--primary {
  color: var(--color-surface);
  background: var(--color-accent-600);
  border-color: var(--color-accent-600);

  &:not(.is-disabled):hover {
    background: var(--color-accent-500);
    border-color: var(--color-accent-500);
  }
}

.base-button--secondary {
  color: var(--color-brand-900);
  background: transparent;
  border-color: var(--color-brand-700);

  &:not(.is-disabled):hover {
    background: rgb(47 36 27 / 5%);
  }
}

.base-button--ghost {
  color: var(--color-brand-900);
  background: var(--color-surface);
  border-color: var(--color-border);

  &:not(.is-disabled):hover {
    box-shadow: var(--shadow-hover);
  }
}

.base-button--text {
  min-height: 0;
  padding: 0;
  color: var(--color-accent-600);
  background: transparent;
  border-color: transparent;

  &:not(.is-disabled):hover {
    color: var(--color-brand-900);
    transform: none;

    .base-button__icon--right {
      transform: translateX(3px);
    }
  }
}

.base-button--block {
  width: 100%;
}

.base-button__icon,
.base-button__loader {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
}

.base-button__icon--right {
  transition: transform var(--motion-duration-fast) var(--motion-ease-out);
}

.base-button__loader {
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--radius-pill);
  animation: button-spin 760ms linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(1turn);
  }
}

@media (max-width: 639px) {
  .base-button--block {
    width: 100%;
  }
}
</style>

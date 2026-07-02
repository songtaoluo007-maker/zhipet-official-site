<template>
  <input
    :id="id"
    v-model="model"
    class="base-input"
    :class="{ 'is-invalid': invalid }"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
  >
</template>

<script setup lang="ts">
const model = defineModel<string | number>({ default: '' })

withDefaults(
  defineProps<{
    id?: string
    name?: string
    type?: 'text' | 'email' | 'tel' | 'url' | 'search' | 'password'
    placeholder?: string
    autocomplete?: string
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    describedBy?: string
  }>(),
  {
    id: undefined,
    name: undefined,
    type: 'text',
    placeholder: undefined,
    autocomplete: undefined,
    disabled: false,
    required: false,
    invalid: false,
    describedBy: undefined,
  },
)
</script>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-input {
  @include focus-visible;
  @include touch-target;

  width: 100%;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-field);
  color: var(--color-text);
  background: var(--color-surface);
  font-size: 15px;
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    box-shadow var(--motion-duration-fast) var(--motion-ease-out);

  &::placeholder {
    color: rgb(109 101 94 / 62%);
  }

  &:disabled {
    color: var(--color-text-secondary);
    background: var(--color-surface-soft);
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    border-color: rgb(102 80 60 / 42%);
  }

  &.is-invalid {
    border-color: var(--color-danger);
  }
}
</style>

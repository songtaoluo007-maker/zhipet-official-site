<template>
  <textarea
    :id="id"
    v-model="model"
    class="base-textarea"
    :class="{ 'is-invalid': invalid }"
    :name="name"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :required="required"
    :rows="rows"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
  />
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    id?: string
    name?: string
    placeholder?: string
    autocomplete?: string
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    describedBy?: string
    rows?: number
  }>(),
  {
    id: undefined,
    name: undefined,
    placeholder: undefined,
    autocomplete: undefined,
    disabled: false,
    required: false,
    invalid: false,
    describedBy: undefined,
    rows: 5,
  },
)
</script>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-textarea {
  @include focus-visible;

  width: 100%;
  min-height: 132px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-field);
  color: var(--color-text);
  background: var(--color-surface);
  font-size: 15px;
  line-height: 1.65;
  resize: vertical;
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

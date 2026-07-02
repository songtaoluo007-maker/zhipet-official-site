<template>
  <div class="form-field" :class="{ 'is-invalid': Boolean(error) }">
    <label v-if="label" class="form-field__label" :for="forId">
      {{ label }}
      <span v-if="required" class="form-field__required" aria-hidden="true">*</span>
    </label>
    <slot
      :id="forId"
      :described-by="describedBy"
      :invalid="Boolean(error)"
      :required="required"
    />
    <p v-if="error" :id="errorId" class="form-field__message" role="alert">
      {{ error }}
    </p>
    <p v-else-if="helper" :id="helperId" class="form-field__helper">
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    label?: string
    helper?: string
    error?: string
    required?: boolean
  }>(),
  {
    label: undefined,
    helper: undefined,
    error: undefined,
    required: false,
  },
)

const forId = computed(() => props.id)
const helperId = computed(() => `${props.id}-helper`)
const errorId = computed(() => `${props.id}-error`)
const describedBy = computed(() => (props.error ? errorId.value : props.helper ? helperId.value : undefined))
</script>

<style scoped lang="scss">
.form-field {
  display: grid;
  gap: var(--space-2);
}

.form-field__label {
  color: var(--color-brand-900);
  font-size: 14px;
  font-weight: 650;
}

.form-field__required {
  color: var(--color-danger);
}

.form-field__helper,
.form-field__message {
  font-size: 13px;
  line-height: 1.5;
}

.form-field__helper {
  color: var(--color-text-secondary);
}

.form-field__message {
  color: var(--color-danger);
}
</style>

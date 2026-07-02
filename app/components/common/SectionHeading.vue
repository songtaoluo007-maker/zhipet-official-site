<template>
  <div class="section-heading" :class="`section-heading--${align}`">
    <div class="section-heading__copy">
      <h2>{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
    <div v-if="$slots.action" class="section-heading__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    align?: 'left' | 'center'
  }>(),
  {
    description: undefined,
    align: 'left',
  },
)
</script>

<style scoped lang="scss">
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-5);
  margin-bottom: var(--space-7);
}

.section-heading__copy {
  display: grid;
  max-width: 680px;
  gap: var(--space-3);
}

.section-heading__copy p {
  font-size: 17px;
}

.section-heading--center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

@media (max-width: 720px) {
  .section-heading {
    align-items: start;
    flex-direction: column;
  }
}
</style>

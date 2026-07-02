<template>
  <ol class="process-steps">
    <li v-for="(step, index) in steps" :key="step.id" class="process-steps__item">
      <span class="process-steps__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
      <span class="process-steps__icon" aria-hidden="true">
        <BaseIcon :name="step.icon" />
      </span>
      <div class="process-steps__copy">
        <h3>{{ step.title }}</h3>
        <p>{{ step.description }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/base/BaseIcon.vue'
import type { AiPetProcessStep } from '~/types/ai-pet-understanding'

defineProps<{
  steps: AiPetProcessStep[]
}>()
</script>

<style scoped lang="scss">
.process-steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--space-4);
  padding: 0;
  margin: 0;
  list-style: none;
}

.process-steps__item {
  position: relative;
  display: grid;
  gap: var(--space-3);
  align-content: start;
  min-width: 0;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.process-steps__item:not(:last-child)::after {
  position: absolute;
  top: 21px;
  right: calc(var(--space-4) * -0.5);
  width: var(--space-4);
  height: 1px;
  background: var(--color-border);
  content: '';
}

.process-steps__index {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.process-steps__icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  color: var(--color-accent-600);
  background: var(--color-accent-100);
  font-size: 22px;
}

.process-steps__copy {
  display: grid;
  gap: var(--space-2);
}

.process-steps__copy h3 {
  font-size: 18px;
}

.process-steps__copy p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

@media (max-width: 1100px) {
  .process-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .process-steps__item:not(:last-child)::after {
    display: none;
  }
}

@media (max-width: 620px) {
  .process-steps {
    grid-template-columns: 1fr;
  }
}
</style>
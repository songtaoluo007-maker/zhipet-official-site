<template>
  <Transition name="mobile-menu">
    <div v-if="open" class="mobile-menu" role="dialog" aria-modal="true" aria-label="移动端导航">
      <button class="mobile-menu__backdrop" type="button" aria-label="关闭导航" @click="$emit('close')" />
      <nav class="mobile-menu__panel" aria-label="移动端主导航">
        <div class="mobile-menu__head">
          <NuxtLink class="mobile-menu__brand" to="/" @click="$emit('close')">
            <span>知宠</span>
            <strong>ZHIPET</strong>
          </NuxtLink>
          <BaseIconButton label="关闭导航" variant="bordered" @click="$emit('close')">
            <span aria-hidden="true">×</span>
          </BaseIconButton>
        </div>
        <ul class="mobile-menu__list">
          <li v-for="item in items" :key="item.href">
            <NuxtLink class="mobile-menu__link" :to="item.href" @click="$emit('close')">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <BaseButton to="/demo" block @click="$emit('close')">预约演示</BaseButton>
      </nav>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseIconButton from '~/components/base/BaseIconButton.vue'
import type { NavigationItem } from '~/types/site'

const props = defineProps<{
  open: boolean
  items: NavigationItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped lang="scss">
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: none;
}

.mobile-menu__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgb(36 29 24 / 35%);
}

.mobile-menu__panel {
  position: absolute;
  inset-block: 0;
  right: 0;
  display: flex;
  width: min(88vw, 360px);
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-5);
  background: var(--color-bg);
  box-shadow: -20px 0 60px rgb(47 36 27 / 15%);
}

.mobile-menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-menu__brand {
  display: grid;
  gap: 2px;
  color: var(--color-brand-900);
  line-height: 1.1;
}

.mobile-menu__brand span {
  font-size: 20px;
  font-weight: 800;
}

.mobile-menu__brand strong {
  color: var(--color-text-secondary);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.mobile-menu__list {
  display: grid;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.mobile-menu__link {
  display: flex;
  min-height: 48px;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-brand-900);
  font-weight: 650;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity var(--motion-duration-base) var(--motion-ease-out);
}

.mobile-menu-enter-active .mobile-menu__panel,
.mobile-menu-leave-active .mobile-menu__panel {
  transition: transform var(--motion-duration-base) var(--motion-ease-out);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu__panel,
.mobile-menu-leave-to .mobile-menu__panel {
  transform: translateX(24px);
}

@media (max-width: 899px) {
  .mobile-menu {
    display: block;
  }
}
</style>

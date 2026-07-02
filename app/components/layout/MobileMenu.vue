<template>
  <Transition name="mobile-menu">
    <div v-if="open" ref="dialogElement" class="mobile-menu" role="dialog" aria-modal="true" aria-label="移动端导航">
      <button
        class="mobile-menu__backdrop"
        type="button"
        aria-label="关闭导航"
        tabindex="-1"
        @click="$emit('close')"
      />
      <nav class="mobile-menu__panel" aria-label="移动端主导航">
        <div class="mobile-menu__head">
          <NuxtLink class="mobile-menu__brand" to="/" @click="$emit('close')">
            <span>知宠</span>
            <strong>ZHIPET</strong>
          </NuxtLink>
          <BaseIconButton label="关闭菜单" variant="bordered" data-menu-close @click="$emit('close')">
            <BaseIcon name="x" />
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
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseIconButton from '~/components/base/BaseIconButton.vue'
import type { NavigationItem } from '~/types/site'

const props = defineProps<{
  open: boolean
  items: NavigationItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogElement = ref<HTMLElement | null>(null)
let previousActiveElement: HTMLElement | null = null
let previousBodyOverflow = ''

const focusableSelector = [
  'a[href]',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const getFocusableElements = () => {
  if (!dialogElement.value) {
    return []
  }

  return Array.from(dialogElement.value.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.tabIndex >= 0 && !element.hasAttribute('aria-hidden'),
  )
}

const focusCloseButton = async () => {
  await nextTick()
  dialogElement.value?.querySelector<HTMLElement>('[data-menu-close]')?.focus()
}

const lockPageScroll = () => {
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

const restorePageScroll = () => {
  document.body.style.overflow = previousBodyOverflow
}

const openMenu = async () => {
  previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
  lockPageScroll()
  await focusCloseButton()
}

const closeMenu = () => {
  restorePageScroll()
  previousActiveElement?.focus()
  previousActiveElement = null
}

const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || !props.open) {
    return
  }

  const focusableElements = getFocusableElements()
  const firstElement = focusableElements[0]
  const lastElement = focusableElements.at(-1)

  if (!firstElement || !lastElement) {
    return
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
    return
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.open) {
    return
  }

  if (event.key === 'Escape') {
    emit('close')
    return
  }

  trapFocus(event)
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      void openMenu()
      return
    }

    closeMenu()
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  if (props.open) {
    void openMenu()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)

  if (props.open) {
    restorePageScroll()
  }
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

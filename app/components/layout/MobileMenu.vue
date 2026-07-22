<template>
  <Transition name="mobile-menu">
    <div
      v-if="open"
      ref="dialogElement"
      class="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="移动端导航"
    >
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
          <BaseIconButton
            label="关闭菜单"
            variant="bordered"
            data-menu-close
            @click="$emit('close')"
          >
            <BaseIcon name="x" />
          </BaseIconButton>
        </div>
        <ul class="mobile-menu__list">
          <li v-for="item in items" :key="item.href" class="mobile-menu__item">
            <div class="mobile-menu__row">
              <NuxtLink
                class="mobile-menu__link"
                :class="{ 'is-active': isActive(item.href) }"
                :to="item.href"
                :aria-current="isCurrent(item.href) ? 'page' : undefined"
                @click="$emit('close')"
              >
                {{ item.label }}
              </NuxtLink>
              <button
                v-if="hasChildLinks(item)"
                class="mobile-menu__toggle"
                type="button"
                :aria-expanded="isSectionExpanded(item)"
                :aria-controls="sectionId(item)"
                :aria-label="`${isSectionExpanded(item) ? '收起' : '展开'}${item.label}子菜单`"
                @click="toggleSection(item)"
              >
                <span aria-hidden="true">{{ isSectionExpanded(item) ? '−' : '+' }}</span>
              </button>
            </div>
            <ul
              v-if="hasChildLinks(item) && isSectionExpanded(item)"
              :id="sectionId(item)"
              class="mobile-menu__children"
            >
              <li v-for="child in childLinks(item)" :key="child.href">
                <NuxtLink
                  class="mobile-menu__sub-link"
                  :class="{ 'is-active': isChildActive(child.href, item.href) }"
                  :to="child.href"
                  :aria-current="isCurrent(child.href) ? 'page' : undefined"
                  @click="$emit('close')"
                >
                  <span>{{ child.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
        <div class="mobile-menu__actions" aria-label="产品与支持">
          <BaseButton to="/download" block @click="$emit('close')">
            <template #iconLeft><BaseIcon name="phone" /></template>
            App 下载
          </BaseButton>
          <BaseButton to="/help#feedback" variant="secondary" block @click="$emit('close')">
            意见问题反馈
          </BaseButton>
        </div>
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

const route = useRoute()
const dialogElement = ref<HTMLElement | null>(null)
const expandedHref = ref<string | null>(null)
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

const isActive = (href: string) => {
  if (href === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(href)
}

const isCurrent = (href: string) => route.path === href

const isChildActive = (href: string, parentHref: string) => {
  if (href === parentHref) {
    return isCurrent(href)
  }

  return isActive(href)
}

const childLinks = (item: NavigationItem) =>
  item.children?.filter((child) => child.href !== item.href) ?? []

const hasChildLinks = (item: NavigationItem) => childLinks(item).length > 0

const isSectionExpanded = (item: NavigationItem) => expandedHref.value === item.href

const sectionId = (item: NavigationItem) =>
  `mobile-menu-section-${item.href.replace(/[^a-z0-9]+/gi, '-') || 'home'}`

const activeSectionHref = () =>
  props.items.find((item) => hasChildLinks(item) && isActive(item.href))?.href ?? null

const syncExpandedSection = () => {
  expandedHref.value = activeSectionHref()
}

const toggleSection = (item: NavigationItem) => {
  expandedHref.value = isSectionExpanded(item) ? null : item.href
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
  previousActiveElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null
  syncExpandedSection()
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

watch(
  () => route.path,
  () => {
    if (props.open) {
      syncExpandedSection()
    }
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
  background: rgb(36 29 24 / 38%);
  backdrop-filter: blur(6px);
}

.mobile-menu__panel {
  position: absolute;
  inset-block: 0;
  right: 0;
  display: flex;
  width: min(88vw, 360px);
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid rgb(232 224 213 / 78%);
  background:
    linear-gradient(180deg, rgb(255 253 248 / 98%), rgb(246 241 233 / 98%)), var(--color-bg);
  box-shadow: -20px 0 60px rgb(47 36 27 / 15%);
  overscroll-behavior: contain;
}

.mobile-menu__head {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border);
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
  min-height: 0;
  flex: 1 1 auto;
  align-content: start;
  gap: var(--space-2);
  overflow-y: auto;
  padding: var(--space-3) var(--space-5);
  margin: 0;
  list-style: none;
  overscroll-behavior: contain;
}

.mobile-menu__item {
  border-bottom: 1px solid var(--color-border);
}

.mobile-menu__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px;
  align-items: center;
}

.mobile-menu__link {
  display: flex;
  min-height: 48px;
  align-items: center;
  color: var(--color-brand-900);
  font-weight: 650;
}

.mobile-menu__link.is-active {
  color: var(--color-accent-600);
}

.mobile-menu__toggle {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 0;
  color: var(--color-brand-900);
  background: transparent;
  cursor: pointer;
}

.mobile-menu__toggle span {
  font-size: 21px;
  font-weight: 400;
  line-height: 1;
}

.mobile-menu__toggle:hover,
.mobile-menu__toggle:focus-visible {
  color: var(--color-accent-600);
}

.mobile-menu__toggle:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
}

.mobile-menu__children {
  display: grid;
  gap: 4px;
  padding: 4px 0 var(--space-3) var(--space-3);
  margin: 0;
  border-left: 1px solid var(--color-border-strong);
  list-style: none;
}

.mobile-menu__sub-link {
  display: flex;
  min-height: 38px;
  align-items: center;
  padding: 6px var(--space-3);
  color: var(--color-brand-900);
}

.mobile-menu__sub-link span {
  font-size: 13px;
  font-weight: 760;
  line-height: 1.35;
}

.mobile-menu__sub-link.is-active {
  color: var(--color-accent-600);
}

.mobile-menu__actions {
  display: grid;
  flex: 0 0 auto;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5) max(var(--space-5), env(safe-area-inset-bottom));
  border-top: 1px solid var(--color-border);
  background: rgb(255 253 248 / 96%);
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

@media (prefers-reduced-motion: reduce) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active,
  .mobile-menu-enter-active .mobile-menu__panel,
  .mobile-menu-leave-active .mobile-menu__panel {
    transition-duration: 0.01ms;
  }
}
</style>

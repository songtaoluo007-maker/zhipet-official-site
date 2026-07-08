<template>
  <header class="app-header" :class="{ 'is-scrolled': scrolled }">
    <BaseContainer class="app-header__inner" tag="div" width="wide">
      <NuxtLink class="app-header__brand" to="/" aria-label="知宠 ZHIPET 首页">
        <span class="app-header__brand-text">
          <span>知宠</span>
          <strong>ZHIPET</strong>
        </span>
      </NuxtLink>

      <nav class="app-header__nav" aria-label="主导航" @keydown.esc="closeFocusedDropdown">
        <ul class="app-header__nav-list">
          <li
            v-for="item in mainNavigation"
            :key="item.href"
            class="app-header__nav-item"
            :class="{ 'has-dropdown': hasChildren(item), 'is-open': isDropdownOpen(item) }"
            @mouseenter="openDropdown(item)"
            @mouseleave="scheduleCloseDropdown"
            @focusin="openDropdown(item)"
            @focusout="handleNavItemFocusout"
          >
            <NuxtLink
              class="app-header__link"
              :class="{ 'is-active': isActive(item.href) }"
              :to="item.href"
              :aria-current="isCurrent(item.href) ? 'page' : undefined"
              :aria-controls="hasChildren(item) ? navigationPanelId(item.href) : undefined"
              :aria-expanded="hasChildren(item) ? isDropdownOpen(item) : undefined"
              @click="handleNavigationClick"
            >
              <span>{{ item.label }}</span>
            </NuxtLink>

            <div
              v-if="item.children?.length"
              :id="navigationPanelId(item.href)"
              class="app-header__dropdown"
              :aria-label="`${item.label}子级页面`"
              @mouseenter="openDropdown(item)"
              @mouseleave="scheduleCloseDropdown"
            >
              <ul>
                <li v-for="child in item.children" :key="child.href">
                  <NuxtLink
                    class="app-header__dropdown-link"
                    :class="{ 'is-active': isChildActive(child.href, item.href) }"
                    :to="child.href"
                    :aria-current="isCurrent(child.href) ? 'page' : undefined"
                    @click="handleNavigationClick"
                  >
                    <span>{{ child.label }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>

      <div class="app-header__actions">
        <BaseButton to="/login" variant="secondary" size="sm">登录 / 注册</BaseButton>
      </div>

      <BaseIconButton
        class="app-header__menu-button"
        label="打开导航"
        variant="bordered"
        @click="menuOpen = true"
      >
        <BaseIcon name="menu" />
      </BaseIconButton>
    </BaseContainer>
  </header>

  <MobileMenu :open="menuOpen" :items="mainNavigation" @close="menuOpen = false" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseIconButton from '~/components/base/BaseIconButton.vue'
import MobileMenu from '~/components/layout/MobileMenu.vue'
import type { NavigationItem } from '~/types/site'

const route = useRoute()
const { mainNavigation } = useNavigation()

const scrolled = ref(false)
const menuOpen = ref(false)
const openDropdownHref = ref<string | null>(null)
let closeDropdownTimer: ReturnType<typeof setTimeout> | undefined

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

const hasChildren = (item: NavigationItem) => Boolean(item.children?.length)

const navigationPanelId = (href: string) => `nav-panel-${href.replaceAll(/[^a-z0-9]+/gi, '-')}`

const isDropdownOpen = (item: NavigationItem) => openDropdownHref.value === item.href

const clearCloseDropdownTimer = () => {
  if (!closeDropdownTimer) {
    return
  }

  clearTimeout(closeDropdownTimer)
  closeDropdownTimer = undefined
}

const openDropdown = (item: NavigationItem) => {
  clearCloseDropdownTimer()
  openDropdownHref.value = hasChildren(item) ? item.href : null
}

const closeDropdown = () => {
  clearCloseDropdownTimer()
  openDropdownHref.value = null
}

const scheduleCloseDropdown = () => {
  clearCloseDropdownTimer()

  closeDropdownTimer = setTimeout(() => {
    openDropdownHref.value = null
    closeDropdownTimer = undefined
  }, 240)
}

const closeFocusedDropdown = () => {
  closeDropdown()

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

const handleNavigationClick = () => {
  closeFocusedDropdown()
}

const handleNavItemFocusout = (event: FocusEvent) => {
  const currentTarget = event.currentTarget
  const relatedTarget = event.relatedTarget

  if (!(currentTarget instanceof HTMLElement)) {
    closeDropdown()
    return
  }

  if (relatedTarget instanceof Node && currentTarget.contains(relatedTarget)) {
    return
  }

  closeDropdown()
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  clearCloseDropdownTimer()
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 76px;
  border-bottom: 1px solid transparent;
  background: rgb(251 248 242 / 82%);
  backdrop-filter: blur(18px);
  transition:
    background var(--motion-duration-base) var(--motion-ease-out),
    border-color var(--motion-duration-base) var(--motion-ease-out),
    box-shadow var(--motion-duration-base) var(--motion-ease-out);
}

.app-header.is-scrolled {
  border-bottom: 1px solid var(--color-border);
  background: rgb(251 248 242 / 96%);
  box-shadow: 0 12px 34px rgb(47 36 27 / 5%);
}

.app-header__inner {
  display: flex;
  height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

.app-header__brand {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-brand-900);
}

.app-header__brand-text {
  display: flex;
  align-items: baseline;
  gap: 12px;
  line-height: 1;
}

.app-header__brand-text span {
  font-size: 28px;
  font-weight: 900;
}

.app-header__brand-text strong {
  color: var(--color-brand-900);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.26em;
}

.app-header__actions {
  display: flex;
  align-items: center;
}

.app-header__nav {
  height: 100%;
}

.app-header__nav-list {
  display: flex;
  height: 100%;
  align-items: center;
  gap: var(--space-6);
  padding: 0;
  margin: 0;
  list-style: none;
}

.app-header__nav-item {
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
}

.app-header__nav-item.has-dropdown::after {
  position: absolute;
  right: -14px;
  bottom: -14px;
  left: -14px;
  height: 20px;
  content: '';
}

.app-header__nav-item.is-open {
  z-index: 2;
}

.app-header__actions {
  gap: var(--space-2);
}

.app-header__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) 2px;
  color: var(--color-coffee-900);
  font-size: 15px;
  font-weight: 650;
}

.app-header__link::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: var(--radius-pill);
  background: var(--color-brand-900);
  content: '';
  opacity: 0;
  transform: scaleX(0.35);
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.app-header__link:hover,
.app-header__link.is-active {
  color: var(--color-brand-900);
}

.app-header__link:hover::after {
  opacity: 0.5;
  transform: scaleX(0.68);
}

.app-header__link.is-active::after {
  opacity: 1;
  transform: scaleX(1);
}

.app-header__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  display: grid;
  width: min(224px, calc(100vw - 48px));
  padding: 8px;
  border: 1px solid rgb(226 216 203 / 86%);
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgb(255 253 248 / 96%), rgb(246 241 233 / 94%)),
    var(--color-surface);
  box-shadow:
    0 16px 42px rgb(47 36 27 / 10%),
    inset 0 1px 0 rgb(255 255 255 / 64%);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -8px);
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out),
    visibility var(--motion-duration-fast) var(--motion-ease-out);
  visibility: hidden;
}

.app-header__nav-item:nth-last-child(-n + 2) .app-header__dropdown {
  right: 0;
  left: auto;
  transform: translateY(-8px);
}

.app-header__nav-item.is-open .app-header__dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
  visibility: visible;
}

.app-header__nav-item:nth-last-child(-n + 2).is-open .app-header__dropdown {
  transform: translateY(0);
}

.app-header__dropdown ul {
  display: grid;
  gap: 2px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.app-header__dropdown-link {
  display: flex;
  min-height: 40px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--color-coffee-900);
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    background var(--motion-duration-fast) var(--motion-ease-out),
    color var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.app-header__dropdown-link span {
  overflow-wrap: anywhere;
  color: var(--color-brand-900);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.app-header__dropdown-link:hover,
.app-header__dropdown-link:focus-visible,
.app-header__dropdown-link.is-active {
  border-color: rgb(200 138 56 / 30%);
  color: var(--color-brand-900);
  background: rgb(255 253 248 / 72%);
  transform: translateY(-1px);
}

.app-header__dropdown-link:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: var(--focus-ring);
}

.app-header__menu-button {
  display: none;
}

@media (max-width: 899px) {
  .app-header__nav,
  .app-header__actions {
    display: none;
  }

  .app-header__menu-button {
    display: inline-flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header,
  .app-header__link::after,
  .app-header__dropdown,
  .app-header__dropdown-link {
    transition-duration: 0.01ms;
  }

  .app-header__dropdown-link:hover,
  .app-header__dropdown-link:focus-visible,
  .app-header__dropdown-link.is-active {
    transform: none;
  }
}
</style>

<template>
  <header class="app-header" :class="{ 'is-scrolled': scrolled }">
    <BaseContainer class="app-header__inner" tag="div" width="wide">
      <NuxtLink class="app-header__brand" to="/" aria-label="知宠 ZHIPET 首页">
        <span class="app-header__mark" aria-hidden="true">知</span>
        <span class="app-header__brand-text">
          <span>知宠</span>
          <strong>ZHIPET</strong>
        </span>
      </NuxtLink>

      <nav class="app-header__nav" aria-label="主导航">
        <NuxtLink
          v-for="item in mainNavigation"
          :key="item.href"
          class="app-header__link"
          :class="{ 'is-active': isActive(item.href) }"
          :to="item.href"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="app-header__actions">
        <BaseButton to="/contact" variant="secondary" size="sm">联系我们</BaseButton>
        <BaseButton to="/demo" size="sm">预约演示</BaseButton>
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

    <MobileMenu :open="menuOpen" :items="mainNavigation" @close="menuOpen = false" />
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseIconButton from '~/components/base/BaseIconButton.vue'
import MobileMenu from '~/components/layout/MobileMenu.vue'

const route = useRoute()
const { mainNavigation } = useNavigation()

const scrolled = ref(false)
const menuOpen = ref(false)

const isActive = (href: string) => {
  if (href === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(href)
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 72px;
  background: rgb(250 248 244 / 92%);
  transition:
    border-color var(--motion-duration-base) var(--motion-ease-out),
    backdrop-filter var(--motion-duration-base) var(--motion-ease-out);
}

.app-header.is-scrolled {
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(14px);
}

.app-header__inner {
  display: flex;
  height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-brand-900);
}

.app-header__mark {
  display: inline-flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--color-surface);
  background: var(--color-brand-900);
  font-weight: 800;
}

.app-header__brand-text {
  display: grid;
  line-height: 1.1;
}

.app-header__brand-text span {
  font-size: 18px;
  font-weight: 800;
}

.app-header__brand-text strong {
  color: var(--color-text-secondary);
  font-size: 11px;
  letter-spacing: 0.1em;
}

.app-header__nav,
.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.app-header__link {
  position: relative;
  padding: var(--space-2) 0;
  color: var(--color-text-secondary);
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
  background: var(--color-accent-600);
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

.app-header__link.is-active::after {
  opacity: 1;
  transform: scaleX(1);
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
</style>

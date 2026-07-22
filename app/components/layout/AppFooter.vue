<template>
  <footer class="app-footer">
    <BaseContainer width="wide">
      <div class="app-footer__top">
        <div class="app-footer__brand">
          <NuxtLink class="app-footer__logo" to="/">
            <span class="app-footer__logo-text">
              <span>知宠</span>
              <strong>ZHIPET</strong>
            </span>
          </NuxtLink>
          <p>{{ site.description }}</p>
        </div>

        <div class="app-footer__groups app-footer__groups--desktop">
          <section v-for="group in footerGroups" :key="group.title" class="app-footer__group">
            <h2>{{ group.title }}</h2>
            <ul>
              <li v-for="link in group.links" :key="link.href">
                <NuxtLink :to="link.href">{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </section>
        </div>

        <div class="app-footer__groups app-footer__groups--mobile">
          <section
            v-for="group in mobileFooterGroups"
            :key="group.title"
            class="app-footer__group"
          >
            <h2>{{ group.title }}</h2>
            <ul>
              <li v-for="link in group.links" :key="link.href">
                <NuxtLink :to="link.href">{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div class="app-footer__contact">
        <span>© 2026 {{ site.contact.teamName }}</span>
        <span>{{ site.descriptor }}</span>
        <a :href="`mailto:${site.contact.email}`">
          {{ site.contact.email }}
        </a>
        <span v-if="site.contact.registrationNumber">
          备案：{{ site.contact.registrationNumber }}
        </span>
      </div>
    </BaseContainer>
  </footer>
</template>

<script setup lang="ts">
import BaseContainer from '~/components/base/BaseContainer.vue'

const site = useSiteConfig()
const { footerGroups, mobileFooterGroups } = useNavigation()
</script>

<style scoped lang="scss">
.app-footer {
  padding-block: var(--space-8) var(--space-5);
  border-top: 1px solid var(--color-border);
  background:
    radial-gradient(circle at 12% 0%, rgb(232 200 148 / 20%), transparent 28%),
    linear-gradient(180deg, rgb(255 255 255 / 72%), var(--color-bg));
  color: var(--color-text-secondary);
}

.app-footer__top {
  display: grid;
  grid-template-columns: minmax(240px, 360px) 1fr;
  gap: var(--space-8);
}

.app-footer__logo {
  position: relative;
  display: inline-flex;
  width: fit-content;
  gap: var(--space-2);
  align-items: center;
  color: var(--color-brand-900);
  line-height: 1.1;
}

.app-footer__logo-text {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.app-footer__logo-text span {
  font-size: 26px;
  font-weight: 900;
}

.app-footer__logo-text strong {
  color: var(--color-brand-900);
  font-size: 13px;
  letter-spacing: 0.24em;
}

.app-footer__brand {
  display: grid;
  gap: var(--space-4);
}

.app-footer__brand p {
  max-width: 320px;
  color: var(--color-text-secondary);
}

.app-footer__groups {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-5);
}

.app-footer__group h2 {
  margin-bottom: var(--space-4);
  color: var(--color-brand-900);
  font-size: 15px;
}

.app-footer__group ul {
  display: grid;
  gap: var(--space-3);
  padding: 0;
  margin: 0;
  list-style: none;
}

.app-footer__group a {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.app-footer__group a:hover {
  color: var(--color-brand-900);
}

.app-footer__group a:focus-visible,
.app-footer__logo:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
  outline-offset: 4px;
}

.app-footer__contact {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3) var(--space-5);
  padding-top: var(--space-6);
  margin-top: var(--space-8);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
}

.app-footer__groups--mobile {
  display: none;
}

.app-footer__contact a {
  color: inherit;
}

.app-footer__contact a:hover {
  color: var(--color-brand-900);
}

@media (max-width: 899px) {
  .app-footer__top {
    grid-template-columns: 1fr;
  }

  .app-footer__groups--desktop {
    display: none;
  }

  .app-footer__groups--mobile {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .app-footer {
    padding-block: var(--space-6) var(--space-4);
  }

  .app-footer__top {
    gap: var(--space-6);
  }

  .app-footer__groups--mobile {
    gap: var(--space-4);
  }

  .app-footer__group h2 {
    margin-bottom: var(--space-3);
  }

  .app-footer__group ul {
    gap: var(--space-2);
  }

  .app-footer__brand p {
    font-size: 14px;
  }

  .app-footer__contact {
    display: grid;
    gap: var(--space-2);
    margin-top: var(--space-6);
  }
}
</style>

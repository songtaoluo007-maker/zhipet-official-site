<template>
  <footer class="app-footer">
    <BaseContainer width="wide">
      <div class="app-footer__top">
        <div class="app-footer__brand">
          <NuxtLink class="app-footer__logo" to="/">
            <span>知宠</span>
            <strong>ZHIPET</strong>
          </NuxtLink>
          <p>{{ site.description }}</p>
        </div>

        <div class="app-footer__groups">
          <section v-for="group in footerGroups" :key="group.title" class="app-footer__group">
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
        <span>电话：{{ site.contact.phone }}</span>
        <span>邮箱：{{ site.contact.email }}</span>
        <span>地址：{{ site.contact.address }}</span>
        <span>备案：{{ site.contact.registrationNumber }}</span>
      </div>
    </BaseContainer>
  </footer>
</template>

<script setup lang="ts">
import BaseContainer from '~/components/base/BaseContainer.vue'

const site = useSiteConfig()
const { footerGroups } = useNavigation()
</script>

<style scoped lang="scss">
.app-footer {
  padding-block: var(--space-9) var(--space-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-brand-900);
  color: rgb(255 255 255 / 78%);
}

.app-footer__top {
  display: grid;
  grid-template-columns: minmax(240px, 360px) 1fr;
  gap: var(--space-8);
}

.app-footer__logo {
  display: grid;
  width: fit-content;
  gap: 2px;
  color: var(--color-surface);
  line-height: 1.1;
}

.app-footer__logo span {
  font-size: 24px;
  font-weight: 800;
}

.app-footer__logo strong {
  color: rgb(255 255 255 / 58%);
  font-size: 12px;
  letter-spacing: 0.1em;
}

.app-footer__brand {
  display: grid;
  gap: var(--space-4);
}

.app-footer__brand p {
  max-width: 320px;
  color: rgb(255 255 255 / 64%);
}

.app-footer__groups {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-5);
}

.app-footer__group h2 {
  margin-bottom: var(--space-4);
  color: var(--color-surface);
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
  color: rgb(255 255 255 / 62%);
  font-size: 14px;
}

.app-footer__group a:hover {
  color: var(--color-surface);
}

.app-footer__contact {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3) var(--space-5);
  padding-top: var(--space-6);
  margin-top: var(--space-8);
  border-top: 1px solid rgb(255 255 255 / 12%);
  color: rgb(255 255 255 / 55%);
  font-size: 13px;
}

@media (max-width: 899px) {
  .app-footer__top {
    grid-template-columns: 1fr;
  }

  .app-footer__groups {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .app-footer__groups {
    grid-template-columns: 1fr;
  }
}
</style>

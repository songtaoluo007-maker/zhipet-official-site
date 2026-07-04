<template>
  <footer class="app-footer">
    <BaseContainer width="wide">
      <div class="app-footer__top">
        <div class="app-footer__brand">
          <NuxtLink class="app-footer__logo" to="/">
            <span class="app-footer__mark" aria-hidden="true">知</span>
            <span class="app-footer__logo-text">
              <span>知宠</span>
              <strong>ZHIPET</strong>
            </span>
          </NuxtLink>
          <p>{{ site.description }}</p>
          <div class="app-footer__notice" role="note">
            <span>信息边界</span>
            <p>官网未确认资料均以“待项目方确认”标记，不展示虚构客户、资质或联系方式。</p>
          </div>
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
  background:
    linear-gradient(135deg, rgb(36 29 24), rgb(47 36 27) 56%, rgb(68 51 38)),
    var(--color-brand-900);
  color: rgb(255 255 255 / 78%);
}

.app-footer__top {
  display: grid;
  grid-template-columns: minmax(240px, 360px) 1fr;
  gap: var(--space-8);
}

.app-footer__logo {
  display: inline-flex;
  width: fit-content;
  gap: var(--space-3);
  align-items: center;
  color: var(--color-surface);
  line-height: 1.1;
}

.app-footer__mark {
  display: inline-flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 10px;
  background: rgb(255 255 255 / 10%);
  font-weight: 800;
}

.app-footer__logo-text {
  display: grid;
  gap: 2px;
}

.app-footer__logo-text span {
  font-size: 24px;
  font-weight: 800;
}

.app-footer__logo-text strong {
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

.app-footer__notice {
  display: grid;
  max-width: 360px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 6%);
}

.app-footer__notice span {
  color: var(--color-accent-300);
  font-size: 13px;
  font-weight: 750;
}

.app-footer__notice p {
  margin: 0;
  color: rgb(255 255 255 / 66%);
  font-size: 13px;
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

.app-footer__group a:focus-visible,
.app-footer__logo:focus-visible {
  box-shadow: 0 0 0 3px rgb(232 200 148 / 30%);
  outline: 2px solid transparent;
  outline-offset: 4px;
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

<template>
  <footer class="app-footer">
    <BaseContainer width="wide">
      <div class="app-footer__top">
        <div class="app-footer__brand">
          <NuxtLink class="app-footer__logo" to="/">
            <span class="app-footer__spark" aria-hidden="true" />
            <span class="app-footer__logo-text">
              <span>知宠</span>
              <strong>ZHIPET</strong>
            </span>
          </NuxtLink>
          <p>{{ site.description }}</p>
          <div class="app-footer__notice" role="note">
            <span>让爱更安心</span>
            <p>如信息尚未确认，将以“待项目方确认”标记，不展示虚构客户、资质或联系方式。</p>
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

.app-footer__spark {
  position: absolute;
  top: -5px;
  left: 2px;
  width: 5px;
  height: 10px;
  border-radius: var(--radius-pill);
  background: var(--color-accent-500);
  transform: rotate(24deg);
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

.app-footer__notice {
  display: grid;
  max-width: 360px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 62%);
}

.app-footer__notice span {
  color: var(--color-brand-900);
  font-size: 13px;
  font-weight: 750;
}

.app-footer__notice p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
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

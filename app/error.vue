<script setup lang="ts">
import type { NuxtError } from '#app'
import { computed } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)
const pageTitle = computed(() => (isNotFound.value ? '页面暂未找到' : '页面暂时不可用'))
const pageDescription = computed(() =>
  isNotFound.value
    ? '当前访问的页面可能已调整、暂未发布，或链接地址有误。可以回到首页继续了解知宠。'
    : '当前页面暂时无法正常显示，请稍后再试，或通过咨询与反馈页面告知项目成员。',
)

useSeoMeta({
  title: () => `${pageTitle.value} | 知宠 ZHIPET`,
  description: () => pageDescription.value,
  robots: 'noindex',
})
</script>

<template>
  <NuxtLayout>
    <section class="error-page" aria-labelledby="error-title">
      <BaseContainer class="error-page__inner" width="narrow">
        <div class="error-page__code" aria-hidden="true">
          {{ statusCode }}
        </div>
        <h1 id="error-title">{{ pageTitle }}</h1>
        <p>{{ pageDescription }}</p>
        <div class="error-page__actions" aria-label="页面导航">
          <BaseButton to="/" size="lg" @click="clearError()">
            返回首页
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
          <BaseButton to="/products" variant="secondary" size="lg" @click="clearError()">
            查看产品中心
          </BaseButton>
          <BaseButton to="/help" variant="ghost" size="lg" @click="clearError()">
            咨询与反馈
          </BaseButton>
        </div>
        <ul class="error-page__quick-links" aria-label="推荐访问">
          <li>
            <BaseIcon name="home" aria-hidden="true" />
            <span>首页</span>
          </li>
          <li>
            <BaseIcon name="collar" aria-hidden="true" />
            <span>产品中心</span>
          </li>
          <li>
            <BaseIcon name="mail" aria-hidden="true" />
            <span>咨询与交流</span>
          </li>
        </ul>
      </BaseContainer>
    </section>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.error-page {
  display: grid;
  min-height: 62vh;
  align-items: center;
  padding-block: var(--space-9);
  background:
    linear-gradient(135deg, rgb(246 234 216 / 54%), transparent 42%),
    var(--color-bg);
}

.error-page__inner {
  display: grid;
  justify-items: start;
  gap: var(--space-4);
}

.error-page__code {
  display: inline-flex;
  min-width: 76px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(200 138 56 / 28%);
  border-radius: var(--radius-button);
  color: var(--color-accent-600);
  background: var(--color-surface);
  font-size: 18px;
  font-weight: 800;
}

.error-page h1 {
  max-width: 720px;
  color: var(--color-brand-900);
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.error-page p {
  max-width: 640px;
  color: var(--color-text-secondary);
  font-size: 18px;
}

.error-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.error-page__quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: 0;
  margin: var(--space-5) 0 0;
  list-style: none;
}

.error-page__quick-links li {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  min-height: 40px;
  padding: 0 var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: rgb(255 255 255 / 78%);
  font-size: 14px;
  font-weight: 700;
}

.error-page__quick-links svg {
  color: var(--color-accent-600);
}

@media (max-width: 640px) {
  .error-page {
    min-height: 58vh;
    padding-block: var(--space-7);
  }

  .error-page h1 {
    font-size: 36px;
  }

  .error-page p {
    font-size: 15px;
  }

  .error-page__actions,
  .error-page__actions :deep(.base-button) {
    width: 100%;
  }
}
</style>

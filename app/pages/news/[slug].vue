<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'

const route = useRoute()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const legacySlugMap: Record<string, string> = {
  'product-direction': 'safety-first',
  'scenario-research': 'continuous-observation',
  'brand-progress': 'product-journey',
}
const researchPath = computed(() => `/research/${legacySlugMap[slugParam ?? ''] ?? 'health-signals'}`)

useSeoMeta({
  title: '文章已迁移至健康研究院 | 知宠 ZHIPET',
  description: '知宠旧资讯详情入口已迁移至健康研究院文章详情页。',
  ogTitle: '文章已迁移至健康研究院 | 知宠 ZHIPET',
  ogDescription: '请访问新的健康研究院文章地址。',
  ogType: 'article',
})

onMounted(() => {
  window.setTimeout(() => {
    void navigateTo(researchPath.value, { replace: true })
  }, 600)
})
</script>

<template>
  <div class="news-redirect-page">
    <BaseContainer class="news-redirect-page__inner" width="narrow">
      <BaseTag tone="concept">文章入口已迁移</BaseTag>
      <h1>这篇内容已迁移至健康研究院</h1>
      <p>旧资讯详情链接仍保留兼容访问。健康研究院将承载新的文章详情、风险边界提示和相关阅读。</p>
      <BaseButton :to="researchPath" size="lg">
        前往新文章
        <template #iconRight>
          <BaseIcon name="arrow-right" />
        </template>
      </BaseButton>
    </BaseContainer>
  </div>
</template>

<style scoped lang="scss">
.news-redirect-page {
  min-height: 58vh;
  display: grid;
  align-items: center;
  padding-block: var(--space-9);
}

.news-redirect-page__inner {
  display: grid;
  gap: var(--space-4);
}

.news-redirect-page h1 {
  font-size: 46px;
  line-height: 1.12;
  letter-spacing: 0;
}

.news-redirect-page p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

@media (max-width: 560px) {
  .news-redirect-page {
    padding-block: var(--space-7);
  }

  .news-redirect-page h1 {
    font-size: 34px;
  }

  .news-redirect-page p {
    font-size: 15px;
  }
}
</style>

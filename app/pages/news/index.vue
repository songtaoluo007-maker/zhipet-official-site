<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'

useSeoMeta({
  title: '资讯中心已升级为健康研究院 | 知宠 ZHIPET',
  description: '知宠资讯中心已升级为健康研究院，旧入口保留为兼容页面。',
  ogTitle: '资讯中心已升级为健康研究院 | 知宠 ZHIPET',
  ogDescription: '请访问知宠健康研究院查看最新内容方向。',
  ogType: 'website',
})

onMounted(() => {
  window.setTimeout(() => {
    void navigateTo('/research', { replace: true })
  }, 600)
})
</script>

<template>
  <div class="news-redirect-page">
    <BaseContainer class="news-redirect-page__inner" width="narrow">
      <BaseTag tone="concept">入口已升级</BaseTag>
      <h1>资讯中心已升级为健康研究院</h1>
      <p>为了更准确承载宠物健康观察、AI 状态解释和产品思考内容，旧资讯中心入口已迁移到健康研究院。</p>
      <BaseButton to="/research" size="lg">
        前往健康研究院
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

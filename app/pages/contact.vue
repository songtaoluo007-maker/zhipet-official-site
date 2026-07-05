<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'

useSeoMeta({
  title: '联系入口已迁移 | 知宠 ZHIPET',
  description: '知宠联系入口已迁移至帮助中心与预约演示，真实联系方式待项目方确认。',
  ogTitle: '联系入口已迁移 | 知宠 ZHIPET',
  ogDescription: '请访问帮助中心或预约演示。',
  ogType: 'website',
})

onMounted(() => {
  window.setTimeout(() => {
    void navigateTo('/help', { replace: true })
  }, 600)
})
</script>

<template>
  <div class="bridge-page">
    <BaseContainer class="bridge-page__inner" width="narrow">
      <BaseTag tone="concept">入口已调整</BaseTag>
      <h1>联系入口已并入帮助中心</h1>
      <p>电话、邮箱、地址和客服渠道待项目方确认。当前可通过帮助中心查看 FAQ，或通过预约演示整理需求。</p>
      <div class="bridge-page__actions">
        <BaseButton to="/help">
          前往帮助中心
          <template #iconRight>
            <BaseIcon name="arrow-right" />
          </template>
        </BaseButton>
        <BaseButton to="/demo" variant="secondary">预约演示</BaseButton>
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped lang="scss">
.bridge-page {
  min-height: 58vh;
  display: grid;
  align-items: center;
  padding-block: var(--space-9);
}

.bridge-page__inner {
  display: grid;
  gap: var(--space-4);
}

.bridge-page h1 {
  font-size: 46px;
  line-height: 1.12;
  letter-spacing: 0;
}

.bridge-page p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.bridge-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 560px) {
  .bridge-page {
    padding-block: var(--space-7);
  }

  .bridge-page h1 {
    font-size: 34px;
  }

  .bridge-page p {
    font-size: 15px;
  }

  .bridge-page__actions :deep(.base-button) {
    width: 100%;
  }
}
</style>

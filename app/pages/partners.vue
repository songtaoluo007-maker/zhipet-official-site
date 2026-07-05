<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'

useSeoMeta({
  title: '合作入口已迁移 | 知宠 ZHIPET',
  description: '知宠合作伙伴入口已迁移至解决方案与预约演示，不展示未确认合作机构。',
  ogTitle: '合作入口已迁移 | 知宠 ZHIPET',
  ogDescription: '请访问解决方案或预约演示了解合作路径。',
  ogType: 'website',
})

onMounted(() => {
  window.setTimeout(() => {
    void navigateTo('/solutions', { replace: true })
  }, 600)
})
</script>

<template>
  <div class="bridge-page">
    <BaseContainer class="bridge-page__inner" width="narrow">
      <BaseTag tone="concept">入口已调整</BaseTag>
      <h1>合作内容已并入解决方案</h1>
      <p>在真实合作资料确认前，知宠不展示合作机构、客户 Logo 或落地数据。合作路径请先从解决方案或预约演示进入。</p>
      <div class="bridge-page__actions">
        <BaseButton to="/solutions">
          前往解决方案
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

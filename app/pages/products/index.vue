<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { homeProducts } from '~/data/home'
import type { IconName } from '~/types/ui'

const { register } = useScrollReveal()

const productPathways: Array<{
  id: string
  icon: IconName
  label: string
  title: string
  description: string
}> = [
  {
    id: 'sense',
    icon: 'collar',
    label: '01',
    title: '先获得日常信号',
    description: '智能挂件负责探索声音、活动和安全相关变化的连续记录。',
  },
  {
    id: 'understand',
    icon: 'sparkles',
    label: '02',
    title: '再形成可能判断',
    description: 'PetSense 将多模态线索转化为带依据和不确定性的状态提示。',
  },
  {
    id: 'act',
    icon: 'phone',
    label: '03',
    title: '最后承接到行动',
    description: '知宠 App 与平台把提示落到记录、提醒、协作和服务连接中。',
  },
]

const productDetailPath = (id: string) => {
  if (id === 'zhipet-app') {
    return '/products/app'
  }

  return `/products/${id}`
}

useSeoMeta({
  title: '产品中心 | 知宠 ZHIPET',
  description:
    '知宠 ZHIPET 产品中心，展示智能挂件、知宠 App 与健康管理平台的当前产品方向。真实参数和上线状态以项目方确认为准。',
  ogTitle: '产品中心 | 知宠 ZHIPET',
  ogDescription: '展示智能挂件、用户端 App 与健康管理平台的当前产品方向。',
  ogType: 'website',
})
</script>

<template>
  <div class="products-page">
    <section class="products-hero" aria-labelledby="products-title">
      <BaseContainer class="products-hero__inner" width="wide">
        <div class="products-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>产品中心</span>
          </nav>
          <h1 id="products-title">产品中心</h1>
          <p>
            知宠第一阶段围绕智能挂件、知宠 App
            和健康管理平台展开产品定义与场景验证。未确认产品参数和上线状态均以项目方资料为准。
          </p>
          <div class="products-hero__actions" aria-label="产品中心主要操作">
            <BaseButton to="/demo" size="lg">
              预约产品演示
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="/ai-pet-understanding" variant="text" size="lg">
              了解 AI 宠物理解
            </BaseButton>
          </div>
        </div>
        <aside class="products-hero__visual" aria-label="产品阶段概览">
          <BaseImage
            src="/images/concepts/collar-ecosystem.svg"
            alt="知宠智能设备、App 和平台协同概念视觉"
            aspect-ratio="4 / 3"
            radius="lg"
            priority
            concept
            label-placement="below"
          />
          <div class="products-hero__status">
            <span>当前公开口径</span>
            <strong>产品定义与场景验证中</strong>
            <p>参数、上线节奏和正式能力范围均待项目方确认。</p>
          </div>
        </aside>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="products-section product-path-section"
      width="wide"
      aria-labelledby="product-path-title"
    >
      <SectionHeading
        id="product-path-title"
        title="产品链路怎么选"
        description="先看入口设备，再看 AI 理解方式，最后确认家庭或机构侧如何承接。"
      />
      <ol class="product-path-list">
        <li v-for="item in productPathways" :key="item.id">
          <span class="product-path-list__index">{{ item.label }}</span>
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ol>
    </BaseContainer>

    <BaseContainer
      :ref="register"
      tag="section"
      class="products-section"
      width="wide"
      aria-labelledby="product-list-title"
    >
      <SectionHeading
        id="product-list-title"
        title="当前产品方向"
        description="只展示已经进入官网信息架构的产品模块，不把概念能力包装成已发布商品。"
      />
      <div class="products-list">
        <article v-for="product in homeProducts" :key="product.id" class="product-card">
          <BaseImage
            :src="product.image"
            :alt="product.alt"
            aspect-ratio="3 / 2"
            radius="lg"
            concept
            label-placement="below"
          />
          <div class="product-card__copy">
            <div class="product-card__head">
              <span class="icon-shell" aria-hidden="true">
                <BaseIcon :name="product.icon" />
              </span>
              <div>
                <h2>{{ product.name }}</h2>
                <BaseTag tone="concept">{{ product.status }}</BaseTag>
              </div>
            </div>
            <p>{{ product.summary }}</p>
            <ul>
              <li v-for="feature in product.features" :key="feature">{{ feature }}</li>
            </ul>
            <BaseButton :to="productDetailPath(product.id)" variant="text">
              查看产品详情
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
          </div>
        </article>
      </div>
    </BaseContainer>

    <CTASection
      title="需要了解知宠产品组合？"
      description="预约演示，确认当前样机能力、产品规划和适合您的合作方式。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.products-page {
  overflow: hidden;
}

.products-hero {
  padding-block: var(--space-8) var(--space-7);
}

.products-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(360px, 0.76fr);
  min-height: 420px;
  gap: var(--space-8);
  align-items: center;
}

.products-hero__copy {
  display: grid;
  gap: var(--space-4);
}

.products-hero h1 {
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.products-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
}

.products-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}

.products-hero__visual {
  position: relative;
  min-width: 0;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 86%), rgb(246 241 233 / 72%)),
    var(--color-surface-soft);
}

.products-hero__visual :deep(.base-image__frame) {
  box-shadow: 0 22px 56px rgb(47 36 27 / 8%);
}

.products-hero__status {
  position: absolute;
  right: var(--space-7);
  bottom: var(--space-8);
  display: grid;
  max-width: 280px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 88%);
}

.products-hero__status span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.products-hero__status strong {
  color: var(--color-brand-900);
  font-size: 18px;
}

.products-hero__status p {
  font-size: 13px;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 650;
}

.breadcrumb a {
  color: var(--color-text-secondary);
}

.breadcrumb a:hover {
  color: var(--color-accent-600);
}

.products-section {
  @include section-spacing;

  padding-top: var(--space-8);
}

.product-path-section {
  padding-top: var(--space-6);
}

.product-path-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 0;
  margin: 0;
  border-block: 1px solid var(--color-border);
  list-style: none;
}

.product-path-list li {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-5);
  border-right: 1px solid var(--color-border);
}

.product-path-list li:last-child {
  border-right: 0;
}

.product-path-list__index {
  position: absolute;
  top: var(--space-5);
  right: var(--space-5);
  color: var(--color-accent-300);
  font-size: 28px;
  font-weight: 850;
  line-height: 1;
}

.product-path-list h2 {
  padding-right: var(--space-8);
  margin-bottom: var(--space-2);
  font-size: 20px;
}

.product-path-list p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.products-list {
  display: grid;
  gap: var(--space-6);
}

.product-card {
  display: grid;
  grid-template-columns: minmax(320px, 0.78fr) minmax(0, 0.9fr);
  gap: var(--space-6);
  align-items: center;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.product-card:hover,
.product-card:focus-within {
  border-color: rgb(200 138 56 / 45%);
  transform: translateY(-2px);
}

.product-card:nth-child(even) .base-image {
  order: 2;
}

.product-card__copy {
  display: grid;
  gap: var(--space-4);
}

.product-card__head {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.product-card h2 {
  margin-bottom: var(--space-2);
}

.product-card p {
  color: var(--color-text-secondary);
}

.product-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.product-card li {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface-soft);
  font-size: 13px;
  font-weight: 650;
}

.icon-shell {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  color: var(--color-accent-600);
  background: var(--color-accent-100);
  font-size: 22px;
}

@media (max-width: 960px) {
  .products-hero__inner,
  .product-card {
    grid-template-columns: 1fr;
  }

  .products-hero__inner {
    min-height: auto;
  }

  .product-path-list {
    grid-template-columns: 1fr;
  }

  .product-path-list li {
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }

  .product-path-list li:last-child {
    border-bottom: 0;
  }

  .product-card:nth-child(even) .base-image {
    order: initial;
  }
}

@media (max-width: 560px) {
  .products-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .products-hero__inner {
    min-height: 280px;
  }

  .products-hero h1 {
    font-size: 36px;
  }

  .products-hero p {
    font-size: 15px;
  }

  .products-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .products-hero__visual {
    padding: var(--space-4);
  }

  .products-hero__status {
    position: static;
    max-width: none;
    margin-top: var(--space-3);
  }

  .product-path-list li {
    grid-template-columns: 1fr;
  }

  .product-path-list h2 {
    padding-right: var(--space-7);
  }

  .product-card {
    padding: var(--space-5);
  }

  .product-card__head {
    display: grid;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card:hover,
  .product-card:focus-within {
    transform: none;
  }
}
</style>

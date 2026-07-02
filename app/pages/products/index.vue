<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { homeProducts } from '~/data/home'

const { register } = useScrollReveal()

const productDetailPath = (id: string) => {
  if (id === 'zhipet-app') {
    return '/products/app'
  }

  return `/products/${id}`
}

useSeoMeta({
  title: '产品中心 | 知宠 ZHIPET',
  description:
    '知宠 ZHIPET 产品中心，展示智能项圈、知宠 App 与健康管理平台的当前产品方向。真实参数和上线状态以项目方确认为准。',
  ogTitle: '产品中心 | 知宠 ZHIPET',
  ogDescription: '展示智能硬件、用户端 App 与健康管理平台的当前产品方向。',
  ogType: 'website',
})
</script>

<template>
  <div class="products-page">
    <section class="products-hero" aria-labelledby="products-title">
      <BaseContainer class="products-hero__inner" width="wide">
        <div>
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>产品中心</span>
          </nav>
          <h1 id="products-title">产品中心</h1>
          <p>
            知宠第一阶段围绕智能项圈、知宠 App
            和健康管理平台展开产品定义与场景验证。未确认产品参数和上线状态均以项目方资料为准。
          </p>
        </div>
      </BaseContainer>
    </section>

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
  min-height: 340px;
  align-items: center;
}

.products-hero h1 {
  margin-top: var(--space-4);
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.products-hero p {
  max-width: 720px;
  margin-top: var(--space-4);
  color: var(--color-text-secondary);
  font-size: 18px;
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
  .product-card {
    grid-template-columns: 1fr;
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

  .product-card {
    padding: var(--space-5);
  }

  .product-card__head {
    display: grid;
  }
}
</style>

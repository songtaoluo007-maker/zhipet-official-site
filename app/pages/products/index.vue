<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SceneFrame from '~/components/common/SceneFrame.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { productFeatureStrip, productVariants, valueLayers } from '~/data/v2'

const { register } = useScrollReveal()

useSeoMeta({
  title: '产品 | 知宠 ZHIPET',
  description:
    '知宠产品页展示一个核心主模块、两种安装方式和安全、健康、状态解读三层价值。参数与上市状态待项目方确认。',
  ogTitle: '产品 | 知宠 ZHIPET',
  ogDescription: '一个核心主模块，两种安装方式，探索宠物安全与健康趋势管理。',
  ogType: 'website',
})
</script>

<template>
  <div class="products-page">
    <section class="product-hero" aria-labelledby="products-title">
      <BaseContainer class="product-hero__inner" width="wide">
        <div class="product-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>产品</span>
          </nav>
          <BaseTag tone="concept">产品形态待项目方确认</BaseTag>
          <h1 id="products-title">一个核心主模块，两种安装方式</h1>
          <p>
            知宠 V2 以智能项圈核心模块为中心，围绕项圈一体与夹扣安装拓展体验。真实参数、量产节奏和能力范围以项目方确认为准。
          </p>
          <div class="product-hero__actions">
            <BaseButton to="#variants" size="lg">
              查看产品形态
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="/demo" variant="secondary" size="lg">预约演示</BaseButton>
          </div>
        </div>
        <SceneFrame
          class="product-hero__visual"
          src="/images/generated/pages/zhipet-product-closeup-scene.png"
          alt="犬猫与知宠智能项圈核心模块概念场景"
          aspect-ratio="16 / 10"
          object-position="center"
        >
          <ul class="product-points" aria-label="产品核心能力">
            <li>
              <BaseIcon name="shield-check" aria-hidden="true" />
              <span>安全入口</span>
            </li>
            <li>
              <BaseIcon name="heart-pulse" aria-hidden="true" />
              <span>健康趋势</span>
            </li>
            <li>
              <BaseIcon name="sparkles" aria-hidden="true" />
              <span>状态解释</span>
            </li>
          </ul>
          <div class="module-card">
            <span>核心主模块</span>
            <strong>安全 + 健康趋势 + 状态解释</strong>
            <p>硬件参数、传感器范围和上市节奏待项目方确认。</p>
          </div>
        </SceneFrame>
      </BaseContainer>
    </section>

    <BaseContainer
      id="variants"
      :ref="register"
      tag="section"
      class="products-section"
      width="wide"
      aria-labelledby="variants-title"
    >
      <SectionHeading
        id="variants-title"
        title="产品形态"
        description="先展示 V2 的产品组合逻辑，不把未确认硬件形态写成已发布商品。"
      />
      <div class="variant-grid">
        <article v-for="variant in productVariants" :key="variant.id" class="variant-card">
          <BaseTag tone="concept">{{ variant.status }}</BaseTag>
          <h2>{{ variant.title }}</h2>
          <p>{{ variant.description }}</p>
          <ul>
            <li v-for="tag in variant.tags" :key="tag">{{ tag }}</li>
          </ul>
        </article>
      </div>
    </BaseContainer>

    <section
      id="core-module"
      :ref="register"
      class="products-section core-section"
      aria-labelledby="core-title"
    >
      <BaseContainer width="wide">
        <div class="core-layout">
          <SceneFrame
            class="core-scene"
            src="/images/generated/pages/zhipet-app-profile-scene.png"
            alt="知宠智能项圈模块与安装形态概念图"
            aspect-ratio="16 / 9"
            object-position="center"
          >
            <div class="collar-spec-card">
              <span>模块化设计</span>
              <strong>一体佩戴 / 夹扣适配</strong>
              <p>材质、重量、防水等级和续航均待项目方确认。</p>
            </div>
          </SceneFrame>
          <div>
            <SectionHeading
              id="core-title"
              title="一个模块承接三层价值"
              description="核心模块不是单点功能堆叠，而是把安全、健康趋势和状态解释放进可持续的使用路径。"
              align="left"
            />
            <div class="feature-strip" aria-label="产品功能条">
              <span v-for="feature in productFeatureStrip" :key="feature">{{ feature }}</span>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="value-layers"
      :ref="register"
      tag="section"
      class="products-section"
      width="wide"
      aria-labelledby="value-title"
    >
      <SectionHeading
        id="value-title"
        title="三层价值"
        description="先解决安全入口，再长期观察健康趋势，最后用 AI 状态解释帮助用户理解下一步。"
      />
      <div class="value-grid">
        <article v-for="layer in valueLayers" :key="layer.id" class="value-card">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="layer.icon" />
          </span>
          <h2>{{ layer.title }}</h2>
          <p>{{ layer.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <BaseContainer
      :ref="register"
      tag="section"
      class="products-section boundary-panel"
      width="wide"
      aria-labelledby="product-boundary-title"
    >
      <BaseIcon name="shield-check" aria-hidden="true" />
      <div>
        <h2 id="product-boundary-title">产品发布边界</h2>
        <p>
          未确认前，不展示未验证生命体征指标、真实续航、防水等级、上市时间或价格。猫端体验将强调轻量、安全脱扣和低打扰，具体设计待项目方确认。
        </p>
      </div>
    </BaseContainer>

    <CTASection
      title="想确认哪种产品形态适合您的场景？"
      description="预约演示，了解核心模块、安装方式和当前样机验证边界。"
      secondary-label="阅读产品思考"
      secondary-to="/research/safety-first"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.products-page {
  overflow: hidden;
}

.product-hero {
  position: relative;
  isolation: isolate;
  padding-block: var(--space-8) var(--space-7);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 54%), rgb(251 248 242 / 0) 78%),
    radial-gradient(circle at 72% 18%, rgb(232 200 148 / 18%), transparent 30%);
}

.product-hero::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, var(--color-bg) 0%, rgb(251 248 242 / 72%) 44%, rgb(251 248 242 / 22%) 100%),
    url('/images/generated/pages/zhipet-product-closeup-scene.png') center / cover no-repeat;
  content: '';
  opacity: 0.16;
}

.product-hero__inner,
.core-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(380px, 0.8fr);
  gap: var(--space-8);
  align-items: center;
}

.product-hero__copy {
  display: grid;
  gap: var(--space-4);
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

.product-hero h1 {
  max-width: 760px;
  font-size: 64px;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.product-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.product-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.product-hero__visual {
  min-height: 430px;
}

.product-points {
  position: absolute;
  left: var(--space-5);
  bottom: var(--space-5);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  width: min(430px, calc(100% - 32px));
  padding: 0;
  margin: 0;
  list-style: none;
}

.product-points li {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid rgb(255 255 255 / 68%);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: rgb(255 255 255 / 82%);
  font-size: 13px;
  font-weight: 750;
  box-shadow: 0 12px 28px rgb(47 36 27 / 8%);
}

.product-points .base-icon {
  color: var(--color-sage-700);
  font-size: 18px;
}

.module-card {
  position: absolute;
  right: var(--space-7);
  bottom: var(--space-8);
  display: grid;
  max-width: 300px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 90%);
  backdrop-filter: blur(10px);
}

.module-card span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.module-card strong {
  color: var(--color-brand-900);
  font-size: 18px;
  line-height: 1.35;
}

.module-card p {
  font-size: 13px;
}

.core-scene {
  min-height: 360px;
}

.collar-spec-card {
  position: absolute;
  right: var(--space-5);
  bottom: var(--space-5);
  display: grid;
  gap: var(--space-2);
  width: min(320px, calc(100% - 32px));
  padding: var(--space-4);
  border: 1px solid rgb(255 255 255 / 72%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 86%);
  box-shadow: 0 14px 34px rgb(47 36 27 / 8%);
  backdrop-filter: blur(12px);
}

.collar-spec-card span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.collar-spec-card strong {
  color: var(--color-brand-900);
  font-size: 20px;
  line-height: 1.3;
}

.collar-spec-card p {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.products-section {
  @include section-spacing;
}

.variant-grid,
.value-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-5);
}

.variant-card,
.value-card {
  display: grid;
  align-content: start;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.variant-card h2,
.value-card h2 {
  font-size: 22px;
  line-height: 1.25;
}

.variant-card p,
.value-card p,
.boundary-panel p {
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.variant-card ul,
.feature-strip {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.variant-card li,
.feature-strip span {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface-soft);
  font-size: 13px;
  font-weight: 650;
}

.core-section {
  background: var(--color-surface-soft);
}

.icon-shell {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(86 130 103 / 22%);
  border-radius: var(--radius-button);
  color: var(--color-sage-700);
  background: var(--color-sage-100);
  font-size: 22px;
}

.value-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.boundary-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid rgb(183 121 43 / 24%);
  border-radius: var(--radius-media);
  background: var(--color-accent-100);
}

.boundary-panel .base-icon {
  color: var(--color-accent-600);
  font-size: 24px;
}

.boundary-panel h2 {
  margin-bottom: var(--space-2);
  font-size: 22px;
}

@media (max-width: 1100px) {
  .product-hero__inner,
  .core-layout,
  .variant-grid {
    grid-template-columns: 1fr;
  }

  .product-hero h1 {
    font-size: 46px;
  }
}

@media (max-width: 820px) {
  .value-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .product-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .product-hero h1 {
    font-size: 36px;
  }

  .product-hero p {
    font-size: 15px;
  }

  .product-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .variant-card,
  .value-card,
  .boundary-panel {
    padding: var(--space-4);
  }

  .product-hero__visual,
  .core-scene {
    min-height: 420px;
  }

  .module-card,
  .collar-spec-card {
    right: var(--space-4);
    bottom: var(--space-4);
    width: min(300px, calc(100% - 32px));
    max-width: none;
  }

  .product-points {
    top: var(--space-4);
    bottom: auto;
    left: var(--space-4);
    width: min(320px, calc(100% - 32px));
  }

  .boundary-panel {
    grid-template-columns: 1fr;
  }
}
</style>

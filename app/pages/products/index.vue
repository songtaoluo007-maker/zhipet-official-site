<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SceneFrame from '~/components/common/SceneFrame.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { usePublicAssetUrl } from '~/composables/usePublicAssetUrl'
import { productFeatureStrip, productVariants, valueLayers } from '~/data/v2'

const { register } = useScrollReveal()
const publicAssetUrl = usePublicAssetUrl()
const productHeroStyle = {
  '--product-hero-image': `url("${publicAssetUrl('/images/generated/pages/zhipet-product-closeup-scene.webp')}")`,
}
const featuredVariant = productVariants.find((variant) => variant.presentation === 'featured')
const alternativeVariants = productVariants.filter(
  (variant) => variant.presentation === 'alternative',
)
const futureVariant = productVariants.find((variant) => variant.presentation === 'future')

if (!featuredVariant || !futureVariant) {
  throw new Error('产品形态内容不完整')
}

useSeoMeta({
  title: '产品 | 知宠 ZHIPET',
  description: '知宠产品页展示一个核心主模块、两种安装方式和安全、健康、状态解读三层价值。',
  ogTitle: '产品 | 知宠 ZHIPET',
  ogDescription: '一个核心主模块，两种安装方式，探索宠物安全与健康趋势管理。',
  ogType: 'website',
})
</script>

<template>
  <div class="products-page">
    <section class="product-hero" :style="productHeroStyle" aria-labelledby="products-title">
      <BaseContainer class="product-hero__inner" width="wide">
        <div class="product-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>产品</span>
          </nav>
          <BaseTag tone="concept">模块化佩戴</BaseTag>
          <h1 id="products-title">一个核心主模块，两种安装方式</h1>
          <p>
            知宠 V2 以智能项圈核心模块为中心，通过项圈一体与夹扣安装适配不同佩戴场景。具体能力与参数以正式产品说明为准。
          </p>
          <div class="product-hero__actions">
            <BaseButton to="#variants" size="lg">
              查看产品形态
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="/contact" variant="secondary" size="lg">邮件联系我们</BaseButton>
          </div>
        </div>
        <SceneFrame
          class="product-hero__visual"
          src="/images/generated/pages/zhipet-product-closeup-scene.webp"
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
            <p>具体参数与传感能力以正式产品说明为准。</p>
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
        description="围绕不同佩戴需求，呈现核心模块与配件之间的组合逻辑。"
      />
      <div class="variant-layout">
        <article class="variant-card variant-card--featured">
          <figure class="variant-card__media">
            <img
              :src="publicAssetUrl('/images/generated/home-ecosystem/ecosystem-collar.webp')"
              alt="知宠智能项圈核心模块概念产品图"
              loading="lazy"
            >
            <figcaption>AI 概念图，仅供参考</figcaption>
          </figure>
          <div class="variant-card__content">
            <BaseTag tone="concept">推荐 · {{ featuredVariant.status }}</BaseTag>
            <div>
              <p class="variant-card__eyebrow">完整佩戴体验</p>
              <h2>{{ featuredVariant.title }}</h2>
              <p>{{ featuredVariant.description }}</p>
            </div>
            <dl class="variant-card__comparison">
              <div v-for="item in featuredVariant.comparison" :key="item.label">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>
            <ul aria-label="核心形态特点">
              <li v-for="tag in featuredVariant.tags" :key="tag">{{ tag }}</li>
            </ul>
            <NuxtLink class="variant-card__link" to="/products/smart-collar">
              了解核心产品
              <BaseIcon name="arrow-right" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>

        <div class="variant-alternatives" aria-label="替代安装形态">
          <article
            v-for="variant in alternativeVariants"
            :key="variant.id"
            class="variant-card variant-card--alternative"
          >
            <BaseTag tone="neutral">{{ variant.status }}</BaseTag>
            <h2>{{ variant.title }}</h2>
            <p>{{ variant.description }}</p>
            <dl class="variant-card__comparison">
              <div v-for="item in variant.comparison" :key="item.label">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>
          </article>
        </div>

        <aside class="variant-future" aria-labelledby="future-variant-title">
          <div>
            <span>{{ futureVariant.status }}</span>
            <h2 id="future-variant-title">{{ futureVariant.title }}</h2>
          </div>
          <p>{{ futureVariant.description }}</p>
          <ul aria-label="未来拓展方向">
            <li v-for="tag in futureVariant.tags" :key="tag">{{ tag }}</li>
          </ul>
        </aside>
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
            src="/images/generated/pages/zhipet-app-profile-scene.webp"
            alt="知宠智能项圈模块与安装形态概念图"
            aspect-ratio="16 / 9"
            object-position="center"
          >
            <div class="collar-spec-card">
              <span>模块化设计</span>
              <strong>一体佩戴 / 夹扣适配</strong>
              <p>材质、重量、防护能力与续航以正式产品说明为准。</p>
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
        <h2 id="product-boundary-title">产品信息边界</h2>
        <p>
          页面不把趋势观察写成医疗级生命体征监测，也不对续航、防护能力或价格作超出正式产品说明的承诺。猫端体验强调轻量、安全脱扣和低打扰。
        </p>
      </div>
    </BaseContainer>

    <CTASection
      title="想确认哪种产品形态适合您的场景？"
      description="通过公开邮箱了解核心模块、安装方式和产品使用边界。"
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
    var(--product-hero-image) center / cover no-repeat;
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

.value-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-5);
}

.value-card {
  display: grid;
  align-content: start;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.value-card h2 {
  font-size: 22px;
  line-height: 1.25;
}

.value-card p,
.boundary-panel p {
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.feature-strip {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.feature-strip span {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface-soft);
  font-size: 13px;
  font-weight: 650;
}

.variant-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.28fr) minmax(320px, 0.72fr);
  gap: var(--space-5);
  margin-top: var(--space-7);
}

.variant-card {
  display: grid;
  align-content: start;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.variant-card--featured {
  min-height: 0;
  align-content: stretch;
  gap: 0;
  padding: 0;
  border-color: transparent;
  color: var(--color-surface);
  background: var(--color-brand-900);
  overflow: hidden;
}

.variant-card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  margin: 0;
  overflow: hidden;
  background: #f2ede4;
}

.variant-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.variant-card__media figcaption {
  position: absolute;
  right: var(--space-3);
  bottom: var(--space-3);
  color: rgb(255 255 255 / 80%);
  font-size: 11px;
  text-shadow: 0 1px 4px rgb(0 0 0 / 44%);
}

.variant-card__content {
  display: grid;
  align-content: start;
  gap: var(--space-4);
  padding: clamp(28px, 4vw, 48px);
}

.variant-card--featured :deep(.base-tag) {
  color: var(--color-accent-300);
  border-color: rgb(231 197 144 / 32%);
  background: rgb(255 255 255 / 8%);
}

.variant-card__eyebrow {
  margin-bottom: var(--space-2);
  color: var(--color-accent-300) !important;
  font-size: 13px;
  font-weight: 800;
}

.variant-card h2,
.variant-future h2 {
  font-size: 24px;
  line-height: 1.25;
}

.variant-card--featured h2 {
  color: var(--color-surface);
  font-size: clamp(32px, 3vw, 42px);
}

.variant-card p,
.variant-future p {
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.variant-card--featured p {
  color: rgb(255 255 255 / 72%);
}

.variant-card__comparison {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  border-block: 1px solid var(--color-border);
}

.variant-card--featured .variant-card__comparison {
  border-color: rgb(255 255 255 / 18%);
}

.variant-card__comparison div {
  display: grid;
  gap: 4px;
  padding-block: var(--space-3);
}

.variant-card__comparison div + div {
  padding-left: var(--space-4);
  border-left: 1px solid var(--color-border);
}

.variant-card--featured .variant-card__comparison div + div {
  border-color: rgb(255 255 255 / 18%);
}

.variant-card__comparison dt {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 700;
}

.variant-card--featured .variant-card__comparison dt {
  color: rgb(255 255 255 / 58%);
}

.variant-card__comparison dd {
  margin: 0;
  color: var(--color-brand-900);
  font-size: 15px;
  font-weight: 800;
}

.variant-card--featured .variant-card__comparison dd {
  color: var(--color-surface);
}

.variant-card ul,
.variant-future ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.variant-card li,
.variant-future li {
  color: var(--color-brand-800);
  font-size: 13px;
  font-weight: 700;
}

.variant-card li + li::before,
.variant-future li + li::before {
  margin-right: var(--space-2);
  color: var(--color-accent-600);
  content: '·';
}

.variant-card--featured li {
  color: rgb(255 255 255 / 78%);
}

.variant-card__link {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-surface);
  font-size: 14px;
  font-weight: 800;
}

.variant-card__link .base-icon {
  transition: transform var(--motion-duration-fast) var(--motion-ease-out);
}

.variant-card__link:hover .base-icon {
  transform: translateX(3px);
}

.variant-alternatives {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
}

.variant-card--alternative {
  min-height: 0;
}

.variant-future {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: minmax(220px, 0.55fr) minmax(280px, 1fr) auto;
  gap: var(--space-5);
  align-items: center;
  padding: var(--space-4) 0;
  border-block: 1px solid var(--color-border);
}

.variant-future > div > span {
  color: var(--color-accent-600);
  font-size: 12px;
  font-weight: 800;
}

.variant-future h2 {
  margin-top: 4px;
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
  .variant-layout {
    grid-template-columns: 1fr;
  }

  .variant-future {
    grid-column: auto;
  }

  .variant-alternatives {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

  .variant-alternatives,
  .variant-card__comparison,
  .variant-future {
    grid-template-columns: 1fr;
  }

  .variant-card__comparison div + div {
    padding-left: 0;
    border-top: 1px solid var(--color-border);
    border-left: 0;
  }

  .variant-card--featured .variant-card__comparison div + div {
    border-color: rgb(255 255 255 / 18%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .variant-card__link .base-icon {
    transition: none;
  }
}
</style>

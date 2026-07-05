<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { homeMetricCards, homeTeasers, productBoundaries } from '~/data/v2'

const { register } = useScrollReveal()

useSeoMeta({
  title: '知宠 ZHIPET | 更懂陪伴，更守护健康',
  description:
    '知宠 ZHIPET 以智能项圈、App 和健康档案生态，探索宠物安全防走失、健康趋势观察与 AI 状态解释。',
  ogTitle: '知宠 ZHIPET | 更懂陪伴，更守护健康',
  ogDescription: '知宠智能项圈 · App · 健康档案生态，让陪伴更有依据。',
  ogType: 'website',
})
</script>

<template>
  <div class="home-page">
    <section class="home-hero" aria-labelledby="home-title">
      <BaseContainer class="home-hero__inner" width="wide">
        <div class="home-hero__copy">
          <BaseTag tone="concept">ZHIPET V2</BaseTag>
          <h1 id="home-title">
            更懂陪伴，<br>
            更守护健康
          </h1>
          <p class="home-hero__lead">
            知宠智能项圈 · App · 健康档案生态。用安全防走失、健康趋势观察和 AI 状态解释，让每一次陪伴更有依据。
          </p>
          <div class="home-hero__actions" aria-label="首页主要操作">
            <BaseButton to="/products" size="lg">
              了解产品
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="/demo" variant="secondary" size="lg">预约演示</BaseButton>
          </div>
        </div>

        <div class="home-hero__visual">
          <BaseImage
            src="/images/concepts/hero-care-scene.svg"
            alt="知宠智能项圈、家庭陪伴与健康档案生态概念视觉"
            aspect-ratio="4 / 3"
            radius="lg"
            priority
            concept
            label-placement="below"
          />
          <div class="metric-cloud" aria-label="知宠核心状态卡">
            <article v-for="item in homeMetricCards" :key="item.id" class="metric-card">
              <span>{{ item.title }}</span>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="home-section preview-section"
      width="wide"
      aria-labelledby="preview-title"
    >
      <div class="preview-layout">
        <div class="phone-preview" aria-label="知宠 App 预览">
          <div class="phone-preview__status">
            <span>今日观察</span>
            <strong>可能需要更多陪伴</strong>
            <p>依据：夜间休息片段变短、门口徘徊增加。仍需结合家庭环境持续观察。</p>
          </div>
          <div class="phone-preview__chart" aria-hidden="true">
            <span v-for="index in 18" :key="index" />
          </div>
          <dl>
            <div>
              <dt>安全</dt>
              <dd>围栏规则待确认</dd>
            </div>
            <div>
              <dt>健康</dt>
              <dd>趋势观察中</dd>
            </div>
            <div>
              <dt>AI</dt>
              <dd>保留不确定性</dd>
            </div>
          </dl>
        </div>
        <div class="preview-copy">
          <SectionHeading
            id="preview-title"
            title="不是后台系统，而是一套面向家庭的健康陪伴入口"
            description="App 只作为官网展示卡片出现，帮助用户理解智能项圈、状态解释和健康档案之间的关系。"
            align="left"
          />
          <BaseButton to="/research/ai-state-boundary" variant="text">
            阅读 AI 状态解释边界
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </div>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="home-section teaser-section"
      aria-labelledby="teaser-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="teaser-title"
          title="从安全到健康，从观察到行动"
          description="知宠 V2 的首页不堆功能，而是把用户最关心的三件事讲清楚。"
        />
        <div class="teaser-grid">
          <NuxtLink v-for="item in homeTeasers" :key="item.id" class="teaser-card" to="/research">
            <span>{{ item.label }}</span>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <BaseIcon name="arrow-right" aria-hidden="true" />
          </NuxtLink>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="home-section boundary-section"
      width="wide"
      aria-labelledby="boundary-title"
    >
      <SectionHeading
        id="boundary-title"
        title="先把边界讲清楚，才值得信任"
        description="知宠不会把概念包装成已验证结论，也不会用生成内容冒充真实资料。"
      />
      <div class="boundary-grid">
        <article v-for="item in productBoundaries" :key="item.id" class="boundary-card">
          <BaseIcon name="shield-check" aria-hidden="true" />
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <CTASection
      title="准备了解知宠 V2 产品路径？"
      description="预约演示，确认智能项圈、App、健康档案与机构协同的当前规划边界。"
      secondary-label="进入健康研究院"
      secondary-to="/research"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.home-page {
  overflow: hidden;
}

.home-hero {
  padding-block: var(--space-9) var(--space-7);
  background:
    radial-gradient(circle at 78% 18%, rgb(231 240 230 / 56%), transparent 34%),
    linear-gradient(180deg, rgb(246 241 233 / 54%), rgb(250 248 244 / 0) 72%);
}

.home-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(420px, 0.9fr);
  gap: var(--space-8);
  align-items: center;
}

.home-hero__copy {
  display: grid;
  gap: var(--space-5);
}

.home-hero h1 {
  max-width: 760px;
  font-size: 68px;
  line-height: 1.05;
  letter-spacing: 0;
  text-wrap: balance;
}

.home-hero__lead {
  max-width: 660px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.78;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.home-hero__visual {
  position: relative;
  min-width: 0;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: rgb(255 255 255 / 78%);
}

.home-hero__visual :deep(.base-image__frame) {
  box-shadow: 0 24px 68px rgb(47 36 27 / 9%);
}

.metric-cloud {
  position: absolute;
  inset: auto var(--space-6) var(--space-8) var(--space-6);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.metric-card {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);
  border: 1px solid rgb(200 138 56 / 22%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(10px);
  animation: float-soft 5.2s ease-in-out infinite;
}

.metric-card:nth-child(2n) {
  animation-delay: 420ms;
}

.metric-card span {
  color: var(--color-brand-900);
  font-weight: 800;
}

.metric-card p {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.home-section {
  @include section-spacing;
}

.preview-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.56fr) minmax(0, 0.86fr);
  gap: var(--space-8);
  align-items: center;
}

.phone-preview {
  display: grid;
  gap: var(--space-4);
  max-width: 380px;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background:
    linear-gradient(180deg, var(--color-surface), var(--color-surface-soft)),
    var(--color-surface);
}

.phone-preview__status {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(86 130 103 / 18%);
  border-radius: var(--radius-card);
  background: var(--color-sage-100);
}

.phone-preview__status span,
.phone-preview dt {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.phone-preview__status strong {
  color: var(--color-sage-700);
  font-size: 22px;
  line-height: 1.28;
}

.phone-preview__status p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.phone-preview__chart {
  display: flex;
  align-items: end;
  gap: 6px;
  height: 92px;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
}

.phone-preview__chart span {
  width: 100%;
  min-width: 4px;
  height: 42%;
  border-radius: var(--radius-pill);
  background: var(--color-accent-300);
}

.phone-preview__chart span:nth-child(3n) {
  height: 72%;
  background: var(--color-accent-600);
}

.phone-preview__chart span:nth-child(4n) {
  height: 58%;
  background: var(--color-sage-500);
}

.phone-preview dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  margin: 0;
}

.phone-preview dd {
  margin: var(--space-1) 0 0;
  color: var(--color-brand-900);
  font-size: 13px;
  font-weight: 750;
}

.preview-copy {
  min-width: 0;
}

.teaser-section {
  background: var(--color-surface-soft);
}

.teaser-grid,
.boundary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.teaser-card,
.boundary-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.teaser-card {
  color: inherit;
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.teaser-card:hover,
.teaser-card:focus-visible {
  border-color: rgb(183 121 43 / 42%);
  transform: translateY(-2px);
}

.teaser-card span {
  color: var(--color-accent-600);
  font-size: 14px;
  font-weight: 850;
}

.teaser-card h2,
.boundary-card h2 {
  font-size: 22px;
  line-height: 1.28;
}

.teaser-card p,
.boundary-card p {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.teaser-card .base-icon {
  color: var(--color-accent-600);
  transition: transform var(--motion-duration-fast) var(--motion-ease-out);
}

.teaser-card:hover .base-icon,
.teaser-card:focus-visible .base-icon {
  transform: translateX(4px);
}

.boundary-card .base-icon {
  color: var(--color-sage-500);
  font-size: 24px;
}

@keyframes float-soft {
  50% {
    transform: translateY(-4px);
  }
}

@media (max-width: 1100px) {
  .home-hero__inner,
  .preview-layout {
    grid-template-columns: 1fr;
  }

  .home-hero h1 {
    font-size: 52px;
  }
}

@media (max-width: 760px) {
  .teaser-grid,
  .boundary-grid {
    grid-template-columns: 1fr;
  }

  .metric-cloud {
    position: static;
    margin-top: var(--space-3);
  }
}

@media (max-width: 560px) {
  .home-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .home-hero h1 {
    font-size: 40px;
  }

  .home-hero__lead {
    font-size: 15px;
  }

  .home-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .home-hero__visual,
  .phone-preview {
    padding: var(--space-4);
  }

  .metric-cloud,
  .phone-preview dl {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .metric-card {
    animation: none;
  }

  .teaser-card:hover,
  .teaser-card:focus-visible,
  .teaser-card:hover .base-icon,
  .teaser-card:focus-visible .base-icon {
    transform: none;
  }
}
</style>

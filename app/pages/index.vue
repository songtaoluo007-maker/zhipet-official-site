<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import {
  brandNotes,
  heroPoints,
  homeAiUnderstanding,
  homeFeaturedProducts,
  homePillars,
  homeSolutions,
  homeTimeline,
  homeTrustPrinciples,
} from '~/data/home'

const { register } = useScrollReveal()
const primaryProduct = computed(() => homeFeaturedProducts[0])
const supportingProducts = computed(() => homeFeaturedProducts.slice(1))

useSeoMeta({
  title: '知宠 ZHIPET | 用 AI 读懂每一次陪伴',
  description:
    '知宠 ZHIPET 融合宠物声音、动作、活动与长期成长数据，帮助主人理解宠物可能的情绪、需求、健康与安全状态。',
  ogTitle: '知宠 ZHIPET | 用 AI 读懂每一次陪伴',
  ogDescription:
    '通过 AI 宠物理解、智能感知设备、知宠 App 与专业服务平台，让每一次陪伴更有依据。',
  ogType: 'website',
})
</script>

<template>
  <div class="home-page">
    <section class="home-hero" aria-labelledby="home-hero-title">
      <BaseContainer class="home-hero__inner" width="wide">
        <div class="home-hero__copy">
          <h1 id="home-hero-title">用 AI 理解宠物的日常信号</h1>
          <p class="home-hero__lead">
            融合声音、行为、活动与成长记录，帮助主人获得更有依据的情绪、健康与安全趋势提示。
          </p>
          <div class="home-hero__actions" aria-label="首页主要操作">
            <BaseButton to="/demo" size="lg">
              预约演示
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="#ai-understanding" variant="text" size="lg">
              了解 AI 宠物理解
            </BaseButton>
          </div>
          <dl class="home-hero__points" aria-label="知宠当前信息摘要">
            <div v-for="point in heroPoints" :key="point.label" class="home-hero__point">
              <dt>{{ point.label }}</dt>
              <dd>{{ point.value }}</dd>
              <p>{{ point.description }}</p>
            </div>
          </dl>
        </div>

        <div class="home-hero__visual">
          <div class="home-hero__visual-stage">
            <BaseImage
              src="/images/concepts/hero-care-scene.svg"
              alt="知宠连接宠物家庭、智能设备和健康服务的概念视觉"
              aspect-ratio="4 / 3"
              radius="lg"
              priority
              concept
              label-placement="below"
            />
            <div class="home-hero__insight-card">
              <span>{{ homeAiUnderstanding.statusLabel }}</span>
              <strong>{{ homeAiUnderstanding.statusValue }}</strong>
              <p>{{ homeAiUnderstanding.confidenceLabel }}</p>
            </div>
            <div class="home-hero__signal-card" aria-label="知宠产品链路示意">
              <span>感知</span>
              <i aria-hidden="true" />
              <span>理解</span>
              <i aria-hidden="true" />
              <span>行动</span>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="what-we-do"
      :ref="register"
      tag="section"
      class="home-section home-section--intro"
      aria-labelledby="what-we-do-title"
    >
      <SectionHeading
        id="what-we-do-title"
        title="知宠在做什么"
        description="从日常信号到状态提示，再到家庭或服务机构中的下一步行动。"
      />
      <div class="capability-rail">
        <article v-for="pillar in homePillars" :key="pillar.id" class="capability-item">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="pillar.icon" />
          </span>
          <div>
            <h3>{{ pillar.title }}</h3>
            <p>{{ pillar.description }}</p>
          </div>
        </article>
      </div>
    </BaseContainer>

    <section
      id="ai-understanding"
      :ref="register"
      class="home-section ai-understanding-section"
      aria-labelledby="ai-understanding-title"
    >
      <BaseContainer width="wide">
        <div class="ai-understanding-layout">
          <div class="ai-understanding-visual" aria-label="AI 宠物理解能力示意">
            <BaseImage
              :src="homeAiUnderstanding.image"
              :alt="homeAiUnderstanding.alt"
              aspect-ratio="4 / 3"
              radius="lg"
              concept
              label-placement="below"
            />
            <div class="wave-strip" aria-hidden="true">
              <span v-for="index in 18" :key="index" />
            </div>
            <div class="ai-analysis-card">
              <span>{{ homeAiUnderstanding.statusLabel }}</span>
              <strong>{{ homeAiUnderstanding.statusValue }}</strong>
              <p>{{ homeAiUnderstanding.confidenceLabel }}</p>
            </div>
            <div class="ai-basis-note">
              <span>分析依据示例</span>
              <ul>
                <li v-for="item in homeAiUnderstanding.analysisBasis" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>

          <div class="ai-understanding-copy">
            <SectionHeading
              id="ai-understanding-title"
              :title="homeAiUnderstanding.title"
              :description="homeAiUnderstanding.description"
              align="left"
            />
            <div class="analysis-step-list" aria-label="AI 提示形成链路">
              <article v-for="step in homeAiUnderstanding.analysisSteps" :key="step.label">
                <span>{{ step.label }}</span>
                <div>
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.description }}</p>
                </div>
              </article>
            </div>
            <div class="ai-ability-strip" aria-label="AI 宠物理解能力">
              <div v-for="ability in homeAiUnderstanding.abilities" :key="ability.title">
                <h3>{{ ability.title }}</h3>
                <p>{{ ability.description }}</p>
              </div>
            </div>
            <BaseButton :to="homeAiUnderstanding.linkTo" variant="text">
              {{ homeAiUnderstanding.linkLabel }}
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
          </div>
        </div>
      </BaseContainer>
    </section>

    <section
      id="products"
      :ref="register"
      class="home-section product-section"
      aria-labelledby="products-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="products-title"
          title="核心产品"
          description="以智能感知设备为入口，用 App 承接家庭照护，再把长期记录连接到服务流程。"
        />
        <div class="product-ecosystem">
          <article v-if="primaryProduct" class="product-feature">
            <div class="product-feature__copy">
              <div class="product-feature__head">
                <span class="icon-shell" aria-hidden="true">
                  <BaseIcon :name="primaryProduct.icon" />
                </span>
                <div>
                  <BaseTag tone="concept">{{ primaryProduct.status }}</BaseTag>
                  <h3>{{ primaryProduct.name }}</h3>
                </div>
              </div>
              <p>{{ primaryProduct.summary }}</p>
              <ul class="check-list">
                <li v-for="feature in primaryProduct.features" :key="feature">
                  <BaseIcon name="check-circle" />
                  <span>{{ feature }}</span>
                </li>
              </ul>
              <BaseButton v-if="primaryProduct.detailTo" :to="primaryProduct.detailTo" variant="text">
                {{ primaryProduct.detailLabel ?? '查看详情' }}
                <template #iconRight>
                  <BaseIcon name="arrow-right" />
                </template>
              </BaseButton>
            </div>
            <BaseImage
              class="product-feature__image"
              :src="primaryProduct.image"
              :alt="primaryProduct.alt"
              aspect-ratio="3 / 2"
              radius="lg"
              concept
              label-placement="below"
            />
          </article>
          <div class="product-support-grid">
            <article v-for="product in supportingProducts" :key="product.id" class="product-support-card">
              <span class="icon-shell" aria-hidden="true">
                <BaseIcon :name="product.icon" />
              </span>
              <div>
                <BaseTag tone="concept">{{ product.status }}</BaseTag>
                <h3>{{ product.name }}</h3>
                <p>{{ product.summary }}</p>
              </div>
              <ul class="check-list">
                <li v-for="feature in product.features" :key="feature">
                  <BaseIcon name="check-circle" />
                  <span>{{ feature }}</span>
                </li>
              </ul>
              <BaseButton v-if="product.detailTo" :to="product.detailTo" variant="text">
                {{ product.detailLabel ?? '查看详情' }}
                <template #iconRight>
                  <BaseIcon name="arrow-right" />
                </template>
              </BaseButton>
            </article>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="solutions"
      :ref="register"
      tag="section"
      class="home-section solution-section"
      width="wide"
      aria-labelledby="solutions-title"
    >
      <div class="solution-layout">
        <div class="solution-layout__copy">
          <SectionHeading
            id="solutions-title"
            title="解决方案"
            description="不同角色看到的是同一套能力在不同服务流程里的使用方式。"
          />
          <BaseButton to="/solutions" variant="text">
            了解解决方案
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </div>
        <div class="solution-list">
          <article v-for="solution in homeSolutions" :key="solution.id" class="solution-item">
            <span class="icon-shell" aria-hidden="true">
              <BaseIcon :name="solution.icon" />
            </span>
            <div>
              <BaseTag>{{ solution.audience }}</BaseTag>
              <h3>{{ solution.title }}</h3>
              <p>{{ solution.description }}</p>
              <ul v-if="solution.scenarios?.length" class="solution-scenarios">
                <li v-for="scenario in solution.scenarios" :key="scenario">{{ scenario }}</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </BaseContainer>

    <BaseContainer
      id="about"
      :ref="register"
      tag="section"
      class="home-section trust-brand-section"
      width="wide"
      aria-labelledby="brand-title"
    >
      <div class="trust-brand-layout">
        <div class="trust-brand-layout__main">
          <SectionHeading
            id="brand-title"
            title="我们如何谨慎使用 AI 判断"
            description="把产品边界讲清楚，是知宠建立信任的一部分。"
          />
          <div class="trust-principle-list">
            <article v-for="principle in homeTrustPrinciples" :key="principle.title" class="trust-principle">
              <BaseIcon name="shield-check" />
              <div>
                <h3>{{ principle.title }}</h3>
                <p>{{ principle.description }}</p>
              </div>
            </article>
          </div>
          <div class="brand-note-list">
            <article v-for="note in brandNotes" :key="note.title" class="brand-note">
              <h3>{{ note.title }}</h3>
              <p>{{ note.description }}</p>
            </article>
          </div>
        </div>
        <aside class="trust-brand-layout__aside" aria-label="知宠项目阶段与团队概念视觉">
          <BaseImage
            src="/images/concepts/team-lab.svg"
            alt="知宠团队与宠物健康技术探索概念视觉"
            aspect-ratio="3 / 2"
            radius="lg"
            concept
            label-placement="below"
          />
          <ol class="timeline-list">
            <li v-for="item in homeTimeline" :key="item.date + item.title">
              <span>{{ item.date }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </li>
          </ol>
        </aside>
      </div>
    </BaseContainer>

    <CTASection
      title="携手知宠，为更多宠物带来健康守护"
      description="预约产品演示，了解适合家庭、医院、门店与合作机构的下一步方案。"
      secondary-label="查看产品中心"
      secondary-to="/products"
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
  background: linear-gradient(180deg, rgb(246 241 233 / 46%), rgb(250 248 244 / 0) 72%);
}

.home-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(420px, 0.82fr);
  gap: var(--space-8);
  align-items: center;
}

.home-hero__copy {
  position: relative;
  display: grid;
  gap: var(--space-5);
}

.home-hero h1 {
  max-width: 760px;
  font-size: 56px;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.home-hero__lead {
  max-width: 650px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
}

.home-hero__points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  max-width: 720px;
  margin: var(--space-2) 0 0;
}

.home-hero__point {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 68%);
}

.home-hero__point dt {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 650;
}

.home-hero__point dd {
  margin: var(--space-2) 0;
  color: var(--color-brand-900);
  font-size: 22px;
  font-weight: 800;
}

.home-hero__point p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.home-hero__visual {
  position: relative;
}

.home-hero__visual-stage {
  position: relative;
  overflow: hidden;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 82%), rgb(246 241 233 / 78%)),
    var(--color-surface-soft);
}

.home-hero__visual-stage::before {
  position: absolute;
  inset: -18px 30px 30px -18px;
  z-index: -1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

.home-hero__visual-stage::after {
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(232 200 148 / 74%), transparent);
  content: '';
}

.home-hero__visual :deep(.base-image__frame) {
  box-shadow: 0 24px 64px rgb(47 36 27 / 9%);
}

.home-hero__insight-card,
.home-hero__signal-card {
  border: 1px solid rgb(200 138 56 / 24%);
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(10px);
}

.home-hero__insight-card {
  position: absolute;
  right: var(--space-7);
  bottom: var(--space-8);
  display: grid;
  max-width: 280px;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-card);
  box-shadow: 0 18px 38px rgb(47 36 27 / 10%);
}

.home-hero__insight-card span,
.home-hero__signal-card span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.home-hero__insight-card strong {
  color: var(--color-brand-900);
  font-size: 19px;
}

.home-hero__insight-card p {
  color: var(--color-text-secondary);
  font-size: 13px;
}

.home-hero__signal-card {
  position: absolute;
  top: var(--space-7);
  left: var(--space-7);
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
}

.home-hero__signal-card i {
  width: 18px;
  height: 1px;
  background: var(--color-accent-300);
}

.home-section {
  @include section-spacing;
}

.home-section--intro {
  padding-top: var(--space-8);
}

.capability-rail {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.capability-item,
.trust-principle,
.brand-note {
  min-width: 0;
}

.capability-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-5);
  border-right: 1px solid var(--color-border);
  transition: background var(--motion-duration-fast) var(--motion-ease-out);
}

.capability-item:hover {
  background: rgb(246 234 216 / 34%);
}

.capability-item:last-child {
  border-right: 0;
}

.brand-note {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
}

.capability-item p,
.brand-note p,
.trust-principle p,
.solution-item p,
.product-feature p,
.product-support-card p,
.timeline-list p {
  color: var(--color-text-secondary);
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

.ai-understanding-section {
  background:
    linear-gradient(180deg, rgb(246 241 233 / 74%), rgb(246 241 233 / 92%)),
    var(--color-surface-soft);
}

.ai-understanding-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.98fr) minmax(380px, 0.78fr);
  gap: var(--space-8);
  align-items: center;
}

.ai-understanding-visual {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.72fr);
  min-width: 0;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  box-shadow: 0 24px 64px rgb(47 36 27 / 7%);
}

.ai-understanding-visual :deep(.base-image) {
  grid-row: span 2;
}

.wave-strip,
.ai-analysis-card,
.ai-basis-note {
  border: 1px solid rgb(200 138 56 / 22%);
  background: var(--color-surface);
}

.wave-strip {
  overflow: hidden;
  display: flex;
  height: 52px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 var(--space-3);
  border-radius: var(--radius-button);
}

.wave-strip span {
  width: 4px;
  height: 18px;
  border-radius: var(--radius-pill);
  background: var(--color-accent-600);
  opacity: 0.58;
  transform-origin: center;
}

.wave-strip span:nth-child(3n) {
  height: 30px;
}

.wave-strip span:nth-child(4n) {
  height: 38px;
  opacity: 0.78;
}

.wave-strip span:nth-child(5n) {
  height: 24px;
  background: var(--color-success);
}

.wave-strip span:nth-child(odd) {
  animation: wave-soft 3.2s ease-in-out infinite;
}

.wave-strip span:nth-child(even) {
  animation: wave-soft 3.2s ease-in-out 240ms infinite;
}

.ai-analysis-card,
.ai-basis-note {
  position: relative;
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-button);
}

.ai-analysis-card::after {
  width: 100%;
  height: 4px;
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, var(--color-success), rgb(232 200 148 / 52%), transparent);
  content: '';
}

.ai-analysis-card span,
.ai-basis-note span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.ai-analysis-card strong {
  color: var(--color-brand-900);
  font-size: 20px;
  line-height: 1.3;
}

.ai-analysis-card p,
.ai-basis-note li,
.ai-ability-strip p,
.analysis-step-list p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.ai-basis-note ul {
  display: grid;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.ai-basis-note li {
  position: relative;
  padding-left: var(--space-4);
}

.ai-basis-note li::before {
  position: absolute;
  top: 0.72em;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--color-accent-600);
  content: '';
}

.ai-understanding-copy {
  min-width: 0;
}

.analysis-step-list {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.analysis-step-list article {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.analysis-step-list article:hover {
  border-color: rgb(200 138 56 / 38%);
  transform: translateX(3px);
}

.analysis-step-list article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.analysis-step-list span {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.analysis-step-list h3 {
  margin-bottom: var(--space-1);
  font-size: 18px;
}

.ai-ability-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5) var(--space-6);
  padding-block: var(--space-5);
  margin-bottom: var(--space-4);
  border-block: 1px solid var(--color-border);
}

.ai-ability-strip div {
  min-width: 0;
}

.ai-ability-strip h3 {
  margin-bottom: var(--space-2);
  font-size: 18px;
}

.product-section {
  background: var(--color-surface-soft);
}

.product-ecosystem {
  display: grid;
  gap: var(--space-6);
}

.product-feature {
  @include subtle-lift;

  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(360px, 0.78fr);
  gap: var(--space-6);
  align-items: center;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
}

.product-feature__copy,
.product-support-card {
  display: grid;
  gap: var(--space-4);
}

.product-feature__head {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.product-feature__head h3 {
  margin-top: var(--space-2);
}

.product-feature h3 {
  font-size: 28px;
}

.product-support-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.product-support-card {
  @include subtle-lift;

  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
}

.product-support-card h3 {
  margin: var(--space-2) 0;
}

.check-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  padding: 0;
  margin: 0;
  list-style: none;
}

.check-list li {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  min-width: 0;
  color: var(--color-brand-900);
  font-size: 14px;
  font-weight: 650;
}

.check-list .base-icon {
  color: var(--color-success);
  font-size: 18px;
}

.solution-layout,
.trust-brand-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(420px, 1fr);
  gap: var(--space-8);
  align-items: start;
}

.solution-layout__copy {
  position: sticky;
  top: 104px;
}

.solution-list {
  display: grid;
  gap: var(--space-4);
}

.solution-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  padding-block: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.solution-item:hover {
  border-color: rgb(200 138 56 / 42%);
  transform: translateX(4px);
}

.solution-item:first-child {
  padding-top: 0;
}

.solution-item h3 {
  margin: var(--space-3) 0 var(--space-2);
}

.solution-scenarios {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: var(--space-4) 0 0;
  list-style: none;
}

.solution-scenarios li {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface-soft);
  font-size: 13px;
  font-weight: 650;
}

.trust-brand-layout__main,
.trust-brand-layout__aside {
  min-width: 0;
}

.trust-principle-list,
.brand-note-list {
  display: grid;
  gap: var(--space-4);
}

.trust-principle-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: var(--space-6);
}

.trust-principle {
  @include subtle-lift(-1px);

  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
}

.trust-principle .base-icon {
  color: var(--color-success);
  font-size: 20px;
}

.trust-principle h3,
.brand-note h3 {
  margin-bottom: var(--space-2);
}

.brand-note-list {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.brand-note {
  @include subtle-lift(-1px);
}

.trust-brand-layout__aside {
  display: grid;
  gap: var(--space-5);
}

.timeline-list {
  display: grid;
  gap: var(--space-4);
  padding: 0;
  margin: 0;
  list-style: none;
}

.timeline-list li {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.timeline-list span {
  color: var(--color-accent-600);
  font-size: 14px;
  font-weight: 800;
}

.timeline-list h3 {
  margin-bottom: var(--space-1);
  font-size: 18px;
}

@keyframes wave-soft {
  50% {
    transform: scaleY(0.72);
  }
}

@media (max-width: 1100px) {
  .home-hero__inner,
  .ai-understanding-layout,
  .product-feature,
  .solution-layout,
  .trust-brand-layout {
    grid-template-columns: 1fr;
  }

  .home-hero h1 {
    font-size: 46px;
  }

  .solution-layout__copy {
    position: static;
  }
}

@media (max-width: 820px) {
  .home-hero {
    padding-block: var(--space-7);
  }

  .home-hero h1 {
    font-size: 38px;
  }

  .home-hero__lead {
    font-size: 16px;
  }

  .home-hero__points,
  .capability-rail,
  .ai-understanding-visual,
  .ai-ability-strip,
  .product-support-grid,
  .trust-principle-list,
  .brand-note-list {
    grid-template-columns: 1fr;
  }

  .capability-item {
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }

  .capability-item:last-child {
    border-bottom: 0;
  }

  .ai-understanding-visual :deep(.base-image) {
    grid-row: auto;
  }

  .home-hero__insight-card,
  .home-hero__signal-card {
    position: static;
    margin-top: var(--space-3);
  }

  .check-list {
    grid-template-columns: 1fr;
  }

  .product-feature {
    padding: var(--space-5);
  }
}

@media (max-width: 560px) {
  .home-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .home-hero__copy {
    gap: var(--space-4);
  }

  .home-hero h1 {
    font-size: 34px;
  }

  .home-hero__lead {
    font-size: 15px;
  }

  .home-hero__points {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .home-hero__point {
    padding-top: var(--space-3);
  }

  .home-hero__point dd {
    font-size: 17px;
    line-height: 1.25;
  }

  .home-hero__point p {
    display: none;
  }

  .home-hero__visual {
    margin-inline: auto;
  }

  .home-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .home-hero__visual-stage {
    padding: var(--space-4);
  }

  .home-hero__visual-stage::before {
    inset: -12px 16px 16px -12px;
  }

  .ai-understanding-visual {
    padding: var(--space-4);
  }

  .wave-strip {
    height: 48px;
    gap: 5px;
    padding-inline: var(--space-3);
  }

  .wave-strip span {
    width: 3px;
  }

  .ai-analysis-card,
  .ai-basis-note {
    padding: var(--space-3);
  }

  .product-feature__head,
  .trust-principle,
  .solution-item {
    grid-template-columns: 1fr;
  }

  .solution-item {
    display: grid;
  }

  .timeline-list li {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .home-hero__points {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wave-strip span {
    animation: none;
  }

  .analysis-step-list article:hover,
  .solution-item:hover {
    transform: none;
  }
}
</style>

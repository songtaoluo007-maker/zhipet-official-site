<script setup lang="ts">
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
  homeCases,
  homePillars,
  homeProducts,
  homeSolutions,
  homeTimeline,
} from '~/data/home'

const { register } = useScrollReveal()

useSeoMeta({
  title: '知宠 ZHIPET | 用科技读懂陪伴',
  description:
    '知宠 ZHIPET 面向家庭、宠物医院、宠物门店与合作机构，探索宠物健康管理、智能养宠助手和行业数字化解决方案。',
  ogTitle: '知宠 ZHIPET | 用科技读懂陪伴',
  ogDescription: '以温暖、专业、可信的宠物健康科技能力，连接家庭、医院、门店与合作机构。',
  ogType: 'website',
})
</script>

<template>
  <div class="home-page">
    <section class="home-hero" aria-labelledby="home-hero-title">
      <BaseContainer class="home-hero__inner" width="wide">
        <div class="home-hero__copy">
          <h1 id="home-hero-title">用科技读懂陪伴，让养宠更简单、更智慧</h1>
          <p class="home-hero__lead">
            知宠 ZHIPET
            面向家庭、宠物医院、宠物门店与合作机构，探索宠物健康管理、智能养宠助手和行业数字化解决方案。
          </p>
          <div class="home-hero__actions" aria-label="首页主要操作">
            <BaseButton to="/demo" size="lg">
              预约演示
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="#products" variant="secondary" size="lg">查看核心产品</BaseButton>
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
          <BaseImage
            src="/images/concepts/hero-care-scene.svg"
            alt="知宠连接宠物家庭、智能设备和健康服务的概念视觉"
            aspect-ratio="4 / 3"
            radius="lg"
            priority
            concept
          />
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
        description="先把复杂的健康信息变得连续、可读、可行动，再把设备、App 与服务流程连接起来。"
      />
      <div class="pillar-grid">
        <article v-for="pillar in homePillars" :key="pillar.id" class="pillar-card">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="pillar.icon" />
          </span>
          <h3>{{ pillar.title }}</h3>
          <p>{{ pillar.description }}</p>
        </article>
      </div>
    </BaseContainer>

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
          description="第一阶段围绕智能硬件、用户端 App 和行业健康管理平台，验证从日常记录到服务连接的闭环。"
        />
        <div class="product-list">
          <article v-for="(product, index) in homeProducts" :key="product.id" class="product-row">
            <div class="product-row__copy">
              <div class="product-row__head">
                <span class="icon-shell" aria-hidden="true">
                  <BaseIcon :name="product.icon" />
                </span>
                <div>
                  <h3>{{ product.name }}</h3>
                  <BaseTag tone="concept">{{ product.status }}</BaseTag>
                </div>
              </div>
              <p>{{ product.summary }}</p>
              <ul class="check-list">
                <li v-for="feature in product.features" :key="feature">
                  <BaseIcon name="check-circle" />
                  <span>{{ feature }}</span>
                </li>
              </ul>
              <BaseButton v-if="index === 0" to="/products/smart-collar" variant="text">
                查看产品详情
                <template #iconRight>
                  <BaseIcon name="arrow-right" />
                </template>
              </BaseButton>
            </div>
            <BaseImage
              class="product-row__image"
              :src="product.image"
              :alt="product.alt"
              aspect-ratio="3 / 2"
              radius="lg"
              concept
            />
          </article>
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
            description="不把官网做成后台看板，而是清楚说明不同对象如何使用知宠能力。"
          />
          <BaseButton to="/solutions" variant="secondary">
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
            </div>
          </article>
        </div>
      </div>
    </BaseContainer>

    <section
      id="cases"
      :ref="register"
      class="home-section case-section"
      aria-labelledby="cases-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="cases-title"
          title="客户案例"
          description="真实客户授权前，只展示示范案例和概念验证项目，不冒充合作成果。"
        />
        <div class="case-grid">
          <article v-for="item in homeCases" :key="item.id" class="case-card">
            <div class="case-card__meta">
              <BaseTag tone="warning">{{ item.label }}</BaseTag>
              <span>{{ item.clientType }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            <ul class="case-card__results">
              <li v-for="result in item.results" :key="result">{{ result }}</li>
            </ul>
          </article>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="about"
      :ref="register"
      tag="section"
      class="home-section brand-section"
      width="wide"
      aria-labelledby="brand-title"
    >
      <div class="brand-layout">
        <div class="brand-layout__main">
          <SectionHeading
            id="brand-title"
            title="品牌与团队"
            description="保持克制表达：先展示愿景、技术路线和项目状态，真实团队与资质资料确认后再上线。"
          />
          <div class="brand-note-list">
            <article v-for="note in brandNotes" :key="note.title" class="brand-note">
              <h3>{{ note.title }}</h3>
              <p>{{ note.description }}</p>
            </article>
          </div>
        </div>
        <aside class="brand-layout__aside" aria-label="知宠项目阶段与团队概念视觉">
          <BaseImage
            src="/images/concepts/team-lab.svg"
            alt="知宠团队与宠物健康技术探索概念视觉"
            aspect-ratio="3 / 2"
            radius="lg"
            concept
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
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.home-page {
  overflow: hidden;
}

.home-hero {
  padding-block: var(--space-9) var(--space-8);
}

.home-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(360px, 0.78fr);
  gap: var(--space-8);
  align-items: center;
}

.home-hero__copy {
  display: grid;
  gap: var(--space-5);
}

.home-hero h1 {
  max-width: 760px;
  font-size: 58px;
  line-height: 1.08;
  letter-spacing: 0;
}

.home-hero__lead {
  max-width: 650px;
  color: var(--color-text-secondary);
  font-size: 18px;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.home-hero__points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  max-width: 720px;
  margin: var(--space-2) 0 0;
}

.home-hero__point {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
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

.home-hero__visual::before {
  position: absolute;
  inset: -20px 28px 28px -20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

.home-hero__visual :deep(.base-image) {
  box-shadow: 0 24px 64px rgb(47 36 27 / 10%);
}

.home-section {
  @include section-spacing;
}

.home-section--intro {
  padding-top: var(--space-8);
}

.pillar-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.pillar-card,
.case-card,
.brand-note {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.pillar-card p,
.case-card p,
.brand-note p,
.solution-item p,
.product-row p,
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

.product-section,
.case-section {
  background: var(--color-surface-soft);
}

.product-list {
  display: grid;
  gap: var(--space-6);
}

.product-row {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(320px, 0.78fr);
  gap: var(--space-6);
  align-items: center;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
}

.product-row:nth-child(even) .product-row__copy {
  order: 2;
}

.product-row__copy {
  display: grid;
  gap: var(--space-4);
}

.product-row__head {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.product-row__head h3 {
  margin-bottom: var(--space-2);
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
.brand-layout {
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
}

.solution-item:first-child {
  padding-top: 0;
}

.solution-item h3 {
  margin: var(--space-3) 0 var(--space-2);
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.case-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 650;
}

.case-card__results {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: var(--space-2) 0 0;
  list-style: none;
}

.case-card__results li {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface-soft);
  font-size: 13px;
  font-weight: 650;
}

.brand-layout__main,
.brand-layout__aside {
  min-width: 0;
}

.brand-note-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.brand-layout__aside {
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

@media (max-width: 1100px) {
  .home-hero__inner,
  .product-row,
  .solution-layout,
  .brand-layout {
    grid-template-columns: 1fr;
  }

  .home-hero h1 {
    font-size: 46px;
  }

  .solution-layout__copy {
    position: static;
  }

  .product-row:nth-child(even) .product-row__copy {
    order: initial;
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
  .pillar-grid,
  .case-grid,
  .brand-note-list {
    grid-template-columns: 1fr;
  }

  .check-list {
    grid-template-columns: 1fr;
  }

  .product-row {
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
    width: min(100%, 300px);
    margin-inline: auto;
  }

  .home-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .home-hero__visual::before {
    inset: -12px 16px 16px -12px;
  }

  .product-row__head,
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
</style>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SceneFrame from '~/components/common/SceneFrame.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { homeTimeline } from '~/data/home'
import { aboutAbilities, productBoundaries } from '~/data/v2'

const { register } = useScrollReveal()

const confirmationItems = [
  { label: '公司主体信息', value: '待项目方确认' },
  { label: '团队成员资料', value: '待项目方确认' },
  { label: '资质与荣誉证明', value: '待项目方确认' },
  { label: '办公地址与联系方式', value: '待项目方确认' },
]

useSeoMeta({
  title: '关于我们 | 知宠 ZHIPET',
  description: '了解知宠 ZHIPET 的项目愿景、核心能力、产品边界和当前里程碑。真实公司主体与资质待项目方确认。',
  ogTitle: '关于我们 | 知宠 ZHIPET',
  ogDescription: '因为懂你，所以更懂它。知宠当前资料以项目方确认为准。',
  ogType: 'website',
})
</script>

<template>
  <div class="about-page">
    <section class="about-hero" aria-labelledby="about-title">
      <BaseContainer class="about-hero__inner" width="wide">
        <div class="about-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>关于我们</span>
          </nav>
          <BaseTag tone="concept">项目阶段</BaseTag>
          <h1 id="about-title">因为懂你，所以更懂它</h1>
          <p>
            知宠希望用更克制、更可信的宠物健康科技能力，帮助家庭理解日常变化，也帮助专业服务沟通更有依据。
          </p>
          <BaseButton to="/demo" size="lg">
            预约演示
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </div>
        <SceneFrame
          class="about-hero__visual"
          src="/images/generated/pages/zhipet-family-care-scene.png"
          alt="人与犬猫在居家场景中互动的知宠品牌概念图"
          aspect-ratio="3 / 2"
          object-position="center"
        >
          <div class="about-hero__card">
            <span>资料状态</span>
            <strong>品牌方向已整理，正式信息待确认</strong>
            <p>不虚构团队、客户、资质、电话、地址或备案号。</p>
          </div>
        </SceneFrame>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="about-section info-section"
      width="wide"
      aria-labelledby="info-title"
    >
      <SectionHeading
        id="info-title"
        title="当前公开信息"
        description="官网优先呈现产品方向和边界，真实主体资料确认后再补齐。"
      />
      <div class="confirmation-panel">
        <div v-for="item in confirmationItems" :key="item.label" class="confirmation-row">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </BaseContainer>

    <BaseContainer
      :ref="register"
      tag="section"
      class="about-section"
      width="wide"
      aria-labelledby="ability-title"
    >
      <SectionHeading
        id="ability-title"
        title="核心能力"
        description="知宠 V2 用安全、健康和状态解读三件事组织产品能力，而不是堆砌后台模块。"
      />
      <div class="ability-grid">
        <article v-for="item in aboutAbilities" :key="item.id" class="ability-card">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="about-section boundary-section"
      aria-labelledby="boundary-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="boundary-title"
          title="产品边界"
          description="边界不是限制表达，而是让用户知道什么是可参考信息，什么需要专业判断。"
        />
        <div class="boundary-grid">
          <article v-for="item in productBoundaries" :key="item.id" class="boundary-card">
            <BaseIcon name="shield-check" aria-hidden="true" />
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="about-section timeline-section"
      width="wide"
      aria-labelledby="timeline-title"
    >
      <SectionHeading
        id="timeline-title"
        title="发展里程碑"
        description="只展示已确认的项目阶段，后续节点以项目方资料为准。"
      />
      <ol class="timeline-list" aria-label="知宠项目阶段">
        <li v-for="item in homeTimeline" :key="item.date + item.title">
          <span>{{ item.date }}</span>
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ol>
    </BaseContainer>

    <CTASection
      title="想进一步了解知宠当前阶段？"
      description="预约演示，确认产品规划、合作方式和可公开展示的真实资料清单。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.about-page {
  overflow: hidden;
}

.about-hero {
  position: relative;
  isolation: isolate;
  padding-block: var(--space-8) var(--space-7);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 54%), rgb(251 248 242 / 0) 78%),
    radial-gradient(circle at 72% 22%, rgb(232 200 148 / 18%), transparent 30%);
}

.about-hero::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, var(--color-bg) 0%, rgb(251 248 242 / 72%) 42%, rgb(251 248 242 / 24%) 100%),
    url('/images/generated/pages/zhipet-family-care-scene.png') center / cover no-repeat;
  content: '';
  opacity: 0.16;
}

.about-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.78fr);
  gap: var(--space-8);
  align-items: center;
}

.about-hero__copy {
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

.about-hero h1 {
  max-width: 760px;
  font-size: 64px;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.about-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.about-hero__visual {
  min-height: 430px;
}

.about-hero__card {
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
}

.about-hero__card span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.about-hero__card strong {
  color: var(--color-brand-900);
  font-size: 18px;
}

.about-hero__card p {
  font-size: 13px;
}

.about-section {
  @include section-spacing;
}

.info-section {
  padding-top: var(--space-6);
}

.confirmation-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.confirmation-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.45fr) minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
}

.confirmation-row:first-child {
  border-top: 0;
}

.confirmation-row span {
  color: var(--color-brand-900);
  font-weight: 750;
}

.confirmation-row strong {
  color: var(--color-accent-600);
}

.ability-grid,
.boundary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.ability-card,
.boundary-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.ability-card h2,
.boundary-card h2 {
  font-size: 22px;
}

.ability-card p,
.boundary-card p,
.timeline-list p {
  color: var(--color-text-secondary);
  line-height: 1.72;
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

.boundary-section {
  background: var(--color-surface-soft);
}

.boundary-card .base-icon {
  color: var(--color-sage-500);
  font-size: 24px;
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
  grid-template-columns: 120px minmax(0, 1fr);
  gap: var(--space-5);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.timeline-list span {
  color: var(--color-accent-600);
  font-weight: 850;
}

.timeline-list h2 {
  margin-bottom: var(--space-1);
  font-size: 20px;
}

@media (max-width: 1000px) {
  .about-hero__inner,
  .ability-grid,
  .boundary-grid {
    grid-template-columns: 1fr;
  }

  .about-hero h1 {
    font-size: 46px;
  }
}

@media (max-width: 560px) {
  .about-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .about-hero h1 {
    font-size: 36px;
  }

  .about-hero p {
    font-size: 15px;
  }

  .ability-card,
  .boundary-card {
    padding: var(--space-4);
  }

  .about-hero__card {
    right: var(--space-4);
    bottom: var(--space-4);
    width: min(300px, calc(100% - 32px));
    max-width: none;
  }

  .confirmation-row,
  .timeline-list li {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { solutionScenarios, trustStrip } from '~/data/v2'

const { register } = useScrollReveal()

useSeoMeta({
  title: '解决方案 | 知宠 ZHIPET',
  description:
    '知宠解决方案面向家庭养宠、宠物医院和宠物门店/机构，展示同一套能力在不同场景中的使用方式。',
  ogTitle: '解决方案 | 知宠 ZHIPET',
  ogDescription: '同一套能力，服务不同场景。真实合作机构与服务范围待项目方确认。',
  ogType: 'website',
})
</script>

<template>
  <div class="solutions-page">
    <section class="solutions-hero" aria-labelledby="solutions-title">
      <BaseContainer class="solutions-hero__inner" width="wide">
        <div class="solutions-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>解决方案</span>
          </nav>
          <BaseTag tone="concept">场景方案待确认</BaseTag>
          <h1 id="solutions-title">同一套能力，服务不同场景</h1>
          <p>
            知宠围绕安全防走失、健康趋势观察和状态解释，服务家庭、宠物医院与门店机构。当前不展示虚构客户、合作 Logo 或落地数据。
          </p>
          <BaseButton to="#scenario-cards" size="lg">
            查看场景方案
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </div>
        <div class="solutions-hero__visual">
          <BaseImage
            src="/images/concepts/family-solution.svg"
            alt="知宠家庭、医院和门店协同场景概念视觉"
            aspect-ratio="16 / 10"
            radius="lg"
            priority
            concept
            label-placement="below"
          />
          <div class="solutions-hero__card">
            <span>公开边界</span>
            <strong>不展示未确认客户或资质</strong>
            <p>合作机构、覆盖城市和上线节奏均待项目方确认。</p>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="scenario-cards"
      :ref="register"
      tag="section"
      class="solutions-section"
      width="wide"
      aria-labelledby="scenario-title"
    >
      <SectionHeading
        id="scenario-title"
        title="三大场景"
        description="每个场景都围绕不同角色的真实任务组织，不把官网做成后台系统展示页。"
      />
      <div class="scenario-grid">
        <article v-for="scenario in solutionScenarios" :key="scenario.id" class="scenario-card">
          <BaseImage
            :src="scenario.image"
            :alt="scenario.alt"
            aspect-ratio="4 / 3"
            radius="lg"
            concept
            label-placement="below"
          />
          <div class="scenario-card__body">
            <div class="scenario-card__head">
              <span class="icon-shell" aria-hidden="true">
                <BaseIcon :name="scenario.icon" />
              </span>
              <div>
                <BaseTag tone="concept">{{ scenario.audience }}</BaseTag>
                <h2>{{ scenario.title }}</h2>
              </div>
            </div>
            <p>{{ scenario.description }}</p>
            <ul>
              <li v-for="ability in scenario.abilities" :key="ability">{{ ability }}</li>
            </ul>
            <p v-if="scenario.boundary" class="scenario-card__boundary">
              {{ scenario.boundary }}
            </p>
            <BaseButton :to="scenario.href" variant="text">
              查看方案详情
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
          </div>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="solutions-section trust-section"
      aria-labelledby="trust-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="trust-title"
          title="信任基础"
          description="背书条只呈现确认前可公开的原则，不编造合作机构、数据规模或效果承诺。"
        />
        <div class="trust-grid">
          <article v-for="item in trustStrip" :key="item.id" class="trust-card">
            <span class="icon-shell" aria-hidden="true">
              <BaseIcon :name="item.icon" />
            </span>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="solutions-section boundary-panel"
      width="wide"
      aria-labelledby="solution-boundary-title"
    >
      <BaseIcon name="shield-check" aria-hidden="true" />
      <div>
        <h2 id="solution-boundary-title">方案边界</h2>
        <p>
          医院场景只做辅助沟通，不替代诊断。门店场景不承诺经营结果。所有合作机构、服务覆盖、接口开放和研究结论需项目方确认后再公开。
        </p>
      </div>
    </BaseContainer>

    <CTASection
      title="想确认哪种方案适合您的场景？"
      description="预约演示，沟通家庭、医院或门店机构的具体需求与当前可验证范围。"
      secondary-label="查看帮助中心"
      secondary-to="/help"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.solutions-page {
  overflow: hidden;
}

.solutions-hero {
  padding-block: var(--space-8) var(--space-7);
}

.solutions-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(380px, 0.82fr);
  gap: var(--space-8);
  align-items: center;
}

.solutions-hero__copy {
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

.solutions-hero h1 {
  max-width: 760px;
  font-size: 56px;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.solutions-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.solutions-hero__visual {
  position: relative;
  min-width: 0;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 86%), rgb(246 241 233 / 72%)),
    var(--color-surface-soft);
}

.solutions-hero__card {
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

.solutions-hero__card span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.solutions-hero__card strong {
  color: var(--color-brand-900);
  font-size: 18px;
}

.solutions-hero__card p {
  font-size: 13px;
}

.solutions-section {
  @include section-spacing;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.scenario-card {
  display: grid;
  grid-template-rows: auto 1fr;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.scenario-card__body {
  display: grid;
  gap: var(--space-4);
  align-content: start;
  padding: var(--space-5);
}

.scenario-card__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
}

.scenario-card h2,
.trust-card h2 {
  margin-top: var(--space-2);
  font-size: 22px;
  line-height: 1.25;
}

.scenario-card p,
.trust-card p,
.boundary-panel p {
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.scenario-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.scenario-card li {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface-soft);
  font-size: 13px;
  font-weight: 650;
}

.scenario-card__boundary {
  padding: var(--space-3);
  border: 1px solid rgb(183 121 43 / 22%);
  border-radius: var(--radius-button);
  background: var(--color-accent-100);
  font-weight: 650;
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

.trust-section {
  background: var(--color-surface-soft);
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}

.trust-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
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
  .solutions-hero__inner,
  .scenario-grid,
  .trust-grid {
    grid-template-columns: 1fr;
  }

  .solutions-hero h1 {
    font-size: 46px;
  }
}

@media (max-width: 560px) {
  .solutions-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .solutions-hero h1 {
    font-size: 36px;
  }

  .solutions-hero p {
    font-size: 15px;
  }

  .solutions-hero__visual,
  .scenario-card__body,
  .trust-card,
  .boundary-panel {
    padding: var(--space-4);
  }

  .solutions-hero__card {
    position: static;
    max-width: none;
    margin-top: var(--space-3);
  }

  .scenario-card__head,
  .boundary-panel {
    grid-template-columns: 1fr;
  }
}
</style>

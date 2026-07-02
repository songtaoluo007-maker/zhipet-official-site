<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import PageHero from '~/components/common/PageHero.vue'
import ProcessSteps from '~/components/common/ProcessSteps.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { aiPetUnderstandingPage } from '~/data/ai-pet-understanding'

const { register } = useScrollReveal()
const pageData = aiPetUnderstandingPage
const routePath = '/ai-pet-understanding'
const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()
const siteOrigin = runtimeConfig.public.siteUrl?.trim() || requestUrl.origin
const pageUrl = new URL(routePath, siteOrigin).toString()

useSeoMeta({
  title: 'AI 宠物理解引擎 | 知宠 ZHIPET',
  description:
    '知宠通过叫声、动作、活动、场景与长期个体数据，对宠物可能的情绪、需求、行为意图和异常状态进行多模态概率分析。',
  ogTitle: 'AI 宠物理解引擎 | 知宠 ZHIPET',
  ogDescription: '了解知宠如何以概率分析、依据和不确定性提示帮助主人更科学地理解宠物。',
  ogType: 'website',
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '首页',
            item: new URL('/', siteOrigin).toString(),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'AI 宠物理解引擎',
            item: pageUrl,
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="ai-understanding-page">
    <PageHero :title="pageData.hero.title" :description="pageData.hero.description">
      <template #breadcrumb>
        <nav class="breadcrumb" aria-label="面包屑">
          <NuxtLink to="/">首页</NuxtLink>
          <span aria-hidden="true">/</span>
          <span>AI 宠物理解引擎</span>
        </nav>
      </template>
      <template #actions>
        <BaseButton :to="pageData.hero.primaryAction.href" size="lg">
          {{ pageData.hero.primaryAction.label }}
          <template #iconRight>
            <BaseIcon name="arrow-right" />
          </template>
        </BaseButton>
        <BaseButton :to="pageData.hero.secondaryAction.href" variant="secondary" size="lg">
          {{ pageData.hero.secondaryAction.label }}
        </BaseButton>
      </template>
      <template #tags>
        <p class="hero-note">{{ pageData.hero.note }}</p>
      </template>
      <template #media>
        <div class="hero-visual" aria-label="AI 宠物理解示意">
          <BaseImage
            :src="pageData.hero.image.src"
            :alt="pageData.hero.image.alt"
            aspect-ratio="4 / 3"
            radius="lg"
            priority
            concept
          />
          <div class="sound-wave" aria-label="轻量声音波形">
            <span v-for="index in 12" :key="index" />
          </div>
          <ul class="hero-visual__labels" aria-label="动作和状态标签">
            <li v-for="label in pageData.hero.visualLabels" :key="label">{{ label }}</li>
          </ul>
          <aside class="hero-result" aria-label="分析结果示意">
            <strong>{{ pageData.analysisExample.confidenceLabel }}</strong>
            <p>{{ pageData.analysisExample.possibleState }}</p>
            <span>{{ pageData.analysisExample.riskLevel }}</span>
          </aside>
        </div>
      </template>
    </PageHero>

    <BaseContainer
      id="expression"
      :ref="register"
      tag="section"
      class="ai-section expression-section"
      width="wide"
      aria-labelledby="expression-title"
    >
      <SectionHeading
        id="expression-title"
        :title="pageData.expression.title"
        :description="pageData.expression.description"
      />
      <div class="expression-layout">
        <BaseImage
          :src="pageData.expression.image.src"
          :alt="pageData.expression.image.alt"
          aspect-ratio="16 / 10"
          radius="lg"
          concept
        />
        <div class="dimension-list" aria-label="宠物表达维度">
          <div v-for="dimension in pageData.expression.dimensions" :key="dimension.label">
            <h3>{{ dimension.label }}</h3>
            <p>{{ dimension.description }}</p>
          </div>
        </div>
      </div>
    </BaseContainer>

    <section
      id="principles"
      :ref="register"
      class="ai-section process-section"
      aria-labelledby="principles-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="principles-title"
          title="多模态分析过程"
          description="知宠把单一信号放回真实生活场景中理解，再把推测结果转化为主人能看懂的依据和建议。"
        />
        <ProcessSteps :steps="pageData.process" />
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="ai-section capabilities-section"
      width="wide"
      aria-labelledby="capabilities-title"
    >
      <SectionHeading
        id="capabilities-title"
        title="核心理解能力"
        description="能力表达保持克制：强调可能状态、趋势和风险提示，不承诺绝对识别。"
      />
      <div class="capability-grid">
        <article v-for="capability in pageData.capabilities" :key="capability.id" class="capability-item">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="capability.icon" />
          </span>
          <div>
            <h3>{{ capability.title }}</h3>
            <p>{{ capability.description }}</p>
          </div>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="ai-section example-section"
      aria-labelledby="example-title"
    >
      <BaseContainer width="wide">
        <article class="analysis-example" :aria-label="pageData.analysisExample.label">
          <div class="analysis-example__head">
            <BaseTag tone="concept">{{ pageData.analysisExample.label }}</BaseTag>
            <h2 id="example-title">{{ pageData.analysisExample.title }}</h2>
            <p>{{ pageData.analysisExample.possibleState }}</p>
          </div>
          <div class="analysis-example__panel">
            <div class="confidence-block">
              <strong>{{ pageData.analysisExample.confidenceLabel }}</strong>
              <span>{{ pageData.analysisExample.riskLevel }}</span>
            </div>
            <div class="analysis-columns">
              <section aria-labelledby="basis-title">
                <h3 id="basis-title">分析依据</h3>
                <ul>
                  <li v-for="item in pageData.analysisExample.basis" :key="item">
                    <BaseIcon name="check-circle" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </section>
              <section aria-labelledby="alternatives-title">
                <h3 id="alternatives-title">其他可能解释</h3>
                <ul>
                  <li v-for="item in pageData.analysisExample.alternatives" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </section>
            </div>
            <div class="guidance-block">
              <h3>主人建议</h3>
              <p>{{ pageData.analysisExample.recommendation }}</p>
            </div>
            <div class="boundary-notes">
              <p>{{ pageData.analysisExample.uncertainty }}</p>
              <p>{{ pageData.analysisExample.medicalBoundary }}</p>
            </div>
          </div>
        </article>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="ai-section profile-section"
      width="wide"
      aria-labelledby="profile-title"
    >
      <div class="profile-layout">
        <BaseImage
          :src="pageData.profile.image.src"
          :alt="pageData.profile.image.alt"
          aspect-ratio="16 / 10"
          radius="lg"
          concept
        />
        <div class="profile-copy">
          <SectionHeading
            id="profile-title"
            :title="pageData.profile.title"
            :description="pageData.profile.description"
          />
          <ul class="profile-list" aria-label="个体画像内容">
            <li v-for="attribute in pageData.profile.attributes" :key="attribute">
              {{ attribute }}
            </li>
          </ul>
        </div>
      </div>
    </BaseContainer>

    <section
      id="scenarios"
      :ref="register"
      class="ai-section scenarios-section"
      aria-labelledby="scenarios-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="scenarios-title"
          title="应用场景"
          description="每个场景都提供分析依据和可能解释，避免用一个绝对标签替代真实照护判断。"
        />
        <div class="scenario-list">
          <article v-for="scenario in pageData.scenarios" :key="scenario.id" class="scenario-item">
            <h3>{{ scenario.title }}</h3>
            <p>{{ scenario.description }}</p>
          </article>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="ai-section boundary-section"
      width="wide"
      aria-labelledby="boundary-title"
    >
      <SectionHeading
        id="boundary-title"
        title="科学边界"
        description="AI 宠物理解必须把能力边界说清楚，尤其是医疗、隐私和数据不足的情况。"
      />
      <div class="boundary-list">
        <details v-for="(item, index) in pageData.boundaries" :key="item.title" :open="index === 0">
          <summary>{{ item.title }}</summary>
          <p>{{ item.description }}</p>
        </details>
      </div>
    </BaseContainer>

    <CTASection
      :title="pageData.cta.title"
      :description="pageData.cta.description"
      :primary-label="pageData.cta.action.label"
      :primary-to="pageData.cta.action.href"
      :show-secondary="false"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.ai-understanding-page {
  overflow: hidden;
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

.hero-note {
  max-width: 640px;
  padding: var(--space-4);
  border-left: 3px solid var(--color-accent-500);
  color: var(--color-text-secondary);
  background: rgb(246 234 216 / 42%);
  font-size: 15px;
}

:deep(.page-hero__media) {
  padding: var(--space-4);
}

.hero-visual {
  position: relative;
  display: grid;
  gap: var(--space-4);
  min-height: 100%;
}

.hero-visual :deep(.base-image) {
  min-height: 250px;
}

.sound-wave {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 52px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.sound-wave span {
  width: 6px;
  height: 18px;
  border-radius: var(--radius-pill);
  background: var(--color-accent-500);
  opacity: 0.72;
}

.sound-wave span:nth-child(3n + 1) {
  height: 30px;
}

.sound-wave span:nth-child(3n + 2) {
  height: 42px;
  background: var(--color-success);
}

.hero-visual__labels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.hero-visual__labels li,
.profile-list li {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface-soft);
  font-size: 13px;
  font-weight: 650;
}

.hero-result {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.hero-result strong,
.confidence-block strong {
  color: var(--color-accent-600);
  font-size: 24px;
  font-weight: 850;
}

.hero-result p,
.hero-result span,
.dimension-list p,
.capability-item p,
.analysis-example p,
.scenario-item p,
.boundary-list p,
.profile-copy p {
  color: var(--color-text-secondary);
}

.ai-section {
  @include section-spacing;
}

.expression-layout,
.profile-layout {
  display: grid;
  grid-template-columns: minmax(360px, 0.86fr) minmax(0, 1fr);
  gap: var(--space-8);
  align-items: center;
}

.dimension-list {
  display: grid;
  gap: var(--space-4);
}

.dimension-list div,
.capability-item,
.scenario-item {
  display: grid;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.process-section,
.example-section,
.scenarios-section {
  background: var(--color-surface-soft);
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-5);
}

.capability-item {
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
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

.analysis-example {
  display: grid;
  grid-template-columns: minmax(0, 0.58fr) minmax(0, 1fr);
  gap: var(--space-7);
  align-items: start;
}

.analysis-example__head {
  position: sticky;
  top: 104px;
  display: grid;
  gap: var(--space-4);
}

.analysis-example__panel {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
}

.confidence-block {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.confidence-block span {
  color: var(--color-brand-900);
  font-weight: 750;
}

.analysis-columns {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: var(--space-5);
}

.analysis-columns section,
.guidance-block,
.boundary-notes {
  display: grid;
  gap: var(--space-3);
}

.analysis-columns ul {
  display: grid;
  gap: var(--space-3);
  padding: 0;
  margin: 0;
  list-style: none;
}

.analysis-columns li {
  display: flex;
  gap: var(--space-2);
  align-items: flex-start;
  color: var(--color-text-secondary);
}

.analysis-columns .base-icon {
  margin-top: 2px;
  color: var(--color-success);
  font-size: 17px;
}

.guidance-block {
  padding: var(--space-4);
  border-radius: var(--radius-card);
  background: var(--color-surface-soft);
}

.boundary-notes {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.profile-copy :deep(.section-heading) {
  margin-bottom: var(--space-5);
}

.profile-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.scenario-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.boundary-list {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.boundary-list details {
  border-top: 1px solid var(--color-border);
}

.boundary-list details:first-child {
  border-top: 0;
}

.boundary-list summary {
  cursor: pointer;
  padding: var(--space-4) var(--space-5);
  color: var(--color-brand-900);
  font-weight: 750;
}

.boundary-list summary:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
  outline-offset: -2px;
}

.boundary-list p {
  max-width: 840px;
  padding: 0 var(--space-5) var(--space-4);
}

@media (max-width: 1100px) {
  .expression-layout,
  .profile-layout,
  .analysis-example,
  .analysis-columns,
  .capability-grid,
  .scenario-list {
    grid-template-columns: 1fr;
  }

  .analysis-example__head {
    position: static;
  }

  .capability-grid {
    gap: var(--space-4);
  }
}

@media (max-width: 640px) {
  :deep(.page-hero__media) {
    padding: var(--space-3);
  }

  .hero-note,
  .analysis-example__panel,
  .guidance-block {
    padding: var(--space-4);
  }

  .hero-result strong,
  .confidence-block strong {
    font-size: 20px;
  }

  .capability-item {
    grid-template-columns: 1fr;
  }

  .confidence-block {
    align-items: flex-start;
    flex-direction: column;
  }

  .boundary-list summary {
    padding: var(--space-4);
  }

  .boundary-list p {
    padding-inline: var(--space-4);
  }
}
</style>
<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { solutionCards } from '~/data/solutions'
import type { IconName } from '~/types/ui'

const { register } = useScrollReveal()

const collaborationSteps: Array<{ id: string; icon: IconName; title: string; description: string }> = [
  {
    id: 'record',
    icon: 'collar',
    title: '设备记录',
    description: '从日常佩戴和健康信号出发，沉淀连续记录，具体设备能力待样机验证。',
  },
  {
    id: 'app',
    icon: 'phone',
    title: 'App 协作',
    description: '将档案、提醒和家庭成员协作放在同一入口，减少信息分散和重复沟通。',
  },
  {
    id: 'service',
    icon: 'building',
    title: '服务连接',
    description: '为医院、门店与合作机构预留连接路径，真实合作流程确认后再上线。',
  },
]

const confirmationItems = [
  { label: '合作机构名单', value: '待项目方确认' },
  { label: '服务覆盖城市', value: '待项目方确认' },
  { label: '上线节奏', value: '待项目方确认' },
]

useSeoMeta({
  title: '解决方案 | 知宠 ZHIPET',
  description:
    '知宠 ZHIPET 解决方案中心，展示家庭养宠、宠物医院和宠物门店的当前方案方向。真实服务范围和合作信息以项目方确认为准。',
  ogTitle: '解决方案 | 知宠 ZHIPET',
  ogDescription: '展示家庭、医院与门店场景下的宠物健康管理方案方向。',
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
          <h1 id="solutions-title">解决方案</h1>
          <p>
            知宠围绕家庭、宠物医院和宠物门店三个核心场景设计解决方案。当前页面只展示方案方向，真实服务范围、合作机构和上线信息待项目方确认。
          </p>
          <div class="solutions-hero__actions" aria-label="解决方案主要操作">
            <BaseButton to="/solutions/family" size="lg">
              查看家庭方案
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="/demo" variant="text" size="lg">预约方案演示</BaseButton>
          </div>
        </div>
        <aside class="solutions-hero__visual" aria-label="解决方案边界概览">
          <BaseImage
            src="/images/concepts/family-solution.svg"
            alt="知宠家庭养宠解决方案概念视觉"
            aspect-ratio="16 / 10"
            radius="lg"
            priority
            concept
            label-placement="below"
          />
          <div class="solutions-hero__status">
            <span>公开信息边界</span>
            <strong>方案方向已整理，落地资料待确认</strong>
            <p>不展示未确认客户、价格、资质、覆盖城市或服务效果数据。</p>
          </div>
        </aside>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="solutions-section scenario-route-section"
      width="wide"
      aria-labelledby="scenario-route-title"
    >
      <SectionHeading
        id="scenario-route-title"
        title="先按角色进入"
        description="家庭用户、医疗机构和门店服务者关注的入口不同，但共用同一套记录、理解和协作思路。"
      />
      <nav class="scenario-route-list" aria-label="解决方案角色入口">
        <NuxtLink
          v-for="solution in solutionCards"
          :key="solution.id"
          class="scenario-route-card"
          :to="solution.href ?? '/solutions'"
        >
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="solution.icon" />
          </span>
          <div>
            <BaseTag tone="concept">{{ solution.status }}</BaseTag>
            <h2>{{ solution.title }}</h2>
            <p>{{ solution.audience }}</p>
          </div>
          <BaseIcon name="arrow-right" class="scenario-route-card__arrow" aria-hidden="true" />
        </NuxtLink>
      </nav>
    </BaseContainer>

    <BaseContainer
      :ref="register"
      tag="section"
      class="solutions-section"
      width="wide"
      aria-labelledby="solution-list-title"
    >
      <SectionHeading
        id="solution-list-title"
        title="按场景选择知宠方案"
        description="先呈现官网信息架构中的核心场景，不展示未确认客户、价格、资质或落地数据。"
      />
      <div class="solution-grid">
        <article v-for="solution in solutionCards" :key="solution.id" class="solution-card">
          <BaseImage
            :src="solution.image"
            :alt="solution.alt"
            aspect-ratio="4 / 3"
            radius="lg"
            concept
            label-placement="below"
          />
          <div class="solution-card__body">
            <div class="solution-card__head">
              <span class="icon-shell" aria-hidden="true">
                <BaseIcon :name="solution.icon" />
              </span>
              <div>
                <h2>{{ solution.title }}</h2>
                <p>{{ solution.audience }}</p>
              </div>
            </div>
            <BaseTag tone="concept">{{ solution.status }}</BaseTag>
            <p class="solution-card__summary">{{ solution.summary }}</p>
            <ul>
              <li v-for="feature in solution.features" :key="feature">{{ feature }}</li>
            </ul>
            <BaseButton v-if="solution.href" :to="solution.href" variant="text">
              查看方案详情
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton v-else disabled variant="text">方案细节待项目方确认</BaseButton>
          </div>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="solutions-section collaboration-section"
      aria-labelledby="collaboration-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="collaboration-title"
          title="设备、App 与服务连接"
          description="方案不是把概念能力包装成结果承诺，而是先建立可验证的记录、提醒和服务协同路径。"
        />
        <ol class="collaboration-list">
          <li v-for="step in collaborationSteps" :key="step.id">
            <span class="icon-shell" aria-hidden="true">
              <BaseIcon :name="step.icon" />
            </span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </li>
        </ol>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="solutions-section confirmation-section"
      width="wide"
      aria-labelledby="confirmation-title"
    >
      <SectionHeading
        id="confirmation-title"
        title="待确认资料"
        description="以下资料确认后才能成为正式官网信息，当前不生成看似真实的客户或资质证明。"
      />
      <div class="confirmation-list">
        <div v-for="item in confirmationItems" :key="item.label" class="confirmation-row">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </BaseContainer>

    <CTASection
      title="需要匹配您的养宠或机构场景？"
      description="预约演示，确认适用场景、当前样机能力和下一步合作方式。"
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
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.82fr);
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
  font-size: 52px;
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

.solutions-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}

.solutions-hero__visual {
  position: relative;
  overflow: hidden;
  min-width: 0;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 86%), rgb(246 241 233 / 72%)),
    var(--color-surface-soft);
}

.solutions-hero__visual::after {
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(232 200 148 / 72%), transparent);
  content: '';
}

.solutions-hero__visual :deep(.base-image__frame) {
  box-shadow: 0 22px 56px rgb(47 36 27 / 8%);
}

.solutions-hero__status {
  position: absolute;
  right: var(--space-7);
  bottom: var(--space-8);
  display: grid;
  max-width: 300px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 88%);
}

.solutions-hero__status span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.solutions-hero__status strong {
  color: var(--color-brand-900);
  font-size: 18px;
  line-height: 1.35;
}

.solutions-hero__status p {
  font-size: 13px;
}

.solutions-section {
  @include section-spacing;
}

.scenario-route-section {
  padding-top: var(--space-6);
}

.scenario-route-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.scenario-route-card {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-4);
  align-items: start;
  min-width: 0;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  color: inherit;
  background: var(--color-surface);
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    box-shadow var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.scenario-route-card:hover,
.scenario-route-card:focus-visible {
  border-color: rgb(200 138 56 / 45%);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.scenario-route-card h2 {
  margin: var(--space-2) 0 var(--space-1);
  font-size: 20px;
}

.scenario-route-card p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.scenario-route-card__arrow {
  color: var(--color-accent-600);
  font-size: 20px;
  transition: transform var(--motion-duration-fast) var(--motion-ease-out);
}

.scenario-route-card:hover .scenario-route-card__arrow,
.scenario-route-card:focus-visible .scenario-route-card__arrow {
  transform: translateX(3px);
}

.solution-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.solution-card {
  display: grid;
  grid-template-rows: auto 1fr;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    box-shadow var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.solution-card:hover,
.solution-card:focus-within {
  border-color: rgb(200 138 56 / 45%);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.solution-card__body {
  display: grid;
  gap: var(--space-4);
  align-content: start;
  padding: var(--space-5);
}

.solution-card__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
  align-items: start;
}

.solution-card h2 {
  margin-bottom: var(--space-1);
}

.solution-card__head p,
.solution-card__summary,
.collaboration-list p {
  color: var(--color-text-secondary);
}

.solution-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.solution-card li {
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

.collaboration-section {
  background: var(--color-surface-soft);
}

.collaboration-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
  padding: 0;
  margin: 0;
  list-style: none;
}

.collaboration-list li {
  display: grid;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.confirmation-list {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
  overflow: hidden;
}

.confirmation-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.4fr) minmax(0, 1fr);
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
  color: var(--color-text-secondary);
  font-weight: 650;
}

@media (max-width: 1100px) {
  .solutions-hero__inner,
  .solution-grid,
  .collaboration-list,
  .scenario-route-list {
    grid-template-columns: 1fr;
  }

  .solutions-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 560px) {
  .solutions-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .solutions-hero__copy {
    gap: var(--space-3);
  }

  .solutions-hero h1 {
    font-size: 36px;
  }

  .solutions-hero p {
    font-size: 15px;
  }

  .solutions-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .solutions-hero__visual {
    padding: var(--space-4);
  }

  .solutions-hero__status {
    position: static;
    max-width: none;
    margin-top: var(--space-3);
  }

  .scenario-route-card {
    grid-template-columns: 1fr auto;
  }

  .scenario-route-card .icon-shell {
    grid-column: 1 / -1;
  }

  .confirmation-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scenario-route-card:hover,
  .scenario-route-card:focus-visible,
  .solution-card:hover,
  .solution-card:focus-within,
  .scenario-route-card:hover .scenario-route-card__arrow,
  .scenario-route-card:focus-visible .scenario-route-card__arrow {
    transform: none;
  }
}
</style>


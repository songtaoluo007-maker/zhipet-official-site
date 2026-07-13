<script setup lang="ts">
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import CTASection from '~/components/common/CTASection.vue'
import EditorialHero from '~/components/common/EditorialHero.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import type { SolutionDetail } from '~/types/solution'

const props = defineProps<{
  solution: SolutionDetail
}>()

const { register } = useScrollReveal()
const solution = props.solution
</script>

<template>
  <main class="solution-detail-page">
    <EditorialHero
      :eyebrow="solution.breadcrumbLabel"
      :title="solution.title"
      :description="solution.summary"
      :image="solution.cover"
      :image-alt="solution.coverAlt"
      :crumbs="[
        { label: '首页', to: '/' },
        { label: '解决方案', to: '/solutions' },
        { label: solution.breadcrumbLabel },
      ]"
      primary-label="查看服务路径"
      primary-to="#workflow"
      :secondary-label="solution.secondaryAction?.label ?? '邮件联系我们'"
      :secondary-to="solution.secondaryAction?.to ?? '/contact'"
      priority
    />

    <BaseContainer
      id="pain-points"
      :ref="register"
      tag="section"
      class="solution-section"
      width="wide"
      aria-labelledby="pain-points-title"
    >
      <SectionHeading
        id="pain-points-title"
        :title="solution.sections.painTitle"
        :description="solution.sections.painDescription"
        align="left"
      />
      <div class="insight-line">
        <article v-for="(item, index) in solution.painPoints" :key="item.id">
          <span>0{{ index + 1 }}</span>
          <BaseIcon :name="item.icon" aria-hidden="true" />
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <section
      id="workflow"
      :ref="register"
      class="solution-section workflow-band"
      aria-labelledby="workflow-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="workflow-title"
          :title="solution.sections.workflowTitle"
          :description="solution.sections.workflowDescription"
          align="left"
        />
        <ol class="workflow-line" aria-label="方案流程">
          <li v-for="step in solution.workflow" :key="step.id">
            <span>{{ step.order }}</span>
            <div>
              <h2>{{ step.title }}</h2>
              <p>{{ step.description }}</p>
            </div>
          </li>
        </ol>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="solution-section"
      width="wide"
      aria-labelledby="modules-title"
    >
      <SectionHeading
        id="modules-title"
        :title="solution.sections.modulesTitle"
        :description="solution.sections.modulesDescription"
        align="left"
      />
      <div class="module-rows">
        <article v-for="module in solution.modules" :key="module.id">
          <BaseIcon :name="module.icon" aria-hidden="true" />
          <h2>{{ module.title }}</h2>
          <p>{{ module.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="solution-section guardrail-band"
      aria-labelledby="boundary-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="boundary-title"
          :title="solution.sections.boundaryTitle"
          :description="solution.sections.boundaryDescription"
          align="left"
        />
        <div class="guardrail-line">
          <article v-for="item in solution.guardrails" :key="item.id">
            <BaseIcon name="shield-check" aria-hidden="true" />
            <div>
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      :title="solution.sections.ctaTitle"
      :description="solution.sections.ctaDescription"
      primary-label="邮件联系我们"
      primary-to="/contact"
      secondary-label="返回解决方案"
      secondary-to="/solutions"
    />
  </main>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.solution-detail-page {
  overflow: hidden;
}

.solution-section {
  @include section-spacing;
}

.insight-line {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: var(--space-7);
  border-block: 1px solid var(--color-border);
}

.insight-line article {
  position: relative;
  display: grid;
  min-height: 300px;
  align-content: start;
  gap: var(--space-3);
  padding: var(--space-5);
  border-left: 1px solid var(--color-border);
}

.insight-line article:first-child {
  border-left: 0;
}

.insight-line article > span {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 850;
}

.insight-line .base-icon {
  margin-top: var(--space-4);
  color: var(--color-sage-700);
  font-size: 26px;
}

.insight-line h2,
.module-rows h2,
.guardrail-line h2,
.workflow-line h2 {
  font-size: 20px;
  line-height: 1.3;
}

.insight-line p,
.module-rows p,
.guardrail-line p,
.workflow-line p {
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.workflow-band {
  color: #fff;
  background: #22372e;
}

.workflow-band :deep(.section-heading h2),
.workflow-band :deep(.section-heading p) {
  color: #fff;
}

.workflow-band :deep(.section-heading p) {
  opacity: 0.72;
}

.workflow-line {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  padding: 0;
  margin: var(--space-7) 0 0;
  border-top: 1px solid rgb(255 255 255 / 18%);
  list-style: none;
}

.workflow-line li {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: var(--space-4);
  min-height: 180px;
  padding: var(--space-5);
  border-right: 1px solid rgb(255 255 255 / 18%);
  border-bottom: 1px solid rgb(255 255 255 / 18%);
}

.workflow-line li:nth-child(even) {
  border-right: 0;
}

.workflow-line li > span {
  color: var(--color-accent-300);
  font-size: 14px;
  font-weight: 850;
}

.workflow-line h2 {
  color: #fff;
}

.workflow-line p {
  margin-top: var(--space-2);
  color: rgb(255 255 255 / 68%);
}

.module-rows {
  margin-top: var(--space-7);
  border-top: 1px solid var(--color-border);
}

.module-rows article {
  display: grid;
  grid-template-columns: 64px minmax(220px, 0.42fr) minmax(0, 1fr);
  gap: var(--space-5);
  align-items: start;
  padding-block: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.module-rows .base-icon {
  color: var(--color-accent-600);
  font-size: 26px;
}

.guardrail-band {
  background: #eef2ec;
}

.guardrail-line {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: var(--space-7);
  border-block: 1px solid rgb(33 72 55 / 18%);
}

.guardrail-line article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
  padding: var(--space-5);
  border-left: 1px solid rgb(33 72 55 / 18%);
}

.guardrail-line article:first-child {
  border-left: 0;
}

.guardrail-line .base-icon {
  color: var(--color-sage-700);
  font-size: 22px;
}

@media (max-width: 900px) {
  .insight-line,
  .guardrail-line {
    grid-template-columns: 1fr;
  }

  .insight-line article,
  .guardrail-line article {
    min-height: 0;
    border-top: 1px solid var(--color-border);
    border-left: 0;
  }

  .insight-line article:first-child,
  .guardrail-line article:first-child {
    border-top: 0;
  }
}

@media (max-width: 680px) {
  .workflow-line {
    grid-template-columns: 1fr;
  }

  .workflow-line li,
  .workflow-line li:nth-child(even) {
    grid-template-columns: 42px minmax(0, 1fr);
    min-height: 0;
    padding-inline: 0;
    border-right: 0;
  }

  .module-rows article {
    grid-template-columns: 42px minmax(0, 1fr);
  }

  .module-rows article p {
    grid-column: 2;
  }
}
</style>

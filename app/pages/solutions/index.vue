<script setup lang="ts">
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import CTASection from '~/components/common/CTASection.vue'
import EditorialHero from '~/components/common/EditorialHero.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { usePublicAssetUrl } from '~/composables/usePublicAssetUrl'
import { solutionJourneySteps, solutionScenarios, trustStrip } from '~/data/v2'

const { register } = useScrollReveal()
const publicAssetUrl = usePublicAssetUrl()
const householdScenario = solutionScenarios.find((scenario) => scenario.track === 'household')
const professionalScenarios = solutionScenarios.filter(
  (scenario) => scenario.track === 'professional',
)

if (!householdScenario || professionalScenarios.length === 0) {
  throw new Error('解决方案场景配置不完整')
}

useSeoMeta({
  title: '解决方案 | 知宠 ZHIPET',
  description: '面向家庭养宠、宠物医院与宠物门店，呈现知宠在不同场景中的连接方式与服务边界。',
  ogTitle: '解决方案 | 知宠 ZHIPET',
  ogDescription: '同一套能力，服务家庭、医院与门店等不同场景。',
  ogType: 'website',
})
</script>

<template>
  <main class="solutions-page">
    <EditorialHero
      eyebrow="解决方案"
      title="同一套能力，服务不同场景"
      description="知宠把安全提醒、连续观察与状态理解放进真实照护关系中，让家庭与专业服务之间的信息更连贯。"
      image="/images/generated/pages/zhipet-demo-consult-scene.webp"
      image-alt="知宠团队与养宠家庭沟通照护方案概念场景"
      object-position="center"
      :crumbs="[{ label: '首页', to: '/' }, { label: '解决方案' }]"
      primary-label="浏览场景"
      primary-to="#solution-scenes"
      secondary-label="邮件联系我们"
      secondary-to="/contact"
      priority
    />

    <BaseContainer
      id="solution-scenes"
      :ref="register"
      tag="section"
      class="solution-scenes"
      width="wide"
      aria-labelledby="solution-scenes-title"
    >
      <SectionHeading
        id="solution-scenes-title"
        title="先选择您所在的场景"
        description="家庭用户关注日常陪伴与安全，专业机构关注授权协作与服务连续性。两条路径各自展开，不让信息混在一起。"
        align="left"
      />

      <nav class="audience-switch" aria-label="解决方案受众">
        <a href="#household-path">
          <span>01</span>
          <strong>我是养宠家庭</strong>
          <small>日常安全、连续观察与家庭共享</small>
        </a>
        <a href="#professional-path">
          <span>02</span>
          <strong>我是专业机构</strong>
          <small>医院与门店的授权协作和服务衔接</small>
        </a>
      </nav>

      <section class="solution-flow" aria-labelledby="solution-flow-title">
        <header class="solution-flow__head">
          <div>
            <p>协作流程</p>
            <h2 id="solution-flow-title">从选择场景到持续沟通</h2>
          </div>
          <p>先把使用对象和信息边界说清楚，再让连续记录服务于日常照护与专业沟通。</p>
        </header>
        <ol class="solution-flow__steps">
          <li v-for="(step, index) in solutionJourneySteps" :key="step.id">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <BaseIcon :name="step.icon" aria-hidden="true" />
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section
        id="household-path"
        class="household-path"
        aria-labelledby="household-path-title"
      >
        <NuxtLink
          :to="householdScenario.href"
          class="household-feature"
        >
          <div class="household-feature__media">
            <img
              :src="publicAssetUrl(householdScenario.image)"
              :alt="householdScenario.alt"
              :style="{ objectPosition: householdScenario.imagePosition }"
              loading="lazy"
            >
            <span>AI 概念图，仅供参考</span>
          </div>
          <div class="household-feature__copy">
            <span>家庭路径 / {{ householdScenario.audience }}</span>
            <h2 id="household-path-title">{{ householdScenario.title }}</h2>
            <p>{{ householdScenario.description }}</p>
            <ul aria-label="家庭场景能力">
              <li v-for="ability in householdScenario.abilities" :key="ability">
                {{ ability }}
              </li>
            </ul>
            <strong>
              查看家庭方案
              <BaseIcon name="arrow-right" />
            </strong>
          </div>
        </NuxtLink>
      </section>

      <section
        id="professional-path"
        class="professional-path"
        aria-labelledby="professional-path-title"
      >
        <header class="professional-path__head">
          <div>
            <p>专业路径</p>
            <h2 id="professional-path-title">把授权信息带进服务现场</h2>
          </div>
          <p>医院和门店承担不同任务，因此分别呈现协作方式、可见信息与能力边界。</p>
        </header>

        <div class="professional-grid">
          <NuxtLink
            v-for="scenario in professionalScenarios"
            :key="scenario.id"
            :to="scenario.href"
            class="professional-scene"
          >
            <div class="professional-scene__media">
              <img
                :src="publicAssetUrl(scenario.image)"
                :alt="scenario.alt"
                :style="{ objectPosition: scenario.imagePosition }"
                loading="lazy"
              >
              <span>AI 概念图，仅供参考</span>
            </div>
            <div class="professional-scene__copy">
              <span>{{ scenario.audience }}</span>
              <h3>{{ scenario.title }}</h3>
              <p>{{ scenario.description }}</p>
              <ul :aria-label="`${scenario.audience}场景能力`">
                <li v-for="ability in scenario.abilities" :key="ability">{{ ability }}</li>
              </ul>
              <strong>
                查看对应方案
                <BaseIcon name="arrow-right" />
              </strong>
            </div>
          </NuxtLink>
        </div>
      </section>
    </BaseContainer>

    <section :ref="register" class="trust-band" aria-labelledby="solution-trust-title">
      <BaseContainer width="wide">
        <SectionHeading
          id="solution-trust-title"
          title="连接之前，先建立信任"
          description="数据、协作与专业判断都有明确边界，技术只为更好的照护服务。"
          align="left"
        />
        <div class="trust-line">
          <article v-for="item in trustStrip" :key="item.id">
            <BaseIcon :name="item.icon" aria-hidden="true" />
            <div>
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="想聊聊适合您的使用场景？"
      description="通过公开邮箱联系知宠团队，或在反馈页面告诉我们您的问题。"
      primary-label="邮件联系我们"
      primary-to="/contact"
      secondary-label="意见问题反馈"
      secondary-to="/help#feedback"
    />
  </main>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.solutions-page {
  overflow: hidden;
}

.solution-scenes {
  @include section-spacing;
}

.audience-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin-top: var(--space-7);
  border-block: 1px solid var(--color-border-strong);
  background: var(--color-border);
}

.audience-switch a {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-1) var(--space-3);
  padding: var(--space-5);
  color: var(--color-brand-900);
  background: var(--color-bg);
}

.audience-switch a:hover strong,
.audience-switch a:focus-visible strong {
  color: var(--color-accent-600);
}

.audience-switch span {
  grid-row: 1 / 3;
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 850;
}

.audience-switch strong {
  font-size: 18px;
  transition: color var(--motion-duration-fast) var(--motion-ease-out);
}

.audience-switch small {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.solution-flow {
  margin-top: clamp(64px, 7vw, 88px);
}

.solution-flow__head {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(320px, 0.7fr);
  gap: var(--space-7);
  align-items: end;
  padding-bottom: var(--space-6);
}

.solution-flow__head > div > p {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.solution-flow__head h2 {
  max-width: 620px;
  margin-top: var(--space-2);
  font-size: 34px;
}

.solution-flow__head > p {
  color: var(--color-text-secondary);
  line-height: 1.75;
}

.solution-flow__steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 0;
  margin: 0;
  border-block: 1px solid var(--color-border-strong);
  list-style: none;
}

.solution-flow__steps li {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  gap: var(--space-3);
  align-items: start;
  padding: var(--space-5);
  border-left: 1px solid var(--color-border);
}

.solution-flow__steps li:first-child {
  border-left: 0;
}

.solution-flow__steps li > span {
  color: var(--color-accent-600);
  font-size: 12px;
  font-weight: 850;
}

.solution-flow__steps .base-icon {
  color: var(--color-sage-700);
  font-size: 22px;
}

.solution-flow__steps h3 {
  margin-bottom: var(--space-2);
  font-size: 18px;
}

.solution-flow__steps p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.65;
}

.household-path,
.professional-path {
  scroll-margin-top: calc(var(--header-height, 80px) + var(--space-5));
}

.household-path {
  margin-top: clamp(72px, 8vw, 104px);
}

.household-feature {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.72fr);
  min-height: 480px;
  color: #fff;
  background: var(--color-brand-900);
}

.household-feature__media,
.professional-scene__media {
  position: relative;
  overflow: hidden;
}

.household-feature__media img,
.professional-scene__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms var(--motion-ease-out);
}

.household-feature:hover .household-feature__media img,
.professional-scene:hover .professional-scene__media img {
  transform: scale(1.02);
}

.household-feature__media span,
.professional-scene__media span {
  position: absolute;
  right: var(--space-3);
  bottom: var(--space-3);
  color: rgb(255 255 255 / 72%);
  font-size: 11px;
  text-shadow: 0 1px 4px rgb(0 0 0 / 40%);
}

.household-feature__copy {
  display: grid;
  align-content: center;
  gap: var(--space-4);
  padding: clamp(36px, 6vw, 78px);
}

.household-feature__copy > span,
.professional-scene__copy > span,
.professional-path__head > div > p {
  color: var(--color-accent-300);
  font-size: 13px;
  font-weight: 800;
}

.household-feature h2 {
  max-width: 440px;
  color: #fff;
  font-size: 40px;
  line-height: 1.18;
}

.household-feature p {
  max-width: 500px;
  color: rgb(255 255 255 / 72%);
  line-height: 1.75;
}

.household-feature ul,
.professional-scene ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  padding: 0;
  margin: 0;
  list-style: none;
}

.household-feature ul {
  color: rgb(255 255 255 / 84%);
}

.household-feature li::before,
.professional-scene li::before {
  color: var(--color-accent-300);
  content: '·';
  margin-right: var(--space-2);
}

.household-feature strong,
.professional-scene strong {
  display: inline-flex;
  width: fit-content;
  gap: var(--space-2);
  align-items: center;
  padding-top: var(--space-3);
  font-size: 14px;
}

.household-feature strong {
  border-top: 1px solid rgb(255 255 255 / 18%);
}

.professional-path {
  margin-top: clamp(96px, 10vw, 136px);
}

.professional-path__head {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(320px, 0.7fr);
  gap: var(--space-7);
  align-items: end;
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border-strong);
}

.professional-path__head > div > p {
  color: var(--color-accent-600);
}

.professional-path__head h2 {
  max-width: 620px;
  margin-top: var(--space-2);
  font-size: 34px;
}

.professional-path__head > p {
  color: var(--color-text-secondary);
  line-height: 1.75;
}

.professional-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.professional-scene {
  display: grid;
  grid-template-rows: minmax(260px, 0.9fr) auto;
  border-bottom: 1px solid var(--color-border-strong);
  color: var(--color-brand-900);
}

.professional-scene__copy {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5) 0 var(--space-6);
}

.professional-scene__copy > span {
  color: var(--color-accent-600);
}

.professional-scene h3 {
  font-size: 25px;
  line-height: 1.3;
}

.professional-scene p {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.professional-scene ul {
  color: var(--color-brand-800);
}

.professional-scene strong {
  padding-top: var(--space-2);
  color: var(--color-brand-900);
}

.trust-band {
  @include section-spacing;

  background: #eef2ec;
}

.trust-line {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: var(--space-7);
  border-block: 1px solid rgb(33 72 55 / 18%);
}

.trust-line article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
  padding: var(--space-5);
  border-left: 1px solid rgb(33 72 55 / 18%);
}

.trust-line article:first-child {
  border-left: 0;
}

.trust-line .base-icon {
  color: var(--color-sage-700);
  font-size: 22px;
}

.trust-line h2 {
  margin-bottom: var(--space-2);
  font-size: 18px;
}

.trust-line p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.65;
}

@media (max-width: 940px) {
  .solution-flow__head {
    grid-template-columns: 1fr;
  }

  .household-feature {
    grid-template-columns: 1fr;
  }

  .household-feature__media {
    min-height: 420px;
  }

  .professional-path__head {
    grid-template-columns: 1fr;
  }

  .trust-line {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .trust-line article:nth-child(odd) {
    border-left: 0;
  }
}

@media (max-width: 620px) {
  .audience-switch,
  .solution-flow__steps,
  .professional-grid {
    grid-template-columns: 1fr;
  }

  .solution-flow__head h2 {
    font-size: 28px;
  }

  .solution-flow__steps li,
  .solution-flow__steps li:first-child {
    border-top: 1px solid var(--color-border);
    border-left: 0;
  }

  .solution-flow__steps li:first-child {
    border-top: 0;
  }

  .household-feature,
  .household-feature__media {
    min-height: 0;
  }

  .household-feature__media,
  .professional-scene__media {
    aspect-ratio: 4 / 3;
  }

  .household-feature__copy {
    padding: var(--space-5) var(--space-3) var(--space-7);
  }

  .household-feature h2 {
    font-size: 28px;
  }

  .professional-path__head h2 {
    font-size: 28px;
  }

  .professional-scene {
    grid-template-rows: auto;
  }

  .trust-line {
    grid-template-columns: 1fr;
  }

  .trust-line article,
  .trust-line article:nth-child(odd) {
    border-top: 1px solid rgb(33 72 55 / 18%);
    border-left: 0;
  }

  .trust-line article:first-child {
    border-top: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .audience-switch strong,
  .household-feature__media img,
  .professional-scene__media img {
    transition: none;
  }
}
</style>

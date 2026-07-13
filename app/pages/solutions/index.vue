<script setup lang="ts">
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import CTASection from '~/components/common/CTASection.vue'
import EditorialHero from '~/components/common/EditorialHero.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { solutionScenarios, trustStrip } from '~/data/v2'

const { register } = useScrollReveal()

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
      image-alt="知宠团队与养宠家庭沟通照护方案的真实场景"
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
        title="三种关系，一条照护链路"
        description="从家庭日常，到专业诊疗与线下服务，每个场景都以真实任务和清晰边界为起点。"
        align="left"
      />

      <div class="scene-list">
        <NuxtLink
          v-for="(scenario, index) in solutionScenarios"
          :key="scenario.id"
          :to="scenario.href"
          class="scene-row"
          :class="{ 'scene-row--reverse': index % 2 === 1 }"
        >
          <div class="scene-row__media">
            <img
              :src="scenario.image"
              :alt="scenario.alt"
              :style="{ objectPosition: scenario.imagePosition }"
              loading="lazy"
            >
            <span>AI 概念图，仅供参考</span>
          </div>
          <div class="scene-row__copy">
            <span class="scene-row__index">0{{ index + 1 }} / {{ scenario.audience }}</span>
            <h2>{{ scenario.title }}</h2>
            <p>{{ scenario.description }}</p>
            <ul aria-label="场景能力">
              <li v-for="ability in scenario.abilities" :key="ability">{{ ability }}</li>
            </ul>
            <strong>
              查看完整方案
              <BaseIcon name="arrow-right" />
            </strong>
          </div>
        </NuxtLink>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="trust-band"
      aria-labelledby="solution-trust-title"
    >
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

.scene-list {
  display: grid;
  margin-top: var(--space-7);
  border-top: 1px solid var(--color-border);
}

.scene-row {
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(360px, 0.74fr);
  min-height: 420px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-brand-900);
}

.scene-row--reverse .scene-row__media {
  order: 2;
}

.scene-row__media {
  position: relative;
  min-height: 420px;
  overflow: hidden;
}

.scene-row__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms var(--motion-ease-out);
}

.scene-row:hover .scene-row__media img {
  transform: scale(1.02);
}

.scene-row__media span {
  position: absolute;
  right: var(--space-3);
  bottom: var(--space-3);
  color: rgb(255 255 255 / 72%);
  font-size: 11px;
  text-shadow: 0 1px 4px rgb(0 0 0 / 40%);
}

.scene-row__copy {
  display: grid;
  align-content: center;
  gap: var(--space-4);
  padding: clamp(36px, 6vw, 78px);
  background: var(--color-surface);
}

.scene-row__index {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.scene-row h2 {
  max-width: 440px;
  font-size: 36px;
  line-height: 1.18;
}

.scene-row p {
  max-width: 500px;
  color: var(--color-text-secondary);
  line-height: 1.75;
}

.scene-row ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  padding: 0;
  margin: 0;
  color: var(--color-brand-800);
  list-style: none;
}

.scene-row li::before {
  color: var(--color-accent-600);
  content: '·';
  margin-right: var(--space-2);
}

.scene-row strong {
  display: inline-flex;
  width: fit-content;
  gap: var(--space-2);
  align-items: center;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  font-size: 14px;
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
  .scene-row {
    grid-template-columns: 1fr;
  }

  .scene-row--reverse .scene-row__media {
    order: 0;
  }

  .trust-line {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .trust-line article:nth-child(odd) {
    border-left: 0;
  }
}

@media (max-width: 620px) {
  .scene-row,
  .scene-row__media {
    min-height: 0;
  }

  .scene-row__media {
    aspect-ratio: 4 / 3;
  }

  .scene-row__copy {
    padding: var(--space-5) var(--space-3) var(--space-7);
  }

  .scene-row h2 {
    font-size: 28px;
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
  .scene-row__media img {
    transition: none;
  }
}
</style>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import { usePublicAssetUrl } from '~/composables/usePublicAssetUrl'
import { useScrollReveal } from '~/composables/useScrollReveal'
import type { IconName } from '~/types/ui'

interface EditorialChapter {
  id: string
  number: string
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  href: string
  linkLabel: string
  icon: IconName
  layout: 'full' | 'inset' | 'edge'
  objectPosition: string
}

interface TrustPrinciple {
  id: string
  icon: IconName
  title: string
  description: string
}

const publicAssetUrl = usePublicAssetUrl()
const { register } = useScrollReveal()

const chapters: EditorialChapter[] = [
  {
    id: 'safety',
    number: '01',
    eyebrow: '安全边界',
    title: '让每一次出门，\n都多一份从容',
    description: '设定活动范围与停留区域，以位置线索和异常提醒辅助日常看护。',
    image: '/images/generated/zhipet-safety-collar.webp',
    imageAlt: '佩戴知宠智能项圈的金毛与猫咪站在明亮居家环境中',
    href: '/products/smart-collar',
    linkLabel: '了解安全能力',
    icon: 'shield-check',
    layout: 'full',
    objectPosition: '58% center',
  },
  {
    id: 'health',
    number: '02',
    eyebrow: '长期观察',
    title: '健康不是一次结论，\n而是持续看见变化',
    description: '把活动、休息和照护记录整理为趋势，让家庭更容易理解每天发生的细微变化。',
    image: '/images/generated/pages/zhipet-research-observation-scene.webp',
    imageAlt: '佩戴智能项圈的猫狗与健康趋势设备在居家环境中的观察场景',
    href: '/research',
    linkLabel: '走进健康研究院',
    icon: 'chart',
    layout: 'inset',
    objectPosition: '63% center',
  },
  {
    id: 'collaboration',
    number: '03',
    eyebrow: '专业协同',
    title: '让家庭与专业服务，\n围绕同一份线索沟通',
    description: '在获得用户授权后，整理可沟通的信息，帮助家庭与专业服务更高效地对齐。',
    image: '/images/generated/pages/zhipet-hospital-collab-scene.webp',
    imageAlt: '宠物医生与宠物家庭围绕猫狗进行沟通的专业协同场景',
    href: '/solutions/hospital',
    linkLabel: '了解专业协同方案',
    icon: 'users',
    layout: 'edge',
    objectPosition: '54% center',
  },
]

const trustPrinciples: TrustPrinciple[] = [
  {
    id: 'privacy',
    icon: 'lock',
    title: '隐私优先',
    description: '坚持必要范围内的数据使用，并由用户掌控授权。',
  },
  {
    id: 'evidence',
    icon: 'check-circle',
    title: '依据可见',
    description: '趋势与风险提示同时说明参考依据和不确定性。',
  },
  {
    id: 'boundary',
    icon: 'shield-check',
    title: '边界清晰',
    description: '不把状态解释包装成诊断，也不替代专业判断。',
  },
  {
    id: 'control',
    icon: 'heart-pulse',
    title: '陪伴为先',
    description: '技术保持克制，把更多注意力还给宠物与家庭。',
  },
]
</script>

<template>
  <section class="mobile-editorial" aria-labelledby="mobile-editorial-title">
    <header :ref="register" class="mobile-editorial__opening">
      <span class="mobile-editorial__kicker">首页第二幕 / 日常成为线索</span>
      <h2 id="mobile-editorial-title">从一次佩戴，<br >走进长期陪伴</h2>
      <p>
        设备记录只是起点。知宠希望把分散在日常里的活动、休息与照护信息，整理成家庭更容易理解的陪伴线索。
      </p>
      <NuxtLink class="mobile-editorial__text-link" to="/products">
        认识知宠产品体系
        <BaseIcon name="arrow-right" aria-hidden="true" />
      </NuxtLink>
    </header>

    <figure :ref="register" class="mobile-editorial__opening-visual">
      <img
        :src="publicAssetUrl('/images/generated/pages/zhipet-product-closeup-scene.webp')"
        alt="知宠智能项圈置于宠物家庭生活空间中的产品近景"
        loading="lazy"
      >
      <span class="mobile-editorial__visual-index" aria-hidden="true">Z / 01</span>
      <span class="mobile-editorial__ai-note" data-ai-disclosure>AI 概念图，仅供参考</span>
      <figcaption>
        <strong>设备 × App × 健康档案</strong>
        <span>让记录、趋势与提醒在同一条体验链路中衔接。</span>
      </figcaption>
    </figure>

    <ol :ref="register" class="mobile-editorial__path" aria-label="知宠陪伴链路">
      <li>
        <span>01</span>
        <strong>持续记录</strong>
      </li>
      <li>
        <span>02</span>
        <strong>趋势整理</strong>
      </li>
      <li>
        <span>03</span>
        <strong>协同照护</strong>
      </li>
    </ol>

    <div class="mobile-editorial__chapter-heading">
      <span>三段照护场景</span>
      <h2>从安全到健康，<br >把观察带回行动</h2>
    </div>

    <div class="mobile-editorial__chapters">
      <article
        v-for="chapter in chapters"
        :key="chapter.id"
        :ref="register"
        class="mobile-editorial__chapter"
        :class="`mobile-editorial__chapter--${chapter.layout}`"
        data-editorial-chapter
      >
        <NuxtLink class="mobile-editorial__chapter-visual" :to="chapter.href">
          <img
            :src="publicAssetUrl(chapter.image)"
            :alt="chapter.imageAlt"
            :style="{ objectPosition: chapter.objectPosition }"
            loading="lazy"
          >
          <span class="mobile-editorial__chapter-number" aria-hidden="true">{{
            chapter.number
          }}</span>
          <span class="mobile-editorial__ai-note" data-ai-disclosure>AI 概念图，仅供参考</span>
        </NuxtLink>

        <div class="mobile-editorial__chapter-copy">
          <span class="mobile-editorial__chapter-eyebrow">
            <BaseIcon :name="chapter.icon" aria-hidden="true" />
            {{ chapter.eyebrow }}
          </span>
          <h3>{{ chapter.title }}</h3>
          <p>{{ chapter.description }}</p>
          <NuxtLink class="mobile-editorial__text-link" :to="chapter.href">
            {{ chapter.linkLabel }}
            <BaseIcon name="arrow-right" aria-hidden="true" />
          </NuxtLink>
        </div>
      </article>
    </div>

    <section :ref="register" class="mobile-editorial__family" aria-labelledby="mobile-family-title">
      <img
        :src="publicAssetUrl('/images/generated/pages/zhipet-family-care-scene.webp')"
        alt="宠物主人在家中陪伴金毛与猫咪的家庭照护场景"
        loading="lazy"
      >
      <span class="mobile-editorial__family-shade" aria-hidden="true" />
      <span class="mobile-editorial__ai-note" data-ai-disclosure>AI 概念图，仅供参考</span>
      <div class="mobile-editorial__family-copy">
        <span>家庭日常</span>
        <h2 id="mobile-family-title">科技不打断相处，<br >只在需要时提供线索</h2>
        <NuxtLink class="mobile-editorial__light-link" to="/solutions/family">
          查看家庭照护方案
          <BaseIcon name="arrow-right" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <section :ref="register" class="mobile-editorial__trust" aria-labelledby="mobile-trust-title">
      <span class="mobile-editorial__trust-kicker">我们如何对待技术</span>
      <h2 id="mobile-trust-title">因信任而设计，<br >为陪伴而守护</h2>
      <div class="mobile-editorial__trust-list">
        <article v-for="principle in trustPrinciples" :key="principle.id">
          <BaseIcon :name="principle.icon" aria-hidden="true" />
          <div>
            <h3>{{ principle.title }}</h3>
            <p>{{ principle.description }}</p>
          </div>
        </article>
      </div>
      <NuxtLink class="mobile-editorial__light-link" to="/privacy">
        阅读隐私说明
        <BaseIcon name="arrow-right" aria-hidden="true" />
      </NuxtLink>
    </section>

    <section
      :ref="register"
      class="mobile-editorial__download"
      aria-labelledby="mobile-download-title"
    >
      <div class="mobile-editorial__download-visual">
        <img
          :src="publicAssetUrl('/images/generated/home-ecosystem/ecosystem-phone.webp')"
          alt="知宠 App 健康档案界面概念图"
          loading="lazy"
        >
        <span class="mobile-editorial__ai-note" data-ai-disclosure>AI 概念图，仅供参考</span>
      </div>
      <div class="mobile-editorial__download-copy">
        <span>知宠 App</span>
        <h2 id="mobile-download-title">把长期陪伴，<br >收进一处清晰入口</h2>
        <p>下载入口、适配平台与版本信息将在开放后通过下载页统一发布。</p>
        <BaseButton to="/download" size="lg">
          查看 App 下载页
          <template #iconRight>
            <BaseIcon name="arrow-right" aria-hidden="true" />
          </template>
        </BaseButton>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.mobile-editorial {
  width: min(100%, 760px);
  margin-inline: auto;
  overflow: hidden;
  color: var(--color-brand-900);
  background: var(--color-bg);
}

.mobile-editorial__opening {
  display: grid;
  gap: 18px;
  padding: 88px var(--page-gutter) 42px;
  border-top: 1px solid rgb(47 36 27 / 9%);
}

.mobile-editorial__kicker,
.mobile-editorial__chapter-heading > span,
.mobile-editorial__trust-kicker,
.mobile-editorial__download-copy > span,
.mobile-editorial__family-copy > span {
  color: var(--color-accent-700);
  font-size: 11px;
  font-weight: 850;
  text-transform: uppercase;
}

.mobile-editorial__opening h2,
.mobile-editorial__chapter-heading h2,
.mobile-editorial__family h2,
.mobile-editorial__trust h2,
.mobile-editorial__download h2 {
  color: inherit;
  font-size: 40px;
  line-height: 1.12;
  letter-spacing: 0;
}

.mobile-editorial__opening > p,
.mobile-editorial__download-copy > p {
  max-width: 42em;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.82;
}

.mobile-editorial__text-link,
.mobile-editorial__light-link {
  display: inline-flex;
  width: fit-content;
  min-height: 44px;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 850;
}

.mobile-editorial__text-link {
  color: var(--color-brand-900);
}

.mobile-editorial__text-link .base-icon,
.mobile-editorial__light-link .base-icon {
  font-size: 15px;
}

.mobile-editorial__opening-visual,
.mobile-editorial__chapter-visual,
.mobile-editorial__family,
.mobile-editorial__download-visual {
  position: relative;
  overflow: hidden;
  margin: 0;
}

.mobile-editorial__opening-visual {
  aspect-ratio: 4 / 3.4;
}

.mobile-editorial__opening-visual > img,
.mobile-editorial__chapter-visual > img,
.mobile-editorial__family > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-editorial__opening-visual > img {
  object-position: 60% center;
}

.mobile-editorial__visual-index {
  position: absolute;
  top: 18px;
  left: var(--page-gutter);
  color: rgb(20 63 50 / 72%);
  font-size: 11px;
  font-weight: 900;
}

.mobile-editorial__ai-note {
  position: absolute;
  right: 12px;
  bottom: 10px;
  z-index: 3;
  color: currentcolor;
  font-size: 8px;
  font-weight: 750;
  opacity: 0.66;
}

.mobile-editorial__opening-visual figcaption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  gap: 4px;
  padding: 52px var(--page-gutter) 28px;
  color: var(--color-brand-900);
  background: linear-gradient(
    180deg,
    transparent,
    rgb(255 253 248 / 86%) 44%,
    rgb(255 253 248 / 94%)
  );
}

.mobile-editorial__opening-visual figcaption strong {
  font-size: 17px;
}

.mobile-editorial__opening-visual figcaption span {
  max-width: 290px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.mobile-editorial__opening-visual .mobile-editorial__ai-note {
  top: 16px;
  right: 14px;
  bottom: auto;
}

.mobile-editorial__path {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 0;
  margin: 0 var(--page-gutter);
  border-block: 1px solid rgb(47 36 27 / 11%);
  list-style: none;
}

.mobile-editorial__path li {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 22px 10px 22px 0;
}

.mobile-editorial__path li + li {
  padding-left: 12px;
  border-left: 1px solid rgb(47 36 27 / 10%);
}

.mobile-editorial__path span {
  color: var(--color-accent-700);
  font-size: 10px;
  font-weight: 850;
}

.mobile-editorial__path strong {
  font-size: 12px;
  line-height: 1.3;
}

.mobile-editorial__chapter-heading {
  display: grid;
  gap: 14px;
  padding: 98px var(--page-gutter) 36px;
}

.mobile-editorial__chapters {
  display: grid;
  gap: 104px;
  padding-bottom: 104px;
}

.mobile-editorial__chapter {
  display: grid;
  gap: 24px;
}

.mobile-editorial__chapter-visual {
  display: block;
  aspect-ratio: 4 / 4.6;
  color: #fff;
}

.mobile-editorial__chapter--inset .mobile-editorial__chapter-visual {
  width: calc(100% - 42px);
  margin-left: 42px;
  aspect-ratio: 3 / 3.7;
}

.mobile-editorial__chapter--edge .mobile-editorial__chapter-visual {
  width: calc(100% - 24px);
  margin-right: 24px;
  aspect-ratio: 4 / 4.8;
}

.mobile-editorial__chapter-number {
  position: absolute;
  bottom: 20px;
  left: var(--page-gutter);
  z-index: 2;
  color: rgb(255 255 255 / 84%);
  font-family: var(--font-display);
  font-size: 72px;
  line-height: 0.8;
  text-shadow: 0 2px 24px rgb(0 0 0 / 24%);
}

.mobile-editorial__chapter-visual::after {
  position: absolute;
  inset: auto 0 0;
  height: 34%;
  background: linear-gradient(180deg, transparent, rgb(18 32 27 / 48%));
  content: '';
  pointer-events: none;
}

.mobile-editorial__chapter-copy {
  display: grid;
  gap: 14px;
  padding-inline: var(--page-gutter);
}

.mobile-editorial__chapter--inset .mobile-editorial__chapter-copy {
  padding-left: 60px;
}

.mobile-editorial__chapter-eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 8px;
  color: var(--color-accent-700);
  font-size: 11px;
  font-weight: 850;
}

.mobile-editorial__chapter-eyebrow .base-icon {
  font-size: 17px;
}

.mobile-editorial__chapter h3 {
  max-width: 11em;
  color: var(--color-brand-900);
  font-size: 34px;
  line-height: 1.18;
  letter-spacing: 0;
  white-space: pre-line;
}

.mobile-editorial__chapter-copy > p {
  max-width: 30em;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.78;
}

.mobile-editorial__family {
  min-height: 600px;
  color: #fff;
}

.mobile-editorial__family > img {
  position: absolute;
  inset: 0;
  object-position: 55% center;
}

.mobile-editorial__family-shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgb(18 32 27 / 10%) 28%, rgb(18 32 27 / 72%) 100%),
    linear-gradient(90deg, rgb(18 32 27 / 18%), transparent 74%);
}

.mobile-editorial__family-copy {
  position: absolute;
  right: var(--page-gutter);
  bottom: 52px;
  left: var(--page-gutter);
  z-index: 2;
  display: grid;
  gap: 16px;
}

.mobile-editorial__family-copy > span {
  color: rgb(255 233 200 / 88%);
}

.mobile-editorial__family h2 {
  color: #fff;
  font-size: 36px;
}

.mobile-editorial__light-link {
  color: #fff;
}

.mobile-editorial__family .mobile-editorial__ai-note {
  top: 18px;
  bottom: auto;
  color: #fff;
}

.mobile-editorial__trust {
  padding: 92px var(--page-gutter) 88px;
  color: #fff;
  background: var(--color-brand-900);
}

.mobile-editorial__trust-kicker {
  color: var(--color-accent-300);
}

.mobile-editorial__trust h2 {
  margin-top: 14px;
  color: #fff;
  font-size: 38px;
}

.mobile-editorial__trust-list {
  display: grid;
  margin-top: 50px;
}

.mobile-editorial__trust-list article {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 16px;
  padding-block: 22px;
  border-top: 1px solid rgb(255 255 255 / 18%);
}

.mobile-editorial__trust-list article:last-child {
  border-bottom: 1px solid rgb(255 255 255 / 18%);
}

.mobile-editorial__trust-list .base-icon {
  color: var(--color-accent-300);
  font-size: 27px;
}

.mobile-editorial__trust-list h3 {
  color: #fff;
  font-size: 17px;
}

.mobile-editorial__trust-list p {
  margin: 5px 0 0;
  color: rgb(255 255 255 / 70%);
  font-size: 13px;
  line-height: 1.65;
}

.mobile-editorial__trust > .mobile-editorial__light-link {
  margin-top: 28px;
}

.mobile-editorial__download {
  display: grid;
  gap: 34px;
  padding: 82px var(--page-gutter) 100px;
  background: var(--color-surface-soft);
}

.mobile-editorial__download-visual {
  height: 310px;
  margin-inline: calc(var(--page-gutter) * -1);
}

.mobile-editorial__download-visual img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.mobile-editorial__download-visual .mobile-editorial__ai-note {
  right: var(--page-gutter);
  color: var(--color-text-secondary);
}

.mobile-editorial__download-copy {
  display: grid;
  gap: 16px;
}

.mobile-editorial__download-copy :deep(.base-button) {
  width: 100%;
  margin-top: 8px;
}

@media (max-width: 360px) {
  .mobile-editorial__opening h2,
  .mobile-editorial__chapter-heading h2 {
    font-size: 35px;
  }

  .mobile-editorial__chapter h3 {
    font-size: 28px;
  }

  .mobile-editorial__trust h2,
  .mobile-editorial__download h2 {
    font-size: 33px;
  }

  .mobile-editorial__family h2 {
    font-size: 30px;
  }

  .mobile-editorial__chapter--inset .mobile-editorial__chapter-copy {
    padding-left: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-editorial__opening-visual > img,
  .mobile-editorial__chapter-visual > img,
  .mobile-editorial__family > img {
    transform: none;
  }
}
</style>

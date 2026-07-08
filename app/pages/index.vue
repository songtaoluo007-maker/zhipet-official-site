<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import HeroImmersiveStage from '~/components/home/HeroImmersiveStage.vue'
import { homeStoryStages } from '~/data/v2'
import type { IconName } from '~/types/ui'

const heroSlides = homeStoryStages.map((stage, index) => {
  const [, navLabel] = stage.eyebrow.split('/')

  return {
    stage,
    tag: index === 0 ? 'ZHIPET V2' : stage.eyebrow,
    navLabel: navLabel?.trim() ?? stage.eyebrow,
    title: index === 0 ? '更懂陪伴，\n更守护健康' : stage.title,
    description:
      index === 0
        ? '知宠智能项圈、App 与健康档案生态，科技守护每一次心跳，陪伴更长久。'
        : stage.description,
    primaryLabel: index === 1 ? '了解安全能力' : index === 2 ? '查看健康研究' : '了解产品',
    primaryTo: index === 1 ? '/products/smart-collar' : index === 2 ? '/research' : '/products',
  }
})

const firstHeroSlide = heroSlides[0]

if (!firstHeroSlide) {
  throw new Error('首页轮播至少需要一个叙事章节。')
}

const activeStoryIndex = ref(0)
const activeHeroSlide = computed(() => heroSlides[activeStoryIndex.value] ?? firstHeroSlide)
const heroAutoRotateDelay = 5000

interface EcosystemCard {
  id: string
  icon: IconName
  title: string
  description: string
  image: string
  alt: string
  href: string
}

interface TrustItem {
  id: string
  icon: IconName
  title: string
  lines: string[]
}

const ecosystemCards: EcosystemCard[] = [
  {
    id: 'safety',
    icon: 'shield-check',
    title: '安全边界',
    description: '设定活动范围与停留区域，异常离界即时提醒',
    image: '/images/generated/home-ecosystem/ecosystem-card-safety.png',
    alt: '金毛在户外活动场景中的安全边界卡片',
    href: '/products/smart-collar',
  },
  {
    id: 'health',
    icon: 'chart',
    title: '健康趋势',
    description: '长期数据趋势分析，发现潜在变化',
    image: '/images/generated/home-ecosystem/ecosystem-card-health.png',
    alt: '猫咪休息场景中的健康趋势卡片',
    href: '/research',
  },
  {
    id: 'collaboration',
    icon: 'users',
    title: '专业协同',
    description: '连接家庭、宠物医院与伙伴，协同守护更安心',
    image: '/images/generated/home-ecosystem/ecosystem-card-collab.png',
    alt: '宠物医生检查猫咪场景中的专业协同卡片',
    href: '/solutions',
  },
]
const trustItems: TrustItem[] = [
  {
    id: 'data',
    icon: 'shield-check',
    title: '数据安全',
    lines: ['多重加密与权限管理', '保护每一份敏感信息'],
  },
  {
    id: 'privacy',
    icon: 'lock',
    title: '隐私优先',
    lines: ['最小化数据采集', '用户自主掌控'],
  },
  {
    id: 'research',
    icon: 'check-circle',
    title: '科学循证',
    lines: ['联合研究与算法验证', '数据驱动不断进步'],
  },
  {
    id: 'service',
    icon: 'heart-pulse',
    title: '用心服务',
    lines: ['专业团队与持续支持', '陪伴每一个家庭'],
  },
]

let heroAutoRotateTimer: ReturnType<typeof window.setInterval> | undefined
let reducedMotionQuery: MediaQueryList | undefined


const clearHeroAutoRotate = () => {
  if (!heroAutoRotateTimer) {
    return
  }

  window.clearInterval(heroAutoRotateTimer)
  heroAutoRotateTimer = undefined
}

const canAutoRotateHero = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const startHeroAutoRotate = () => {
  clearHeroAutoRotate()

  if (!canAutoRotateHero() || heroSlides.length <= 1) {
    return
  }

  heroAutoRotateTimer = window.setInterval(() => {
    if (document.visibilityState !== 'visible') {
      return
    }

    activeStoryIndex.value = (activeStoryIndex.value + 1) % heroSlides.length
  }, heroAutoRotateDelay)
}

const formatHeroSlideNumber = (index: number) => String(index + 1).padStart(2, '0')

const setHeroSlide = (index: number) => {
  activeStoryIndex.value = index
  startHeroAutoRotate()
}

const stepHeroSlide = (step: number) => {
  activeStoryIndex.value = (activeStoryIndex.value + step + heroSlides.length) % heroSlides.length
  startHeroAutoRotate()
}
const handleReducedMotionChange = () => {
  startHeroAutoRotate()
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
  startHeroAutoRotate()
})

onBeforeUnmount(() => {
  clearHeroAutoRotate()
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
})

useSeoMeta({
  title: '知宠 ZHIPET | 更懂陪伴，更守护健康',
  description:
    '知宠 ZHIPET 以智能项圈、App 和健康档案生态，探索宠物安全防走失、健康趋势观察与 AI 状态解释。',
  ogTitle: '知宠 ZHIPET | 更懂陪伴，更守护健康',
  ogDescription: '知宠智能项圈 · App · 健康档案生态，让陪伴更有依据。',
  ogType: 'website',
})
</script>

<template>
  <div class="home-page">
    <section
      class="home-hero"
      aria-labelledby="home-title"
      aria-roledescription="carousel"
      :aria-label="`首页叙事轮播，当前第 ${activeStoryIndex + 1} 屏，共 ${heroSlides.length} 屏`"
    >
      <HeroImmersiveStage
        v-for="(slide, index) in heroSlides"
        :key="slide.stage.id"
        class="home-hero__stage"
        :class="{ 'is-active': activeStoryIndex === index }"
        :stage="slide.stage"
        :priority="index === 0"
        :aria-hidden="activeStoryIndex === index ? undefined : 'true'"
      />

      <BaseContainer class="home-hero__inner" width="wide">
        <div class="home-hero__copy">
          <Transition name="home-hero-copy" mode="out-in">
            <div
              :key="activeHeroSlide.stage.id"
              class="home-hero__copy-content"
              aria-live="polite"
            >
              <BaseTag tone="concept">{{ activeHeroSlide.tag }}</BaseTag>
              <h1 id="home-title">{{ activeHeroSlide.title }}</h1>
              <p class="home-hero__lead">{{ activeHeroSlide.description }}</p>
              <div class="home-hero__actions" aria-label="首页主要操作">
                <BaseButton :to="activeHeroSlide.primaryTo" size="lg">
                  {{ activeHeroSlide.primaryLabel }}
                  <template #iconRight>
                    <BaseIcon name="arrow-right" />
                  </template>
                </BaseButton>
                <BaseButton to="/demo" variant="secondary" size="lg">预约演示</BaseButton>
              </div>
            </div>
          </Transition>
        </div>
      </BaseContainer>

      <nav class="home-hero__controls" aria-label="首页轮播手动选择">
        <div class="home-hero__selectors" aria-label="首页轮播章节">
          <button
            v-for="(slide, index) in heroSlides"
            :key="slide.stage.id"
            type="button"
            class="home-hero__selector"
            :class="{ 'is-active': activeStoryIndex === index }"
            :aria-current="activeStoryIndex === index ? 'true' : undefined"
            @click="setHeroSlide(index)"
          >
            <span>{{ formatHeroSlideNumber(index) }}</span>
            <strong>{{ slide.navLabel }}</strong>
          </button>
        </div>
        <div class="home-hero__arrows" aria-label="轮播切换">
          <button type="button" class="home-hero__arrow home-hero__arrow--prev" aria-label="上一屏" @click="stepHeroSlide(-1)">
            <BaseIcon name="arrow-right" aria-hidden="true" />
          </button>
          <button type="button" class="home-hero__arrow" aria-label="下一屏" @click="stepHeroSlide(1)">
            <BaseIcon name="arrow-right" aria-hidden="true" />
          </button>
        </div>
      </nav>

    </section>

    <section class="ecosystem-replica" aria-labelledby="ecosystem-replica-title">
      <BaseContainer class="ecosystem-replica__container" width="wide">
        <div class="ecosystem-replica__system">
          <div class="ecosystem-replica__intro">
            <h2 id="ecosystem-replica-title">知宠智能生态系统</h2>
            <p>设备 × App × 健康档案</p>
            <p>三位一体，构建可理解的健康陪伴</p>
            <NuxtLink to="/products" class="ecosystem-replica__text-link">
              了解知宠生态
              <BaseIcon name="arrow-right" aria-hidden="true" />
            </NuxtLink>
          </div>

          <NuxtLink
            to="/products/smart-collar"
            class="ecosystem-replica__visual ecosystem-replica__product"
            aria-label="查看知宠智能项圈"
          >
            <img
              src="/images/generated/home-ecosystem/ecosystem-collar.png"
              alt="知宠智能项圈产品近景"
              loading="lazy"
            >
          </NuxtLink>

          <div class="ecosystem-replica__bridge ecosystem-replica__bridge--connect" aria-hidden="true">
            <span><BaseIcon name="phone" /></span>
            <strong>稳定连接</strong>
            <em>全天候健康监测</em>
          </div>

          <NuxtLink
            to="/products/app"
            class="ecosystem-replica__visual ecosystem-replica__phone"
            aria-label="查看知宠 App"
          >
            <img
              src="/images/generated/home-ecosystem/ecosystem-phone.png"
              alt="知宠 App 健康评分界面"
              loading="lazy"
            >
          </NuxtLink>

          <div class="ecosystem-replica__bridge ecosystem-replica__bridge--sync" aria-hidden="true">
            <span><BaseIcon name="phone" /></span>
            <strong>数据同步</strong>
            <em>查看趋势与提醒</em>
          </div>

          <NuxtLink
            to="/products/health-platform"
            class="ecosystem-replica__visual ecosystem-replica__desktop"
            aria-label="查看健康管理平台"
          >
            <img
              src="/images/generated/home-ecosystem/ecosystem-desktop.png"
              alt="健康档案面板示意"
              loading="lazy"
            >
          </NuxtLink>
        </div>

        <div class="ecosystem-replica__cards" aria-label="知宠核心场景">
          <NuxtLink
            v-for="card in ecosystemCards"
            :key="card.id"
            class="ecosystem-card"
            :to="card.href"
            :aria-label="`${card.title}：${card.description}`"
          >
            <img :src="card.image" :alt="card.alt" loading="lazy">
            <span class="ecosystem-card__shade" aria-hidden="true" />
            <span class="ecosystem-card__icon" aria-hidden="true">
              <BaseIcon :name="card.icon" />
            </span>
            <span class="ecosystem-card__content">
              <strong>{{ card.title }}</strong>
              <em>{{ card.description }}</em>
              <span>了解更多 <BaseIcon name="arrow-right" aria-hidden="true" /></span>
            </span>
          </NuxtLink>
        </div>

        <div class="ecosystem-replica__trust" aria-labelledby="ecosystem-trust-title">
          <h2 id="ecosystem-trust-title">因信任而设计，为陪伴而守护</h2>
          <div class="ecosystem-replica__trust-grid">
            <article v-for="item in trustItems" :key="item.id" class="ecosystem-trust-item">
              <BaseIcon :name="item.icon" aria-hidden="true" />
              <div>
                <h3>{{ item.title }}</h3>
                <p v-for="line in item.lines" :key="line">{{ line }}</p>
              </div>
            </article>
          </div>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.home-page {
  overflow: hidden;
  background: var(--color-bg);
}

.home-hero {
  position: relative;
  overflow: hidden;
  min-height: calc(100svh - 76px);
  background: var(--color-surface-soft);
  isolation: isolate;
}

.home-hero::after {
  position: absolute;
  inset: auto 0 0;
  z-index: 2;
  height: 34%;
  background: linear-gradient(180deg, rgb(251 248 242 / 0%), rgb(251 248 242 / 30%) 58%, rgb(251 248 242 / 62%));
  content: '';
  pointer-events: none;
}

.home-hero__inner {
  position: relative;
  z-index: 3;
  display: flex;
  min-height: calc(100svh - 76px);
  align-items: center;
  padding-block: clamp(86px, 12vh, 132px) clamp(90px, 12vh, 130px);
  pointer-events: none;
}

.home-hero__copy {
  display: grid;
  width: min(590px, 46vw);
  gap: var(--space-5);
  pointer-events: auto;
  transform: translateX(clamp(-152px, -7vw, -72px));
}

.home-hero__copy-content {
  display: grid;
  gap: var(--space-5);
}

.home-hero h1 {
  max-width: 680px;
  color: var(--color-brand-900);
  font-size: clamp(56px, 5.8vw, 92px);
  line-height: 1.05;
  letter-spacing: 0;
  text-wrap: balance;
  white-space: pre-line;
}

.home-hero__lead {
  max-width: 560px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.82;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.home-hero__stage {
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 560ms var(--motion-ease-out);
}

.home-hero__stage.is-active {
  opacity: 1;
}
.home-hero__controls {
  position: absolute;
  right: max(var(--page-gutter), calc((100vw - 1580px) / 2));
  bottom: clamp(28px, 5vh, 54px);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}

.home-hero__selectors,
.home-hero__arrows {
  display: flex;
  align-items: center;
  border: 1px solid rgb(47 36 27 / 13%);
  border-radius: var(--radius-pill);
  background: rgb(255 253 248 / 66%);
  box-shadow: 0 14px 36px rgb(47 36 27 / 10%);
  backdrop-filter: blur(16px);
}

.home-hero__selectors {
  gap: 2px;
  padding: 5px;
}

.home-hero__selector,
.home-hero__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: var(--color-brand-900);
  background: transparent;
  cursor: pointer;
  font: inherit;
}

.home-hero__selector {
  gap: 8px;
  min-height: 38px;
  padding: 8px 13px;
  border-radius: var(--radius-pill);
  color: rgb(20 63 50 / 82%);
  transition:
    color var(--motion-duration-base) var(--motion-ease-out),
    background var(--motion-duration-base) var(--motion-ease-out);
}

.home-hero__selector span {
  font-size: 12px;
  font-weight: 850;
  line-height: 1;
}

.home-hero__selector strong {
  font-size: 13px;
  font-weight: 850;
  line-height: 1;
  white-space: nowrap;
}

.home-hero__selector.is-active {
  color: var(--color-surface);
  background: rgb(20 63 50 / 92%);
}

.home-hero__selector:not(.is-active):hover,
.home-hero__selector:not(.is-active):focus-visible {
  background: rgb(255 255 255 / 54%);
}

.home-hero__arrows {
  gap: 3px;
  padding: 5px;
}

.home-hero__arrow {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-pill);
  font-size: 18px;
  transition:
    color var(--motion-duration-base) var(--motion-ease-out),
    background var(--motion-duration-base) var(--motion-ease-out);
}

.home-hero__arrow--prev .base-icon {
  transform: rotate(180deg);
}

.home-hero__arrow:hover,
.home-hero__arrow:focus-visible {
  color: var(--color-surface);
  background: rgb(20 63 50 / 88%);
}

.home-hero__selector:focus-visible,
.home-hero__arrow:focus-visible {
  outline: 2px solid transparent;
  box-shadow: var(--focus-ring);
}

.ecosystem-replica {
  padding-block: 0 clamp(42px, 4vw, 58px);
  background:
    linear-gradient(180deg, rgb(255 253 248 / 98%), rgb(251 248 242 / 94%)),
    radial-gradient(circle at 86% 8%, rgb(230 207 173 / 16%), transparent 30%);
}

.ecosystem-replica__container {
  width: min(100% - (var(--page-gutter) * 2), 1580px);
}

.ecosystem-replica__system {
  position: relative;
  display: grid;
  min-height: 260px;
  grid-template-columns: 240px minmax(360px, 430px) 82px 230px 82px minmax(340px, 420px);
  gap: clamp(10px, 1vw, 18px);
  align-items: center;
  padding-block: 0 18px;
  overflow: hidden;
  border-bottom: 1px solid rgb(47 36 27 / 8%);
  background:
    linear-gradient(90deg, rgb(255 253 248 / 0%) 0%, rgb(255 253 248 / 72%) 18%, rgb(255 253 248 / 78%) 82%, rgb(255 253 248 / 0%) 100%),
    radial-gradient(ellipse at 46% 42%, rgb(230 207 173 / 18%), transparent 58%);
  isolation: isolate;
}

.ecosystem-replica__intro {
  display: grid;
  gap: 6px;
  align-content: center;
  min-width: 0;
  padding-left: 4px;
}

.ecosystem-replica__intro h2 {
  color: var(--color-brand-900);
  font-size: clamp(22px, 1.7vw, 30px);
  line-height: 1.12;
}

.ecosystem-replica__intro p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 15px;
  font-weight: 760;
  line-height: 1.58;
}

.ecosystem-replica__text-link {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 8px;
  margin-top: clamp(28px, 3.4vw, 50px);
  color: var(--color-brand-900);
  font-size: 15px;
  font-weight: 850;
}

.ecosystem-replica__product,
.ecosystem-replica__phone,
.ecosystem-replica__desktop {
  display: grid;
  min-width: 0;
  margin: 0;
  position: relative;
  z-index: 1;
  place-items: center;
}
.ecosystem-replica__visual {
  border-radius: 10px;
  outline: 2px solid transparent;
  outline-offset: 6px;
  transition:
    transform var(--motion-duration-base) var(--motion-ease-out),
    filter var(--motion-duration-base) var(--motion-ease-out);
}

.ecosystem-replica__visual:hover,
.ecosystem-replica__visual:focus-visible {
  transform: translateY(-2px);
  filter: brightness(1.02);
}

.ecosystem-replica__visual:focus-visible {
  box-shadow: var(--focus-ring);
}

.ecosystem-replica__product img {
  width: min(100%, 430px);
  height: 236px;
  object-fit: contain;
  object-position: center;
  mix-blend-mode: multiply;
  filter: saturate(1.02) contrast(1.02);
}

.ecosystem-replica__bridge {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 7px;
  color: var(--color-text-secondary);
  text-align: center;
}

.ecosystem-replica__bridge::before,
.ecosystem-replica__bridge::after {
  position: absolute;
  top: 38px;
  width: clamp(34px, 2.8vw, 60px);
  height: 1px;
  border-top: 1px dashed rgb(86 130 103 / 35%);
  content: '';
}

.ecosystem-replica__bridge::before {
  right: calc(50% + 30px);
}

.ecosystem-replica__bridge::after {
  left: calc(50% + 30px);
}

.ecosystem-replica__bridge span {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid rgb(47 36 27 / 10%);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: rgb(255 253 248 / 84%);
  font-size: 22px;
}

.ecosystem-replica__bridge strong {
  color: var(--color-brand-900);
  font-size: 14px;
  line-height: 1.2;
}

.ecosystem-replica__bridge em {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-style: normal;
  line-height: 1.35;
}

.ecosystem-replica__phone img {
  width: 226px;
  height: 252px;
  object-fit: contain;
  object-position: center bottom;
  mix-blend-mode: multiply;
  filter: saturate(1.02) contrast(1.02);
}

.ecosystem-replica__desktop img {
  width: min(100%, 412px);
  height: 234px;
  object-fit: contain;
  object-position: center;
  mix-blend-mode: multiply;
  filter: saturate(1.02) contrast(1.02);
}

.ecosystem-replica__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.ecosystem-card {
  position: relative;
  display: block;
  overflow: hidden;
  min-height: 244px;
  border-radius: 8px;
  background: rgb(20 63 50 / 8%);
  transition:
    transform var(--motion-duration-base) var(--motion-ease-out),
    box-shadow var(--motion-duration-base) var(--motion-ease-out);
}

.ecosystem-card img {
  display: block;
  width: 100%;
  height: 244px;
  object-fit: cover;
  object-position: center;
  filter: saturate(1.04) contrast(1.03);
  transition: transform var(--motion-duration-slow) var(--motion-ease-out);
}

.ecosystem-card__shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(90deg, rgb(20 63 50 / 78%) 0%, rgb(20 63 50 / 48%) 42%, rgb(20 63 50 / 10%) 100%),
    linear-gradient(180deg, rgb(20 63 50 / 8%), rgb(20 63 50 / 18%));
}

.ecosystem-card__icon {
  position: absolute;
  top: 30px;
  left: 28px;
  z-index: 2;
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: var(--radius-pill);
  color: rgb(255 253 248 / 94%);
  background: rgb(255 255 255 / 13%);
  backdrop-filter: blur(14px);
  font-size: 25px;
}

.ecosystem-card__content {
  position: absolute;
  inset: 104px 28px 24px;
  z-index: 2;
  display: grid;
  align-content: start;
  gap: 11px;
  max-width: 330px;
  color: var(--color-surface);
}

.ecosystem-card__content strong {
  font-size: clamp(28px, 2.35vw, 36px);
  line-height: 1.14;
  letter-spacing: 0;
}

.ecosystem-card__content em {
  color: rgb(255 253 248 / 84%);
  font-size: 15px;
  font-style: normal;
  font-weight: 650;
  line-height: 1.55;
}

.ecosystem-card__content span {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: rgb(255 253 248 / 88%);
  font-size: 14px;
  font-weight: 850;
}

.ecosystem-card:hover,
.ecosystem-card:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 18px 42px rgb(47 36 27 / 12%);
}

.ecosystem-card:hover img,
.ecosystem-card:focus-visible img {
  transform: scale(1.025);
}

.ecosystem-card:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 5px;
  box-shadow: var(--focus-ring), 0 18px 42px rgb(47 36 27 / 12%);
}

.ecosystem-replica__trust {
  padding-top: clamp(28px, 3.3vw, 42px);
  text-align: center;
}

.ecosystem-replica__trust h2 {
  color: var(--color-brand-900);
  font-size: clamp(28px, 2.6vw, 38px);
  line-height: 1.2;
  letter-spacing: 0;
}

.ecosystem-replica__trust-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  margin-top: clamp(22px, 3vw, 36px);
}

.ecosystem-trust-item {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding-inline: clamp(18px, 2.2vw, 34px);
  border-right: 1px solid rgb(47 36 27 / 14%);
  color: var(--color-text-secondary);
  text-align: left;
}

.ecosystem-trust-item:last-child {
  border-right: 0;
}

.ecosystem-trust-item .base-icon {
  color: var(--color-brand-900);
  font-size: 46px;
  stroke-width: 1.45;
}

.ecosystem-trust-item h3 {
  color: var(--color-brand-900);
  font-size: 18px;
  line-height: 1.3;
}

.ecosystem-trust-item p {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.45;
}

@media (max-width: 1380px) {
  .ecosystem-replica__system {
    grid-template-columns: 220px minmax(300px, 1fr) 74px 196px 74px minmax(280px, 0.9fr);
  }

  .ecosystem-replica__product img {
    height: 220px;
  }

  .ecosystem-replica__phone img {
    width: 198px;
    height: 236px;
  }
}

@media (max-width: 1180px) {
  .ecosystem-replica__container {
    width: min(100% - (var(--page-gutter) * 2), var(--container-wide));
  }

  .ecosystem-replica__system {
    grid-template-columns: minmax(0, 1fr) minmax(220px, 0.72fr);
    gap: var(--space-4);
    padding-block: var(--space-4);
  }

  .ecosystem-replica__intro {
    grid-column: 1 / -1;
  }

  .ecosystem-replica__bridge {
    display: none;
  }

  .ecosystem-replica__desktop {
    display: none;
  }

  .ecosystem-replica__phone img {
    width: min(230px, 100%);
  }

  .ecosystem-replica__cards {
    grid-template-columns: 1fr;
  }

  .ecosystem-card,
  .ecosystem-card img {
    min-height: 250px;
    height: 250px;
  }

  .ecosystem-replica__trust-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 22px;
  }

  .ecosystem-trust-item:nth-child(2) {
    border-right: 0;
  }
}

@media (max-width: 760px) {
  .ecosystem-replica__container {
    width: min(100% - (var(--page-gutter) * 2), var(--container-wide));
  }

  .ecosystem-replica__system {
    grid-template-columns: 1fr;
    padding-block: var(--space-5) var(--space-4);
  }

  .ecosystem-replica__text-link {
    margin-top: 20px;
  }

  .ecosystem-replica__product img,
  .ecosystem-replica__phone img {
    width: 100%;
    height: auto;
    max-height: 260px;
    object-fit: contain;
  }

  .ecosystem-card,
  .ecosystem-card img {
    min-height: 210px;
    height: 210px;
  }

  .ecosystem-replica__trust-grid {
    grid-template-columns: 1fr;
  }

  .ecosystem-trust-item,
  .ecosystem-trust-item:nth-child(2) {
    border-right: 0;
  }
}

@media (max-width: 1180px) {
  .home-hero__inner {
    align-items: start;
    padding-block: var(--space-8) var(--space-10);
  }

  .home-hero__copy {
    width: min(580px, 100%);
    transform: none;
  }

  .home-hero h1 {
    font-size: 52px;
  }

  .home-hero__controls {
    right: var(--page-gutter);
  }
}

@media (max-width: 760px) {
  .home-hero,
  .home-hero__inner {
    min-height: 1040px;
  }

  .home-hero__inner {
    padding-block: var(--space-6) var(--space-9);
  }

  .home-hero h1 {
    font-size: 40px;
  }

  .home-hero__lead {
    font-size: 15px;
  }

  .home-hero__controls {
    right: var(--page-gutter);
    bottom: var(--space-5);
    left: var(--page-gutter);
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .home-hero__selectors {
    max-width: 100%;
    overflow-x: auto;
  }

  .home-hero__selector {
    padding-inline: 10px;
  }

  .home-hero__actions :deep(.base-button) {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .home-hero,
  .home-hero__inner {
    min-height: 1120px;
  }

  .home-hero__selector strong {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero__stage,
  .home-hero-copy-enter-active,
  .home-hero-copy-leave-active,
  .ecosystem-card img {
    animation: none;
    transition-duration: 0.01ms;
  }

  .home-hero-copy-enter-from,
  .home-hero-copy-leave-to,
  .ecosystem-card:hover img,
  .ecosystem-card:focus-visible img,
  .ecosystem-replica__visual:hover,
  .ecosystem-replica__visual:focus-visible {
    transform: none;
  }
}
</style>








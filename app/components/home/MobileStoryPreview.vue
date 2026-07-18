<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import HeroAppPanel from '~/components/home/HeroAppPanel.vue'
import { homeStoryStages } from '~/data/v2'
import type { HomeStoryStage } from '~/data/v2'
import type { IconName } from '~/types/ui'

interface PreviewHighlight {
  id: string
  icon: IconName
  label: string
  value: string
}

interface PreviewStory {
  id: string
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  objectPosition: string
  tone: 'light' | 'warm' | 'deep'
  primaryLabel: string
  primaryTo: string
  secondaryLabel: string
  secondaryTo: string
  showAppPanel: boolean
  stage: HomeStoryStage
  highlights: PreviewHighlight[]
}

const requireStage = (id: string) => {
  const stage = homeStoryStages.find((item) => item.id === id)

  if (!stage) {
    throw new Error(`Missing home story stage: ${id}`)
  }

  return stage
}

const companionshipStage = requireStage('companionship')
const healthStage = requireStage('health')
const safetyStage = requireStage('safety')

const stories: PreviewStory[] = [
  {
    id: 'companionship',
    eyebrow: '01 / 陪伴守护',
    title: '更懂陪伴，\n更守护健康',
    description: '让智能项圈、App 与健康档案形成一段看得见的陪伴故事。',
    image: companionshipStage.asset,
    imageAlt: companionshipStage.assetAlt,
    objectPosition: '64% center',
    tone: 'light',
    primaryLabel: '了解产品',
    primaryTo: '/products',
    secondaryLabel: 'App 下载',
    secondaryTo: '/download',
    showAppPanel: false,
    stage: companionshipStage,
    highlights: [
      { id: 'health', icon: 'heart-pulse', label: '健康趋势', value: '持续观察' },
      { id: 'care', icon: 'shield-check', label: '照护记录', value: '同步整理' },
    ],
  },
  {
    id: 'health',
    eyebrow: '02 / 健康洞察',
    title: '看见日常变化，\n读懂长期趋势',
    description: '围绕活动、休息和照护记录形成趋势提示，并明确依据与不确定性。',
    image: healthStage.asset,
    imageAlt: healthStage.assetAlt,
    objectPosition: '58% center',
    tone: 'warm',
    primaryLabel: '查看健康研究',
    primaryTo: '/research',
    secondaryLabel: '了解产品',
    secondaryTo: '/products',
    showAppPanel: true,
    stage: healthStage,
    highlights: [],
  },
  {
    id: 'collaboration',
    eyebrow: '03 / 长期协同',
    title: '连接家庭，\n协同长期照护',
    description: '在用户授权前提下，整理可沟通的健康线索，连接家庭照护与专业服务。',
    image: '/images/generated/home-ecosystem/ecosystem-card-collab.webp',
    imageAlt: '宠物医生与宠物家庭协同照护场景',
    objectPosition: '66% center',
    tone: 'deep',
    primaryLabel: '了解解决方案',
    primaryTo: '/solutions',
    secondaryLabel: '联系知宠团队',
    secondaryTo: '/contact',
    showAppPanel: false,
    stage: safetyStage,
    highlights: [
      { id: 'family', icon: 'home', label: '家庭照护', value: '日常记录' },
      { id: 'team', icon: 'users', label: '专业协同', value: '授权后连接' },
    ],
  },
]

const activeIndex = ref(0)
const interactionPaused = ref(false)
const pointerStartX = ref<number | null>(null)
const activeStory = computed(() => stories[activeIndex.value] ?? stories[0]!)
const activeStoryNumber = computed(() => String(activeIndex.value + 1).padStart(2, '0'))

const autoRotateDelay = 5000
let autoRotateTimer: number | undefined
let reducedMotionQuery: MediaQueryList | undefined

const clearAutoRotate = () => {
  if (autoRotateTimer === undefined) {
    return
  }

  window.clearInterval(autoRotateTimer)
  autoRotateTimer = undefined
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const startAutoRotate = () => {
  clearAutoRotate()

  if (interactionPaused.value || prefersReducedMotion()) {
    return
  }

  autoRotateTimer = window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      activeIndex.value = (activeIndex.value + 1) % stories.length
    }
  }, autoRotateDelay)
}

const selectStory = (index: number) => {
  activeIndex.value = index
  startAutoRotate()
}

const stepStory = (step: number) => {
  activeIndex.value = (activeIndex.value + step + stories.length) % stories.length
  startAutoRotate()
}

const pauseAutoRotate = () => {
  interactionPaused.value = true
  clearAutoRotate()
}

const resumeAutoRotate = () => {
  interactionPaused.value = false
  startAutoRotate()
}

const handlePointerDown = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return
  }

  pointerStartX.value = event.clientX
  pauseAutoRotate()
}

const handlePointerUp = (event: PointerEvent) => {
  if (pointerStartX.value === null) {
    return
  }

  const delta = event.clientX - pointerStartX.value
  pointerStartX.value = null
  interactionPaused.value = false

  if (Math.abs(delta) >= 48) {
    stepStory(delta > 0 ? -1 : 1)
    return
  }

  startAutoRotate()
}

const handlePointerCancel = () => {
  pointerStartX.value = null
  resumeAutoRotate()
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    startAutoRotate()
    return
  }

  clearAutoRotate()
}

const handleReducedMotionChange = () => {
  startAutoRotate()
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  startAutoRotate()
})

onBeforeUnmount(() => {
  clearAutoRotate()
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <section
    class="mobile-story-preview"
    :class="`mobile-story-preview--${activeStory.tone}`"
    aria-roledescription="carousel"
    :aria-label="`知宠移动端故事，当前第 ${activeIndex + 1} 屏，共 ${stories.length} 屏`"
    data-testid="mobile-story-viewport"
    @mouseenter="pauseAutoRotate"
    @mouseleave="resumeAutoRotate"
    @focusin="pauseAutoRotate"
    @focusout="resumeAutoRotate"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerCancel"
  >
    <Transition name="mobile-story" mode="out-in">
      <article
        :key="activeStory.id"
        class="mobile-story-preview__story"
        :class="{ 'mobile-story-preview__story--with-panel': activeStory.showAppPanel }"
      >
        <img
          class="mobile-story-preview__image"
          :src="activeStory.image"
          :alt="activeStory.imageAlt"
          :style="{ objectPosition: activeStory.objectPosition }"
          loading="eager"
          fetchpriority="high"
        >
        <div class="mobile-story-preview__veil" aria-hidden="true" />

        <div class="mobile-story-preview__content">
          <div
            class="mobile-story-preview__copy"
            :class="{ 'mobile-story-preview__copy--with-panel': activeStory.showAppPanel }"
            aria-live="polite"
          >
            <span class="mobile-story-preview__eyebrow">{{ activeStory.eyebrow }}</span>
            <h1>{{ activeStory.title }}</h1>
            <p>{{ activeStory.description }}</p>
            <div class="mobile-story-preview__actions">
              <BaseButton :to="activeStory.primaryTo" size="lg">
                {{ activeStory.primaryLabel }}
                <template #iconRight>
                  <BaseIcon name="arrow-right" aria-hidden="true" />
                </template>
              </BaseButton>
              <NuxtLink class="mobile-story-preview__text-link" :to="activeStory.secondaryTo">
                {{ activeStory.secondaryLabel }}
                <BaseIcon name="arrow-right" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>

          <ul v-if="activeStory.highlights.length" class="mobile-story-preview__highlights">
            <li v-for="item in activeStory.highlights" :key="item.id">
              <BaseIcon :name="item.icon" aria-hidden="true" />
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </li>
          </ul>

          <div v-if="activeStory.showAppPanel" class="mobile-story-preview__app-shell">
            <HeroAppPanel :stage="activeStory.stage" />
          </div>
        </div>
      </article>
    </Transition>

    <p class="mobile-story-preview__disclosure">AI 概念图，仅供参考</p>

    <nav class="mobile-story-preview__controls" aria-label="切换首页故事">
      <span class="mobile-story-preview__count">{{ activeStoryNumber }} / 03</span>
      <div class="mobile-story-preview__selectors">
        <button
          v-for="(story, index) in stories"
          :key="story.id"
          type="button"
          :data-story-selector="index"
          :aria-label="`切换到${story.eyebrow}`"
          :aria-current="activeIndex === index ? 'true' : undefined"
          @click="selectStory(index)"
        >
          <span />
        </button>
      </div>
      <button
        type="button"
        class="mobile-story-preview__arrow mobile-story-preview__arrow--previous"
        aria-label="上一屏"
        @click="stepStory(-1)"
      >
        <BaseIcon name="arrow-right" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="mobile-story-preview__arrow"
        aria-label="下一屏"
        @click="stepStory(1)"
      >
        <BaseIcon name="arrow-right" aria-hidden="true" />
      </button>
    </nav>
  </section>
</template>

<style scoped lang="scss">
.mobile-story-preview {
  position: relative;
  width: 100%;
  height: calc(100svh - 76px);
  min-height: 0;
  overflow: hidden;
  color: var(--color-brand-900);
  background: var(--color-surface-soft);
  isolation: isolate;
  touch-action: pan-y;
  user-select: none;
}

.mobile-story-preview__story,
.mobile-story-preview__image,
.mobile-story-preview__veil {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.mobile-story-preview__story {
  overflow: hidden;
}

.mobile-story-preview__story--with-panel {
  background: transparent;
}

.mobile-story-preview__image {
  z-index: -2;
  object-fit: cover;
}

.mobile-story-preview__veil {
  z-index: -1;
  background:
    linear-gradient(
      180deg,
      rgb(255 253 248 / 94%) 0%,
      rgb(255 253 248 / 70%) 34%,
      rgb(255 253 248 / 8%) 68%
    ),
    linear-gradient(90deg, rgb(255 253 248 / 52%), transparent 74%);
}

.mobile-story-preview--warm .mobile-story-preview__veil {
  background:
    linear-gradient(
      180deg,
      rgb(255 253 248 / 94%) 0%,
      rgb(255 253 248 / 72%) 32%,
      rgb(255 253 248 / 10%) 64%
    ),
    linear-gradient(0deg, rgb(44 35 28 / 22%), transparent 48%);
}

.mobile-story-preview__story--with-panel .mobile-story-preview__image {
  inset: 0 0 auto;
  height: clamp(190px, 39%, 300px);
  object-position: 30% center !important;
}

.mobile-story-preview__story--with-panel .mobile-story-preview__veil {
  background:
    linear-gradient(
      180deg,
      rgb(255 253 248 / 78%) 0%,
      rgb(255 253 248 / 15%) 30%,
      rgb(244 236 225 / 28%) 40%,
      #f4ece1 48%,
      #f4ece1 100%
    ),
    linear-gradient(90deg, rgb(255 253 248 / 88%) 0%, rgb(255 253 248 / 36%) 48%, transparent 76%);
}

.mobile-story-preview--deep {
  color: #fff;
}

.mobile-story-preview--deep .mobile-story-preview__veil {
  background:
    linear-gradient(
      180deg,
      rgb(18 32 27 / 76%) 0%,
      rgb(18 32 27 / 40%) 46%,
      rgb(18 32 27 / 16%) 70%
    ),
    linear-gradient(0deg, rgb(18 32 27 / 62%) 0%, transparent 54%);
}

.mobile-story-preview__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 28px var(--page-gutter) 76px;
}

.mobile-story-preview__copy {
  display: grid;
  max-width: 350px;
  gap: 10px;
}

.mobile-story-preview__story--with-panel .mobile-story-preview__copy {
  max-width: 226px;
}

.mobile-story-preview .mobile-story-preview__story--with-panel h1 {
  max-width: 226px;
  font-size: 30px;
}

.mobile-story-preview__story--with-panel .mobile-story-preview__copy > p {
  max-width: 246px;
}

.mobile-story-preview__eyebrow {
  width: fit-content;
  padding-bottom: 5px;
  border-bottom: 2px solid var(--color-accent-600);
  color: var(--color-accent-700);
  font-size: 11px;
  font-weight: 850;
}

.mobile-story-preview--deep .mobile-story-preview__eyebrow {
  color: var(--color-accent-300);
  border-color: var(--color-accent-300);
}

.mobile-story-preview h1 {
  max-width: 340px;
  color: inherit;
  font-size: 42px;
  line-height: 1.08;
  letter-spacing: 0;
  white-space: pre-line;
}

.mobile-story-preview__copy > p {
  max-width: 330px;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.65;
}

.mobile-story-preview--deep .mobile-story-preview__copy > p {
  color: rgb(255 255 255 / 80%);
}

.mobile-story-preview__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-items: center;
  margin-top: 4px;
}

.mobile-story-preview__text-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 6px;
  color: var(--color-brand-900);
  font-size: 13px;
  font-weight: 800;
}

.mobile-story-preview--deep .mobile-story-preview__text-link {
  color: #fff;
}

.mobile-story-preview__text-link .base-icon {
  font-size: 15px;
}

.mobile-story-preview--deep :deep(.base-button--primary) {
  color: var(--color-brand-900);
  border-color: #fff;
  background: #fff;
}

.mobile-story-preview__highlights {
  position: absolute;
  right: var(--page-gutter);
  bottom: 88px;
  left: var(--page-gutter);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.mobile-story-preview__highlights li {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  min-height: 58px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid rgb(255 255 255 / 56%);
  border-radius: 8px;
  color: var(--color-brand-900);
  background: rgb(255 253 248 / 68%);
  backdrop-filter: blur(16px) saturate(1.05);
}

.mobile-story-preview--deep .mobile-story-preview__highlights li {
  color: #fff;
  border-color: rgb(255 255 255 / 28%);
  background: rgb(18 32 27 / 54%);
}

.mobile-story-preview__highlights .base-icon {
  grid-row: 1 / 3;
  font-size: 22px;
}

.mobile-story-preview__highlights span,
.mobile-story-preview__highlights strong {
  min-width: 0;
  line-height: 1.25;
}

.mobile-story-preview__highlights span {
  font-size: 10px;
  opacity: 0.72;
}

.mobile-story-preview__highlights strong {
  font-size: 12px;
}

.mobile-story-preview__app-shell {
  position: absolute;
  right: 14px;
  bottom: 68px;
  width: min(276px, calc(100% - 28px));
  height: min(430px, calc(100% - 270px));
  min-height: 326px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 58%);
  border-radius: 30px;
  background: rgb(246 239 228 / 34%);
  backdrop-filter: blur(18px) saturate(1.08);
}

.mobile-story-preview__story--with-panel .mobile-story-preview__app-shell {
  right: auto;
  left: 50%;
  width: min(300px, calc(100% - 32px));
  height: min(422px, calc(100% - 286px));
  min-height: 326px;
  transform: translateX(-50%);
}

.mobile-story-preview__story--with-panel .mobile-story-preview__app-shell :deep(.hero-app-panel) {
  width: 126.582%;
  min-height: 126.582%;
  transform: scale(0.79);
  transform-origin: top left;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel) {
  gap: 7px;
  padding: 12px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__status) {
  font-size: 10px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__avatar) {
  width: 34px;
  height: 34px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__pet strong) {
  font-size: 16px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__pet p),
.mobile-story-preview__app-shell :deep(.hero-app-panel__pet em) {
  font-size: 9px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__score) {
  grid-template-columns: minmax(0, 1fr) 62px;
  gap: 8px;
  padding: 10px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__score strong) {
  font-size: 30px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__gauge) {
  width: 58px;
  height: 58px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__metrics) {
  gap: 6px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__metrics div) {
  gap: 3px;
  padding: 7px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__metrics dt),
.mobile-story-preview__app-shell :deep(.hero-app-panel__metrics dd) {
  font-size: 9px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__nav span) {
  font-size: 8px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__nav .base-icon) {
  font-size: 15px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__trend) {
  display: grid;
  padding: 7px 8px 6px;
}

.mobile-story-preview__app-shell :deep(.hero-app-panel__trend svg) {
  height: 58px;
  min-height: 58px;
}

.mobile-story-preview__controls {
  position: absolute;
  z-index: 4;
  right: 12px;
  bottom: 12px;
  display: flex;
  min-height: 44px;
  align-items: center;
  padding-inline: 3px;
  border: 1px solid rgb(255 255 255 / 50%);
  border-radius: var(--radius-pill);
  background: rgb(255 253 248 / 74%);
  backdrop-filter: blur(16px) saturate(1.08);
}

.mobile-story-preview--deep .mobile-story-preview__controls {
  border-color: rgb(255 255 255 / 24%);
  background: rgb(18 32 27 / 66%);
}

.mobile-story-preview__count {
  padding-inline: 10px 6px;
  font-size: 10px;
  font-weight: 850;
  white-space: nowrap;
}

.mobile-story-preview__selectors {
  display: flex;
  align-items: center;
}

.mobile-story-preview__selectors button,
.mobile-story-preview__arrow {
  display: inline-grid;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  color: inherit;
  background: transparent;
  cursor: pointer;
  place-items: center;
}

.mobile-story-preview__selectors button span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentcolor;
  opacity: 0.35;
  transition:
    width var(--motion-duration-fast) var(--motion-ease-out),
    opacity var(--motion-duration-fast) var(--motion-ease-out);
}

.mobile-story-preview__selectors button[aria-current='true'] span {
  width: 18px;
  border-radius: var(--radius-pill);
  opacity: 1;
}

.mobile-story-preview__arrow {
  border: 1px solid rgb(47 36 27 / 14%);
}

.mobile-story-preview--deep .mobile-story-preview__arrow {
  border-color: rgb(255 255 255 / 22%);
}

.mobile-story-preview__arrow--previous .base-icon {
  transform: rotate(180deg);
}

.mobile-story-preview__disclosure {
  position: absolute;
  z-index: 3;
  bottom: 22px;
  left: var(--page-gutter);
  max-width: 118px;
  margin: 0;
  color: currentcolor;
  font-size: 9px;
  font-weight: 700;
  opacity: 0.64;
}

.mobile-story-enter-active,
.mobile-story-leave-active {
  transition:
    opacity 420ms var(--motion-ease-out),
    transform 420ms var(--motion-ease-out);
}

.mobile-story-enter-from {
  opacity: 0;
  transform: translateX(4%);
}

.mobile-story-leave-to {
  opacity: 0;
  transform: translateX(-3%);
}

@media (max-width: 360px) {
  .mobile-story-preview__content {
    padding-top: 22px;
  }

  .mobile-story-preview h1 {
    font-size: 36px;
  }

  .mobile-story-preview__copy > p {
    font-size: 13px;
  }

  .mobile-story-preview__app-shell {
    width: min(252px, calc(100% - 24px));
    min-height: 304px;
  }

  .mobile-story-preview__story--with-panel .mobile-story-preview__app-shell {
    width: min(278px, calc(100% - 24px));
  }

  .mobile-story-preview__count {
    display: none;
  }

  .mobile-story-preview__selectors button {
    width: 34px;
  }
}

@media (max-height: 650px) {
  .mobile-story-preview__content {
    padding-top: 16px;
  }

  .mobile-story-preview h1 {
    font-size: 31px;
  }

  .mobile-story-preview__copy {
    gap: 6px;
  }

  .mobile-story-preview__copy > p {
    font-size: 12px;
    line-height: 1.45;
  }

  .mobile-story-preview__copy--with-panel > p,
  .mobile-story-preview__copy--with-panel .mobile-story-preview__actions {
    display: none;
  }

  .mobile-story-preview__story--with-panel .mobile-story-preview__image {
    height: 178px;
  }

  .mobile-story-preview__story--with-panel .mobile-story-preview__veil {
    background:
      linear-gradient(
        180deg,
        rgb(255 253 248 / 80%) 0%,
        rgb(255 253 248 / 10%) 24%,
        rgb(244 236 225 / 26%) 31%,
        #f4ece1 38%,
        #f4ece1 100%
      ),
      linear-gradient(90deg, rgb(255 253 248 / 90%) 0%, rgb(255 253 248 / 26%) 52%, transparent 80%);
  }

  .mobile-story-preview__story--with-panel .mobile-story-preview__copy {
    max-width: 154px;
  }

  .mobile-story-preview .mobile-story-preview__story--with-panel h1 {
    max-width: 154px;
    font-size: 24px;
  }

  .mobile-story-preview__actions {
    margin-top: 0;
  }

  .mobile-story-preview__highlights {
    bottom: 66px;
  }

  .mobile-story-preview__app-shell {
    bottom: 58px;
    height: calc(100% - 166px);
    min-height: 286px;
  }

  .mobile-story-preview__story--with-panel .mobile-story-preview__app-shell {
    height: calc(100% - 186px);
    min-height: 300px;
  }

  .mobile-story-preview__story--with-panel .mobile-story-preview__app-shell :deep(.hero-app-panel) {
    width: 153.846%;
    min-height: 153.846%;
    transform: scale(0.65);
    transform-origin: top left;
    gap: 4px;
    padding: 8px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__pet) {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 6px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__avatar) {
    width: 28px;
    height: 28px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__pet strong) {
    font-size: 13px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__score) {
    grid-template-columns: minmax(0, 1fr) 48px;
    padding: 6px 8px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__score strong) {
    font-size: 24px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__gauge) {
    width: 46px;
    height: 46px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__metrics) {
    gap: 4px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__metrics div) {
    padding: 5px 6px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__trend) {
    padding: 4px 6px 3px;
  }

  .mobile-story-preview__story--with-panel
    .mobile-story-preview__app-shell
    :deep(.hero-app-panel__trend svg) {
    height: 42px;
    min-height: 42px;
  }

  .mobile-story-preview__disclosure {
    bottom: 16px;
  }

  .mobile-story-preview__controls {
    bottom: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-story-enter-active,
  .mobile-story-leave-active,
  .mobile-story-preview__selectors button span {
    transition-duration: 0.01ms;
  }

  .mobile-story-enter-from,
  .mobile-story-leave-to {
    transform: none;
  }
}
</style>

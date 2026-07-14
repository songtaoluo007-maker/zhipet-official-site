<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import { usePublicAssetUrl } from '~/composables/usePublicAssetUrl'
import type { HomeStoryAppPanel, HomeStoryStage } from '~/data/v2'

const props = withDefaults(
  defineProps<{
    stage: HomeStoryStage
    priority?: boolean
  }>(),
  {
    priority: false,
  },
)

const defaultSignalId = computed(() => props.stage.signals[0]?.id ?? '')
const activeSignalId = ref(defaultSignalId.value)
const panelId = useId()
const publicAssetUrl = usePublicAssetUrl()

const fallbackPanel = computed<HomeStoryAppPanel>(() => ({
  title: props.stage.phoneTitle,
  score: props.stage.phoneScore,
  summary: props.stage.phoneSummary,
  progress: 76,
  metrics: props.stage.metrics,
}))

const activeSignal = computed(
  () => props.stage.signals.find((signal) => signal.id === activeSignalId.value) ?? props.stage.signals[0],
)

const activePanel = computed(() => activeSignal.value?.panel ?? fallbackPanel.value)

const gaugeStyle = computed(() => ({
  width: `${Math.min(Math.max(activePanel.value.progress, 0), 100)}%`,
}))

watch(
  () => props.stage.id,
  () => {
    activeSignalId.value = defaultSignalId.value
  },
)
</script>

<template>
  <figure class="product-story-stage" :class="`product-story-stage--${stage.tone}`">
    <img
      class="product-story-stage__scene"
      :src="publicAssetUrl(stage.asset)"
      :alt="stage.assetAlt"
      :loading="priority ? 'eager' : 'lazy'"
    >

    <div class="product-story-stage__path" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>

    <ul class="product-story-stage__signals" aria-label="可切换的场景状态提示">
      <li v-for="signal in stage.signals" :key="signal.id">
        <button
          type="button"
          class="product-story-stage__signal"
          :class="{ 'is-active': activeSignalId === signal.id }"
          :aria-pressed="activeSignalId === signal.id"
          :aria-controls="panelId"
          @click="activeSignalId = signal.id"
        >
          <BaseIcon :name="signal.icon" aria-hidden="true" />
          <span>{{ signal.title }}</span>
          <strong>{{ signal.description }}</strong>
        </button>
      </li>
    </ul>

    <div class="product-story-stage__device" aria-label="知宠智能项圈概念模块">
      <span class="product-story-stage__strap" aria-hidden="true" />
      <span class="product-story-stage__module">
        <strong>ZHIPET</strong>
        <i aria-hidden="true" />
      </span>
    </div>

    <section
      :id="panelId"
      class="product-story-stage__phone"
      aria-label="知宠 App 概念面板"
      aria-live="polite"
    >
      <Transition name="stage-panel" mode="out-in">
        <div :key="activeSignal?.id ?? stage.id" class="product-story-stage__panel-content">
          <div class="product-story-stage__phone-head">
            <span>{{ activePanel.title }}</span>
            <strong>{{ activePanel.score }}</strong>
          </div>
          <p>{{ activePanel.summary }}</p>
        </div>
      </Transition>
      <div class="product-story-stage__gauge" aria-hidden="true">
        <span :style="gaugeStyle" />
      </div>
      <dl>
        <div v-for="metric in activePanel.metrics" :key="metric.id">
          <dt>{{ metric.label }}</dt>
          <dd>{{ metric.value }}</dd>
        </div>
      </dl>
    </section>
  </figure>
</template>

<style scoped lang="scss">
.product-story-stage {
  position: relative;
  overflow: hidden;
  min-height: 560px;
  margin: 0;
  border: 1px solid rgb(255 255 255 / 74%);
  border-radius: 28px;
  background:
    radial-gradient(circle at 78% 18%, rgb(232 200 148 / 24%), transparent 32%),
    linear-gradient(135deg, rgb(255 255 255 / 88%), rgb(245 239 230 / 82%));
  isolation: isolate;
}

.product-story-stage::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(90deg, rgb(251 248 242 / 68%) 0%, rgb(251 248 242 / 20%) 42%, rgb(20 63 50 / 12%) 100%),
    linear-gradient(180deg, rgb(255 255 255 / 20%), rgb(20 63 50 / 12%));
  content: '';
  pointer-events: none;
}

.product-story-stage__scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.98;
  transform-origin: 58% 62%;
  transition:
    opacity var(--motion-duration-slow) var(--motion-ease-out),
    transform var(--motion-duration-slow) var(--motion-ease-out);
}

.product-story-stage--deep .product-story-stage__scene {
  transform: scale(1.03);
}

.product-story-stage--warm .product-story-stage__scene {
  transform: scale(1.02);
}

.product-story-stage__label {
  position: absolute;
  right: var(--space-4);
  bottom: var(--space-4);
  z-index: 4;
  padding: 6px 10px;
  border: 1px solid rgb(255 255 255 / 72%);
  border-radius: var(--radius-pill);
  color: var(--color-text-secondary);
  background: rgb(255 255 255 / 82%);
  font-size: 12px;
  font-weight: 650;
  backdrop-filter: blur(10px);
}

.product-story-stage__path {
  position: absolute;
  inset: 18% 8% 20% 10%;
  z-index: 2;
  border: 1px solid rgb(86 130 103 / 24%);
  border-radius: 50%;
  transform: rotate(-13deg);
}

.product-story-stage__path span {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid var(--color-surface);
  border-radius: 50%;
  background: var(--color-accent-600);
  box-shadow: 0 0 0 8px rgb(255 255 255 / 38%);
}

.product-story-stage__path span:nth-child(1) {
  top: 8%;
  left: 24%;
}

.product-story-stage__path span:nth-child(2) {
  top: 46%;
  right: 4%;
}

.product-story-stage__path span:nth-child(3) {
  bottom: 10%;
  left: 50%;
}

.product-story-stage__signals {
  position: absolute;
  z-index: 3;
  top: var(--space-5);
  left: var(--space-5);
  display: grid;
  gap: var(--space-3);
  width: min(275px, calc(100% - 48px));
  padding: 0;
  margin: 0;
  list-style: none;
}

.product-story-stage__signals li {
  min-width: 0;
}

.product-story-stage__signal {
  appearance: none;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1px var(--space-2);
  align-items: center;
  width: fit-content;
  min-width: 210px;
  padding: 10px 12px;
  border: 1px solid rgb(255 255 255 / 74%);
  border-radius: var(--radius-pill);
  background: rgb(255 255 255 / 78%);
  box-shadow: 0 14px 34px rgb(47 36 27 / 8%);
  backdrop-filter: blur(12px);
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    background var(--motion-duration-fast) var(--motion-ease-out),
    box-shadow var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.product-story-stage__signal:hover,
.product-story-stage__signal:focus-visible,
.product-story-stage__signal.is-active {
  border-color: rgb(200 138 56 / 42%);
  background: rgb(255 255 255 / 90%);
  box-shadow: 0 18px 42px rgb(47 36 27 / 12%);
  transform: translateY(-2px);
}

.product-story-stage__signal:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 3px;
  box-shadow: var(--focus-ring), 0 18px 42px rgb(47 36 27 / 12%);
}

.product-story-stage__signal.is-active {
  color: var(--color-brand-900);
}

.product-story-stage__signal .base-icon {
  grid-row: span 2;
  color: var(--color-sage-700);
  font-size: 20px;
}

.product-story-stage__signal span {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 750;
}

.product-story-stage__signal strong {
  color: var(--color-brand-900);
  font-size: 14px;
  line-height: 1.35;
}

.product-story-stage__device {
  position: absolute;
  z-index: 3;
  right: 32%;
  bottom: 9%;
  width: min(260px, 42%);
  min-width: 190px;
  transform: rotate(-4deg);
}

.product-story-stage__strap {
  position: absolute;
  inset: 18px 8px auto 8px;
  height: 56px;
  border: 1px solid rgb(102 80 60 / 28%);
  border-radius: 999px;
  background:
    repeating-linear-gradient(90deg, rgb(102 80 60 / 10%) 0 6px, transparent 6px 14px),
    #d9cdb9;
}

.product-story-stage__module {
  position: relative;
  display: flex;
  width: 128px;
  height: 58px;
  align-items: center;
  justify-content: center;
  margin-inline: auto;
  border: 1px solid rgb(102 80 60 / 28%);
  border-radius: 24px;
  background: linear-gradient(180deg, #fffdf8, #e8dfd1);
  box-shadow: 0 16px 34px rgb(47 36 27 / 16%);
}

.product-story-stage__module strong {
  color: rgb(102 80 60 / 76%);
  font-size: 12px;
  letter-spacing: 0.24em;
}

.product-story-stage__module i {
  position: absolute;
  right: 16px;
  bottom: 15px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #74cfa3;
  box-shadow: 0 0 12px rgb(116 207 163 / 88%);
}

.product-story-stage__phone {
  position: absolute;
  z-index: 3;
  right: var(--space-5);
  top: 16%;
  display: grid;
  gap: var(--space-3);
  width: min(285px, calc(100% - 48px));
  padding: var(--space-4);
  border: 1px solid rgb(255 255 255 / 74%);
  border-radius: 22px;
  background: rgb(255 255 255 / 84%);
  box-shadow: 0 22px 58px rgb(47 36 27 / 11%);
  backdrop-filter: blur(16px);
}

.product-story-stage__phone-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-3);
}

.product-story-stage__panel-content {
  display: grid;
  gap: var(--space-3);
}

.product-story-stage__phone-head span,
.product-story-stage__phone p,
.product-story-stage__phone dt {
  color: var(--color-text-secondary);
}

.product-story-stage__phone-head span {
  font-weight: 750;
}

.product-story-stage__phone-head strong {
  color: var(--color-brand-900);
  font-size: 40px;
  line-height: 1;
}

.product-story-stage__phone p {
  font-size: 13px;
  line-height: 1.6;
}

.product-story-stage__gauge {
  overflow: hidden;
  height: 7px;
  border-radius: var(--radius-pill);
  background: rgb(86 130 103 / 14%);
}

.product-story-stage__gauge span {
  display: block;
  width: 76%;
  height: 100%;
  border-radius: inherit;
  background: var(--color-sage-700);
  transition: width var(--motion-duration-base) var(--motion-ease-out);
}

.product-story-stage__phone dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
  margin: 0;
}

.product-story-stage__phone div {
  min-width: 0;
}

.product-story-stage__phone dl div {
  padding: var(--space-2);
  border: 1px solid rgb(200 138 56 / 18%);
  border-radius: var(--radius-button);
  background: rgb(251 248 242 / 72%);
}

.product-story-stage__phone dt {
  font-size: 12px;
  font-weight: 750;
}

.product-story-stage__phone dd {
  margin: var(--space-1) 0 0;
  color: var(--color-brand-900);
  font-size: 13px;
  font-weight: 800;
}

@media (max-width: 760px) {
  .product-story-stage {
    min-height: 610px;
  }

  .product-story-stage__scene {
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .product-story-stage__path {
    display: none;
  }

  .product-story-stage__signals {
    top: var(--space-4);
    left: var(--space-4);
    width: min(260px, calc(100% - 32px));
  }

  .product-story-stage__phone {
    top: auto;
    right: var(--space-4);
    bottom: var(--space-5);
    width: min(310px, calc(100% - 32px));
  }

  .product-story-stage__device {
    right: 40%;
    bottom: 35%;
    width: 210px;
    min-width: 0;
  }
}

@media (max-width: 520px) {
  .product-story-stage {
    min-height: 660px;
    border-radius: 20px;
  }

  .product-story-stage__signals li {
    min-width: 0;
    width: 100%;
  }

  .product-story-stage__signal {
    width: 100%;
  }

  .product-story-stage__phone dl {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-story-stage__scene,
  .product-story-stage__signal,
  .product-story-stage__gauge span {
    transition-duration: 0.01ms;
    transform: none;
  }

  .stage-panel-enter-active,
  .stage-panel-leave-active {
    transition-duration: 0.01ms;
  }
}

.stage-panel-enter-active,
.stage-panel-leave-active {
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.stage-panel-enter-from,
.stage-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

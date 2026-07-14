<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import HeroAppPanel from '~/components/home/HeroAppPanel.vue'
import { usePublicAssetUrl } from '~/composables/usePublicAssetUrl'
import type { HomeStoryStage } from '~/data/v2'

const props = withDefaults(
  defineProps<{
    stage: HomeStoryStage
    priority?: boolean
  }>(),
  {
    priority: false,
  },
)

const decorativeSignals = computed(() => props.stage.signals.slice(0, 4))
const publicAssetUrl = usePublicAssetUrl()
</script>

<template>
  <figure
    class="hero-immersive-stage"
    :class="[`hero-immersive-stage--${stage.tone}`, `hero-immersive-stage--${stage.id}`]"
  >
    <img
      class="hero-immersive-stage__scene"
      :src="publicAssetUrl(stage.asset)"
      :alt="stage.assetAlt"
      :loading="priority ? 'eager' : 'lazy'"
    >

    <div class="hero-immersive-stage__path" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>

    <ul class="hero-immersive-stage__signals" aria-label="场景状态提示">
      <li v-for="signal in decorativeSignals" :key="signal.id">
        <div
          class="hero-immersive-stage__signal"
        >
          <BaseIcon :name="signal.icon" aria-hidden="true" />
          <span>{{ signal.title }}</span>
          <strong>{{ signal.description }}</strong>
        </div>
      </li>
    </ul>

    <section
      class="hero-immersive-stage__phone"
      aria-label="知宠 App 概念面板"
    >
      <HeroAppPanel :stage="stage" />
    </section>

    <figcaption class="hero-immersive-stage__label">
      AI 概念图，仅供参考 · App 界面与数据为示意
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.hero-immersive-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  margin: 0;
  background: var(--color-surface-soft);
  isolation: isolate;
}

.hero-immersive-stage::before,
.hero-immersive-stage::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: '';
  pointer-events: none;
}

.hero-immersive-stage::before {
  background:
    linear-gradient(90deg, rgb(255 253 248 / 86%) 0%, rgb(255 253 248 / 32%) 22%, rgb(255 253 248 / 0%) 43%, rgb(255 253 248 / 0%) 100%),
    linear-gradient(180deg, rgb(255 253 248 / 5%) 0%, rgb(255 253 248 / 0%) 50%, rgb(251 248 242 / 10%) 100%);
}

.hero-immersive-stage::after {
  background:
    radial-gradient(circle at 8% 78%, rgb(86 130 103 / 5%), transparent 22%),
    radial-gradient(circle at 78% 19%, rgb(200 138 56 / 4%), transparent 26%);
}

.hero-immersive-stage__scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: saturate(1.2) contrast(1.12) brightness(1.03);
  transform: scale(1);
}

.hero-immersive-stage__label {
  position: absolute;
  bottom: 18px;
  left: max(var(--page-gutter), calc((100vw - var(--container-default)) / 2));
  z-index: 4;
  padding: 7px 12px;
  border: 1px solid rgb(255 253 248 / 48%);
  border-radius: var(--radius-pill);
  color: var(--color-text-secondary);
  background: rgb(255 253 248 / 50%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 36%),
    0 12px 30px rgb(47 36 27 / 7%);
  font-size: 12px;
  font-weight: 750;
  backdrop-filter: blur(18px) saturate(0.9);
}

.hero-immersive-stage__path {
  position: absolute;
  z-index: 2;
  top: 12%;
  right: 16%;
  width: min(55vw, 820px);
  height: min(58vw, 640px);
  border: 1px solid rgb(255 253 248 / 58%);
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 1px rgb(86 130 103 / 10%),
    0 0 52px rgb(255 253 248 / 22%);
  opacity: 0.74;
  transform: rotate(-22deg);
  pointer-events: none;
}

.hero-immersive-stage__path::before {
  position: absolute;
  inset: 14% 6% 10% 8%;
  border: 1px solid rgb(255 253 248 / 38%);
  border-radius: inherit;
  content: '';
}

.hero-immersive-stage__path span {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid var(--color-surface);
  border-radius: 50%;
  background: rgb(200 138 56 / 86%);
  box-shadow: 0 0 0 8px rgb(255 255 255 / 38%);
}

.hero-immersive-stage__path span:nth-child(1) {
  top: 9%;
  left: 26%;
}

.hero-immersive-stage__path span:nth-child(2) {
  top: 48%;
  right: 4%;
}

.hero-immersive-stage__path span:nth-child(3) {
  bottom: 11%;
  left: 50%;
}

.hero-immersive-stage__path span:nth-child(4) {
  display: none;
}

.hero-immersive-stage__signals {
  position: absolute;
  z-index: 4;
  inset: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  pointer-events: none;
}

.hero-immersive-stage__signals li {
  position: absolute;
  pointer-events: none;
}

.hero-immersive-stage__signals li:nth-child(1) {
  top: clamp(128px, 16vh, 168px);
  left: clamp(520px, 41vw, 620px);
}

.hero-immersive-stage__signals li:nth-child(2) {
  bottom: clamp(120px, 16vh, 160px);
  left: clamp(470px, 38vw, 590px);
}

.hero-immersive-stage__signals li:nth-child(3) {
  top: clamp(112px, 14vh, 148px);
  left: clamp(760px, 60vw, 900px);
  right: auto;
}

.hero-immersive-stage__signals li:nth-child(4) {
  top: clamp(330px, 42vh, 410px);
  left: clamp(760px, 60vw, 900px);
  right: auto;
}

.hero-immersive-stage__signal {
  position: relative;
  display: grid;
  grid-template-columns: 38px max-content;
  gap: 0 var(--space-2);
  align-items: center;
  min-width: 142px;
  min-height: 52px;
  padding: 7px 13px 7px 7px;
  border: 1px solid rgb(255 253 248 / 54%);
  border-radius: var(--radius-pill);
  color: inherit;
  background:
    linear-gradient(135deg, rgb(255 253 248 / 50%), rgb(255 253 248 / 22%)),
    rgb(245 239 230 / 20%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 46%),
    0 10px 28px rgb(47 36 27 / 5%);
  backdrop-filter: blur(20px) saturate(0.9);
  font: inherit;
  text-align: left;
}

.hero-immersive-stage__signal .base-icon {
  grid-row: span 2;
  width: 38px;
  height: 38px;
  padding: 9px;
  border-radius: 50%;
  color: var(--color-sage-700);
  background:
    linear-gradient(180deg, rgb(231 240 230 / 66%), rgb(255 253 248 / 42%)),
    rgb(255 253 248 / 36%);
  font-size: 22px;
}

.hero-immersive-stage__signal span {
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 750;
}

.hero-immersive-stage__signal strong {
  overflow-wrap: anywhere;
  color: var(--color-brand-900);
  font-size: 14px;
  line-height: 1.25;
}

.hero-immersive-stage__phone {
  position: absolute;
  z-index: 4;
  top: clamp(44px, 7vh, 72px);
  right: max(24px, calc((100vw - var(--container-default)) / 2 - 112px));
  display: grid;
  width: min(306px, 20vw);
  aspect-ratio: 383 / 831;
  border-radius: 36px;
}

.hero-immersive-stage--companionship .hero-immersive-stage__phone {
  right: max(20px, calc((100vw - var(--container-default)) / 2 - 360px));
  width: min(292px, 18.5vw);
}

.hero-immersive-stage--safety .hero-immersive-stage__phone {
  right: max(58px, calc((100vw - 1760px) / 2 + 54px));
}

.hero-immersive-stage--health .hero-immersive-stage__phone {
  right: max(58px, calc((100vw - 1760px) / 2 + 54px));
}

.hero-immersive-stage--safety .hero-immersive-stage__path,
.hero-immersive-stage--health .hero-immersive-stage__path {
  opacity: 0.42;
}

.hero-immersive-stage--safety .hero-immersive-stage__signals li:nth-child(1) {
  top: auto;
  bottom: clamp(220px, 25vh, 260px);
  left: clamp(590px, 43vw, 690px);
}

.hero-immersive-stage--health .hero-immersive-stage__signals li:nth-child(1) {
  top: clamp(138px, 15vh, 168px);
  left: clamp(520px, 39vw, 610px);
}

.hero-immersive-stage__phone::before,
.hero-immersive-stage__phone::after {
  position: absolute;
  left: 50%;
  z-index: 6;
  display: block;
  border-radius: var(--radius-pill);
  background: rgb(20 63 50 / 18%);
  content: '';
  transform: translateX(-50%);
  pointer-events: none;
}

.hero-immersive-stage__phone::before {
  top: 9px;
  width: 54px;
  height: 4px;
}

.hero-immersive-stage__phone::after {
  bottom: 9px;
  width: 62px;
  height: 3px;
}

.hero-immersive-stage__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 4px;
  color: var(--color-brand-900);
  font-size: 11px;
  font-weight: 850;
}

.hero-immersive-stage__status i {
  width: 32px;
  height: 8px;
  border-radius: var(--radius-pill);
  background:
    linear-gradient(90deg, var(--color-brand-900) 0 28%, transparent 28% 38%, var(--color-brand-900) 38% 66%, transparent 66% 76%, var(--color-brand-900) 76% 100%);
  opacity: 0.42;
}

.hero-immersive-stage__pet {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: var(--space-2);
  align-items: center;
  padding-inline: 4px;
}

.hero-immersive-stage__avatar {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid rgb(255 253 248 / 44%);
  border-radius: 50%;
  color: var(--color-sage-700);
  background:
    linear-gradient(180deg, rgb(231 240 230 / 58%), rgb(255 253 248 / 34%)),
    rgb(255 253 248 / 30%);
  font-size: 22px;
}

.hero-immersive-stage__pet div {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.hero-immersive-stage__pet strong {
  color: var(--color-brand-900);
  font-size: 18px;
  line-height: 1.15;
}

.hero-immersive-stage__pet span:not(.hero-immersive-stage__avatar) {
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-immersive-stage__score-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: var(--space-3);
  align-items: center;
  padding: 14px;
  border: 1px solid rgb(255 253 248 / 42%);
  border-radius: 14px;
  background: rgb(255 253 248 / 44%);
}

.hero-immersive-stage__score-card div {
  display: grid;
  gap: 2px;
}

.hero-immersive-stage__score-card span,
.hero-immersive-stage__phone p,
.hero-immersive-stage__phone dt {
  color: var(--color-text-secondary);
}

.hero-immersive-stage__score-card span {
  font-size: 12px;
  font-weight: 750;
}

.hero-immersive-stage__score-card strong {
  color: var(--color-brand-900);
  font-size: 36px;
  line-height: 1;
}

.hero-immersive-stage__score-card small {
  color: var(--color-sage-700);
  font-size: 11px;
  font-weight: 800;
}

.hero-immersive-stage__dial {
  position: relative;
  display: grid;
  width: 82px;
  height: 82px;
  place-items: center;
  border-radius: 50%;
}

.hero-immersive-stage__dial::before {
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  background: rgb(255 253 248 / 68%);
  content: '';
}

.hero-immersive-stage__dial .base-icon {
  position: relative;
  color: var(--color-sage-700);
  font-size: 24px;
}

.hero-immersive-stage__phone p {
  font-size: 12px;
  line-height: 1.62;
}

.hero-immersive-stage__phone dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
  margin: 0;
}

.hero-immersive-stage__phone dl div {
  min-width: 0;
  padding: 10px;
  border: 1px solid rgb(255 253 248 / 38%);
  border-radius: 11px;
  background: rgb(255 253 248 / 32%);
}

.hero-immersive-stage__phone dt {
  font-size: 11px;
  font-weight: 750;
}

.hero-immersive-stage__phone dd {
  margin: 4px 0 0;
  overflow-wrap: anywhere;
  color: var(--color-brand-900);
  font-size: 12px;
  font-weight: 800;
}

.hero-immersive-stage__trend {
  position: relative;
  display: grid;
  height: 104px;
  align-items: end;
  padding: 28px 12px 14px;
  border: 1px solid rgb(255 253 248 / 38%);
  border-radius: 14px;
  background:
    linear-gradient(rgb(20 63 50 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(20 63 50 / 5%) 1px, transparent 1px),
    rgb(255 253 248 / 28%);
  background-size: 100% 22px, 38px 100%, auto;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}

.hero-immersive-stage__trend span {
  position: absolute;
  top: 9px;
  left: 12px;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 800;
}

.hero-immersive-stage__trend i {
  display: block;
  border-radius: var(--radius-pill);
  background: linear-gradient(180deg, rgb(86 130 103 / 42%), rgb(86 130 103 / 18%));
}

.hero-immersive-stage__trend i:nth-of-type(1) {
  height: 28%;
}

.hero-immersive-stage__trend i:nth-of-type(2) {
  height: 42%;
}

.hero-immersive-stage__trend i:nth-of-type(3) {
  height: 38%;
}

.hero-immersive-stage__trend i:nth-of-type(4) {
  height: 54%;
}

.hero-immersive-stage__trend i:nth-of-type(5) {
  height: 48%;
}

.hero-immersive-stage__trend i:nth-of-type(6) {
  height: 68%;
}

@media (max-width: 1180px) {
  .hero-immersive-stage__scene {
    object-position: 61% center;
  }

  .hero-immersive-stage__path {
    opacity: 0.52;
  }

  .hero-immersive-stage__signals {
    inset: auto auto 22px var(--page-gutter);
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-2);
    width: min(230px, calc(100% - 430px));
    pointer-events: none;
  }

  .hero-immersive-stage__signals li,
  .hero-immersive-stage__signals li:nth-child(1),
  .hero-immersive-stage__signals li:nth-child(2),
  .hero-immersive-stage__signals li:nth-child(3),
  .hero-immersive-stage__signals li:nth-child(4) {
    position: static;
  }

  .hero-immersive-stage__signal {
    grid-template-columns: 36px minmax(0, 1fr);
    width: 100%;
    min-width: 0;
  }

  .hero-immersive-stage__signal .base-icon {
    width: 36px;
    height: 36px;
    padding: 8px;
    font-size: 18px;
  }

  .hero-immersive-stage__phone {
    top: auto;
    right: max(8px, calc(var(--page-gutter) - 28px));
    bottom: 56px;
    width: min(300px, calc(100% - 32px));
    height: auto;
    min-height: 0;
  }

  .hero-immersive-stage__phone p,
  .hero-immersive-stage__trend {
    display: none;
  }
}

@media (max-width: 760px) {
  .hero-immersive-stage::before {
    background:
      linear-gradient(180deg, rgb(255 253 248 / 90%) 0%, rgb(255 253 248 / 50%) 36%, rgb(255 253 248 / 4%) 100%),
      linear-gradient(90deg, rgb(255 253 248 / 22%), rgb(255 253 248 / 0%));
  }

  .hero-immersive-stage__scene {
    object-position: 64% center;
  }

  .hero-immersive-stage__path {
    display: none;
  }

  .hero-immersive-stage__signals {
    inset: auto var(--page-gutter) 360px var(--page-gutter);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-2);
    width: auto;
    pointer-events: none;
  }

  .hero-immersive-stage__signals li,
  .hero-immersive-stage__signals li:nth-child(1),
  .hero-immersive-stage__signals li:nth-child(2),
  .hero-immersive-stage__signals li:nth-child(3),
  .hero-immersive-stage__signals li:nth-child(4) {
    position: static;
  }

  .hero-immersive-stage__signal {
    grid-template-columns: 34px minmax(0, 1fr);
    width: 100%;
    min-width: 0;
    min-height: 62px;
    padding: 8px 10px 8px 8px;
  }

  .hero-immersive-stage__signal .base-icon {
    width: 34px;
    height: 34px;
    padding: 8px;
    font-size: 18px;
  }

  .hero-immersive-stage__signal span {
    font-size: 10px;
  }

  .hero-immersive-stage__signal strong {
    font-size: 13px;
  }

  .hero-immersive-stage__phone {
    right: var(--page-gutter);
    bottom: 32px;
    width: min(300px, calc(100% - 32px));
    border-radius: 24px;
  }

  .hero-immersive-stage__phone-screen {
    aspect-ratio: 320 / 520;
  }

  .hero-immersive-stage__score-card {
    grid-template-columns: minmax(0, 1fr) 72px;
    padding: 12px;
  }

  .hero-immersive-stage__score-card strong {
    font-size: 32px;
  }

  .hero-immersive-stage__dial {
    width: 68px;
    height: 68px;
  }

  .hero-immersive-stage__label {
    bottom: 10px;
  }
}

@media (max-width: 520px) {
  .hero-immersive-stage__signals {
    bottom: 336px;
  }

  .hero-immersive-stage__phone {
    bottom: 0;
  }

  .hero-immersive-stage__pet {
    display: none;
  }

  .hero-immersive-stage__label {
    right: var(--page-gutter);
    bottom: 10px;
    left: auto;
  }

  .hero-immersive-stage__trend {
    display: none;
  }

  .hero-immersive-stage__phone p {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-immersive-stage__signal {
    transition-duration: 0.01ms;
  }
}
</style>



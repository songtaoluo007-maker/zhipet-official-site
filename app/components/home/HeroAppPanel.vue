<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import { usePublicAssetUrl } from '~/composables/usePublicAssetUrl'
import type { HomeStoryAppPanel, HomeStoryPanelMetric, HomeStoryStage } from '~/data/v2'
import type { IconName } from '~/types/ui'

const props = defineProps<{
  stage: HomeStoryStage
}>()

const publicAssetUrl = usePublicAssetUrl()

const fallbackPanel = computed<HomeStoryAppPanel>(() => ({
  title: props.stage.phoneTitle,
  score: props.stage.phoneScore,
  summary: props.stage.phoneSummary,
  progress: 64,
  metrics: props.stage.metrics,
}))

const panel = computed<HomeStoryAppPanel>(() => props.stage.signals[0]?.panel ?? fallbackPanel.value)

const scoreUnit = computed(() => (/^\d+$/.test(panel.value.score) ? '分' : ''))

const statusText = computed(() => {
  const firstMetric = panel.value.metrics[0]

  return firstMetric?.value ?? props.stage.phoneTitle
})

const petStatus = computed(() => {
  if (props.stage.id === 'safety') {
    return '安全范围'
  }

  if (props.stage.id === 'health') {
    return '趋势观察'
  }

  return '可能平稳'
})

const petProfileLine = computed(() => {
  if (props.stage.id === 'safety') {
    return '位置线索 · 环境相关'
  }

  if (props.stage.id === 'health') {
    return '健康档案 · 趋势观察'
  }

  return '宠物档案 · 结合观察'
})

const metrics = computed<HomeStoryPanelMetric[]>(() => {
  const merged = [...panel.value.metrics, ...props.stage.metrics]
  const uniqueMetrics: HomeStoryPanelMetric[] = []

  for (const item of merged) {
    if (!uniqueMetrics.some(metric => metric.id === item.id)) {
      uniqueMetrics.push(item)
    }
  }

  return uniqueMetrics.slice(0, 4)
})

const metricIconName = (metric: HomeStoryPanelMetric, index: number): IconName => {
  const iconMap: Partial<Record<string, IconName>> = {
    activity: 'chart',
    care: 'shield-check',
    sleep: 'sparkles',
    basis: 'heart-pulse',
    evidence: 'chart',
    environment: 'home',
    range: 'map-pin',
    refresh: 'phone',
    share: 'users',
    trigger: 'shield-check',
    review: 'check-circle',
  }

  const fallbackIcons: IconName[] = ['heart-pulse', 'chart', 'sparkles', 'map-pin']

  return iconMap[metric.id] ?? fallbackIcons[index] ?? 'heart-pulse'
}

const gaugeStyle = computed<Record<string, string>>(() => ({
  '--gauge-angle': `${Math.round(Math.max(12, Math.min(92, panel.value.progress)) * 2.58)}deg`,
}))

const trendPoints = computed(() => {
  if (props.stage.id === 'safety') {
    return '12,78 48,70 82,73 116,61 150,64 184,48 220,42 252,34'
  }

  if (props.stage.id === 'health') {
    return '12,74 48,66 82,62 116,56 150,48 184,45 220,36 252,32'
  }

  return '12,72 48,82 82,70 116,62 150,45 184,66 220,54 252,28'
})

const trendDots = computed(() =>
  trendPoints.value.split(' ').map((point, index) => {
    const [x = '0', y = '0'] = point.split(',')

    return {
      id: `${props.stage.id}-dot-${index}`,
      x,
      y,
    }
  }),
)
</script>

<template>
  <article class="hero-app-panel" aria-label="知宠 App 概念界面">
    <div class="hero-app-panel__status" aria-hidden="true">
      <span>9:41</span>
      <i />
    </div>

    <header class="hero-app-panel__pet">
      <img
        class="hero-app-panel__avatar"
        :src="publicAssetUrl(stage.asset)"
        alt=""
        loading="lazy"
      >
      <div>
        <strong>布丁 <span aria-hidden="true">♂</span></strong>
        <p>{{ petProfileLine }}</p>
        <em>{{ petStatus }}</em>
      </div>
    </header>

    <section class="hero-app-panel__score" aria-label="今日观察">
      <div>
        <span>今日健康评分</span>
        <strong>{{ panel.score }}<small v-if="scoreUnit">{{ scoreUnit }}</small></strong>
        <p>{{ statusText }}</p>
      </div>
      <div class="hero-app-panel__gauge" :style="gaugeStyle" aria-hidden="true">
        <span>
          <BaseIcon :name="stage.icon" />
        </span>
      </div>
    </section>

    <dl class="hero-app-panel__metrics">
      <div v-for="(metric, index) in metrics" :key="metric.id">
        <dt>
          <BaseIcon :name="metricIconName(metric, index)" aria-hidden="true" />
          {{ metric.label }}
        </dt>
        <dd>{{ metric.value }}</dd>
      </div>
    </dl>

    <section class="hero-app-panel__trend" aria-label="活动趋势">
      <h2>活动趋势（7天）</h2>
      <svg viewBox="0 0 264 112" role="img" aria-label="趋势观察示意图">
        <g class="hero-app-panel__grid" aria-hidden="true">
          <path d="M12 20H252" />
          <path d="M12 52H252" />
          <path d="M12 84H252" />
          <path d="M12 20V92" />
          <path d="M72 20V92" />
          <path d="M132 20V92" />
          <path d="M192 20V92" />
          <path d="M252 20V92" />
        </g>
        <polyline class="hero-app-panel__line" :points="trendPoints" />
        <circle
          v-for="dot in trendDots"
          :key="dot.id"
          class="hero-app-panel__dot"
          :cx="dot.x"
          :cy="dot.y"
          r="3.5"
        />
      </svg>
      <div class="hero-app-panel__days" aria-hidden="true">
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>六</span>
        <span>日</span>
      </div>
    </section>

    <nav class="hero-app-panel__nav" aria-label="App 底部导航示意">
      <span class="is-active">
        <BaseIcon name="home" aria-hidden="true" />
        首页
      </span>
      <span>
        <BaseIcon name="heart-pulse" aria-hidden="true" />
        健康
      </span>
      <span>
        <BaseIcon name="map-pin" aria-hidden="true" />
        定位
      </span>
      <span>
        <BaseIcon name="phone" aria-hidden="true" />
        档案
      </span>
      <span>
        <BaseIcon name="users" aria-hidden="true" />
        我的
      </span>
    </nav>
  </article>
</template>

<style scoped lang="scss">
.hero-app-panel {
  display: grid;
  min-height: 100%;
  padding: clamp(18px, 6.2%, 28px) clamp(16px, 5.8%, 24px) clamp(14px, 5%, 22px);
  border: 1px solid rgb(255 253 248 / 30%);
  border-radius: inherit;
  color: var(--color-brand-900);
  background:
    linear-gradient(150deg, rgb(255 253 248 / 66%), rgb(245 239 230 / 42%)),
    rgb(255 253 248 / 34%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 42%),
    inset 0 -1px 0 rgb(47 36 27 / 5%),
    0 24px 64px rgb(47 36 27 / 10%);
  backdrop-filter: blur(22px) saturate(1.05);
  grid-template-rows: auto auto auto auto minmax(0, 1fr) auto;
  gap: clamp(10px, 2.4%, 15px);
}

.hero-app-panel__status,
.hero-app-panel__pet,
.hero-app-panel__score,
.hero-app-panel__nav {
  position: relative;
  z-index: 1;
}

.hero-app-panel__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-coffee-900);
  font-size: 12px;
  font-weight: 850;
}

.hero-app-panel__status i {
  display: block;
  width: 42px;
  height: 10px;
  border-radius: var(--radius-pill);
  background:
    linear-gradient(90deg, var(--color-brand-900) 0 20%, transparent 20% 29%, var(--color-brand-900) 29% 49%, transparent 49% 58%, var(--color-brand-900) 58% 78%, transparent 78% 100%);
  opacity: 0.48;
}

.hero-app-panel__pet {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding-top: 2px;
}

.hero-app-panel__avatar {
  display: block;
  width: 52px;
  height: 52px;
  border: 2px solid rgb(255 253 248 / 60%);
  border-radius: 50%;
  object-fit: cover;
  object-position: 70% 42%;
  box-shadow: 0 10px 24px rgb(47 36 27 / 10%);
}

.hero-app-panel__pet div {
  display: grid;
  gap: 1px;
  min-width: 0;
}

.hero-app-panel__pet strong {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-coffee-900);
  font-size: clamp(17px, 1.45vw, 21px);
  line-height: 1.1;
}

.hero-app-panel__pet strong span {
  color: #3979c8;
  font-size: 0.82em;
}

.hero-app-panel__pet p {
  overflow: hidden;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: clamp(10px, 0.8vw, 12px);
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-app-panel__pet em {
  width: fit-content;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  color: var(--color-success);
  background: rgb(86 130 103 / 14%);
  font-size: 10px;
  font-style: normal;
  font-weight: 850;
}

.hero-app-panel__score {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: 10px;
  align-items: center;
  padding: clamp(14px, 5%, 18px);
  border: 1px solid rgb(255 255 255 / 38%);
  border-radius: 16px;
  background: rgb(255 253 248 / 54%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 48%),
    0 10px 30px rgb(47 36 27 / 6%);
}

.hero-app-panel__score span,
.hero-app-panel__trend h2 {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 850;
}

.hero-app-panel__score strong {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 4px;
  color: var(--color-coffee-900);
  font-size: clamp(38px, 3.5vw, 50px);
  line-height: 0.98;
  letter-spacing: 0;
}

.hero-app-panel__score small {
  color: var(--color-coffee-900);
  font-size: 14px;
  font-weight: 800;
}

.hero-app-panel__score p {
  margin: 4px 0 0;
  color: var(--color-success);
  font-size: 12px;
  font-weight: 850;
}

.hero-app-panel__gauge {
  position: relative;
  display: grid;
  width: clamp(76px, 5.8vw, 90px);
  aspect-ratio: 1;
  place-items: center;
}

.hero-app-panel__gauge::before {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    conic-gradient(
      from -132deg,
      var(--color-brand-900) 0 var(--gauge-angle),
      var(--color-accent-300) var(--gauge-angle) calc(var(--gauge-angle) + 18deg),
      rgb(86 130 103 / 24%) calc(var(--gauge-angle) + 18deg) 270deg,
      transparent 270deg 360deg
    );
  content: '';
  mask: radial-gradient(farthest-side, transparent calc(100% - 9px), #000 calc(100% - 8px));
}

.hero-app-panel__gauge span {
  display: grid;
  width: 48%;
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  color: var(--color-brand-900);
  background: rgb(232 239 231 / 72%);
}

.hero-app-panel__gauge .base-icon {
  font-size: 20px;
}

.hero-app-panel__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}

.hero-app-panel__metrics div {
  min-width: 0;
  padding: 12px;
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: 12px;
  background: rgb(255 253 248 / 48%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 42%),
    0 8px 22px rgb(47 36 27 / 5%);
}

.hero-app-panel__metrics dt {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 850;
}

.hero-app-panel__metrics dt .base-icon {
  color: var(--color-sage-700);
  font-size: 15px;
}

.hero-app-panel__metrics dd {
  margin: 6px 0 0;
  overflow: hidden;
  color: var(--color-brand-900);
  font-size: clamp(13px, 1vw, 15px);
  font-weight: 900;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-app-panel__trend {
  display: grid;
  min-height: 0;
  padding: 12px 12px 10px;
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: 14px;
  background: rgb(255 253 248 / 46%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 42%),
    0 8px 24px rgb(47 36 27 / 5%);
}

.hero-app-panel__trend h2 {
  margin: 0;
}

.hero-app-panel__trend svg {
  display: block;
  width: 100%;
  min-height: 92px;
}

.hero-app-panel__grid {
  fill: none;
  stroke: rgb(47 36 27 / 7%);
  stroke-width: 1;
}

.hero-app-panel__line {
  fill: none;
  stroke: rgb(86 130 103 / 78%);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.hero-app-panel__dot {
  fill: var(--color-surface);
  stroke: rgb(86 130 103 / 86%);
  stroke-width: 2;
}

.hero-app-panel__days {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: 750;
  opacity: 0.72;
  text-align: center;
}

.hero-app-panel__nav {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 3px;
  padding-top: 4px;
}

.hero-app-panel__nav span {
  display: grid;
  justify-items: center;
  gap: 3px;
  min-width: 0;
  color: rgb(47 36 27 / 54%);
  font-size: 10px;
  font-weight: 850;
  line-height: 1.1;
}

.hero-app-panel__nav .base-icon {
  font-size: 18px;
}

.hero-app-panel__nav .is-active {
  color: var(--color-brand-900);
}

@media (max-width: 1180px) {
  .hero-app-panel {
    gap: 10px;
  }

  .hero-app-panel__trend {
    display: none;
  }
}

@media (max-width: 760px) {
  .hero-app-panel {
    padding: 18px;
  }

  .hero-app-panel__score {
    grid-template-columns: minmax(0, 1fr) 76px;
  }

  .hero-app-panel__metrics dd {
    white-space: normal;
  }
}
</style>

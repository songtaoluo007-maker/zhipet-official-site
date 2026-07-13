<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'

const download = useAppDownload()

useSeoMeta({
  title: 'App 下载 | 知宠 ZHIPET',
  description: '通过知宠官网确认的官方入口获取知宠 App，并核对平台与发布信息。',
  ogTitle: 'App 下载 | 知宠 ZHIPET',
  ogDescription: '知宠 App 官方下载入口与安装来源说明。',
  ogType: 'website',
})
</script>

<template>
  <main class="download-page">
    <BaseContainer class="download-hero" width="wide">
      <nav class="breadcrumb" aria-label="面包屑">
        <NuxtLink to="/">首页</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>App 下载</span>
      </nav>

      <div class="download-hero__layout">
        <div>
          <p class="download-hero__eyebrow">知宠 App</p>
          <h1>从官方入口，获取知宠 App</h1>
          <p class="download-hero__description">
            下载地址仅在完成来源确认后开放。请通过本页进入应用商店或官方安装渠道，避免使用来源不明的安装包。
          </p>
        </div>

        <aside class="download-hero__status" aria-label="下载服务状态">
          <BaseIcon name="phone" aria-hidden="true" />
          <div>
            <span>官方获取入口</span>
            <strong>{{ download.hasAvailableChannel ? '选择设备平台' : '尚未开放下载' }}</strong>
          </div>
        </aside>
      </div>
    </BaseContainer>

    <section class="download-channels" aria-labelledby="download-channels-title">
      <BaseContainer width="wide">
        <header class="download-section-heading">
          <div>
            <BaseTag tone="accent">下载渠道</BaseTag>
            <h2 id="download-channels-title">选择你的设备</h2>
          </div>
          <p>只有通过 HTTPS 与官方域名校验的地址才会显示为可用。</p>
        </header>

        <div class="download-channels__list">
          <article v-for="channel in download.channels" :key="channel.id">
            <span class="download-channels__icon" aria-hidden="true">
              <BaseIcon name="phone" />
            </span>
            <div>
              <p>{{ channel.sourceLabel }}</p>
              <h3>{{ channel.label }}</h3>
              <span>{{ channel.description }}</span>
            </div>
            <BaseButton
              v-if="channel.href"
              :href="channel.href"
              external
              variant="secondary"
            >
              前往下载
              <template #iconRight><BaseIcon name="arrow-right" /></template>
            </BaseButton>
            <BaseButton v-else disabled variant="secondary">暂未开放</BaseButton>
          </article>
        </div>

        <p v-if="!download.hasAvailableChannel" class="download-channels__notice" role="status">
          当前没有已确认的公开下载地址。正式入口开放后，本页会直接显示对应平台按钮。
        </p>
      </BaseContainer>
    </section>

    <BaseContainer
      tag="section"
      class="download-integrity"
      width="wide"
      aria-labelledby="download-integrity-title"
    >
      <div>
        <p>来源校验</p>
        <h2 id="download-integrity-title">安装前，先确认发布信息</h2>
      </div>

      <dl>
        <div>
          <dt>下载来源</dt>
          <dd>仅使用本页提供的官方跳转入口</dd>
        </div>
        <div v-if="download.version">
          <dt>公开版本</dt>
          <dd>{{ download.version }}</dd>
        </div>
        <div v-if="download.publishedAt">
          <dt>发布日期</dt>
          <dd>{{ download.publishedAt }}</dd>
        </div>
        <div v-if="download.androidSha256">
          <dt>Android SHA-256</dt>
          <dd class="download-integrity__digest">{{ download.androidSha256 }}</dd>
        </div>
      </dl>

      <BaseButton to="/help" variant="text">
        查看安装与连接帮助
        <template #iconRight><BaseIcon name="arrow-right" /></template>
      </BaseButton>
    </BaseContainer>
  </main>
</template>

<style scoped lang="scss">
.download-page {
  overflow: hidden;
}

.download-hero {
  display: grid;
  min-height: 540px;
  align-content: center;
  padding-block: clamp(96px, 11vw, 144px);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.breadcrumb a {
  color: inherit;
}

.download-hero__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.42fr);
  gap: clamp(48px, 8vw, 112px);
  align-items: end;
}

.download-hero__eyebrow,
.download-integrity > div > p,
.download-channels article p {
  margin-bottom: var(--space-3);
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.download-hero h1 {
  max-width: 760px;
  font-size: clamp(48px, 6.2vw, 78px);
  line-height: 1.08;
  text-wrap: balance;
}

.download-hero__description {
  max-width: 680px;
  margin-top: var(--space-5);
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.8;
}

.download-hero__status {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding-block: var(--space-5);
  border-block: 1px solid var(--color-border);
}

.download-hero__status > .base-icon {
  width: 32px;
  height: 32px;
  color: var(--color-brand-900);
}

.download-hero__status span,
.download-hero__status strong {
  display: block;
}

.download-hero__status span {
  margin-bottom: 4px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.download-hero__status strong {
  color: var(--color-brand-900);
  font-size: 20px;
}

.download-channels {
  padding-block: clamp(96px, 10vw, 128px);
  background: var(--color-surface-muted);
}

.download-section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.55fr);
  gap: var(--space-8);
  align-items: end;
  margin-bottom: var(--space-8);
}

.download-section-heading h2 {
  margin-top: var(--space-4);
  font-size: clamp(34px, 4vw, 48px);
}

.download-section-heading > p {
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.download-channels__list {
  border-top: 1px solid var(--color-border);
}

.download-channels article {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: var(--space-5);
  align-items: center;
  padding-block: var(--space-7);
  border-bottom: 1px solid var(--color-border);
}

.download-channels__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-brand-900);
}

.download-channels__icon .base-icon {
  width: 22px;
  height: 22px;
}

.download-channels article h3 {
  margin-bottom: var(--space-2);
  font-size: 24px;
}

.download-channels article > div > span {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.download-channels__notice {
  margin-top: var(--space-5);
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.download-integrity {
  display: grid;
  grid-template-columns: minmax(240px, 0.7fr) minmax(340px, 1fr) auto;
  gap: var(--space-8);
  align-items: start;
  padding-block: clamp(96px, 11vw, 136px);
}

.download-integrity h2 {
  max-width: 380px;
  font-size: 34px;
}

.download-integrity dl {
  margin: 0;
}

.download-integrity dl > div {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: var(--space-4);
  padding-block: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.download-integrity dt {
  color: var(--color-text-secondary);
}

.download-integrity dd {
  margin: 0;
  color: var(--color-brand-900);
  font-weight: 650;
}

.download-integrity__digest {
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
}

@media (max-width: 820px) {
  .download-hero__layout,
  .download-section-heading,
  .download-integrity {
    grid-template-columns: 1fr;
  }

  .download-integrity > .base-button {
    width: fit-content;
  }
}

@media (max-width: 560px) {
  .download-hero {
    min-height: 520px;
  }

  .download-hero__description {
    font-size: 16px;
  }

  .download-channels article {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .download-channels article > .base-button {
    grid-column: 1 / -1;
    width: 100%;
  }

  .download-integrity dl > div {
    grid-template-columns: 1fr;
  }
}
</style>

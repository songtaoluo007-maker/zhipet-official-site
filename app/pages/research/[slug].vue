<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import type { SeoBreadcrumbItem } from '~/utils/site-seo'

const route = useRoute()
const requestUrl = useRequestURL()
const runtimeConfig = useRuntimeConfig()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const readingProgress = ref(0)

if (!slugParam) {
  throw createError({
    statusCode: 404,
    statusMessage: '研究院内容暂未找到',
    fatal: true,
  })
}

const articlePath = `/research/${slugParam}`
const { data: article } = await useAsyncData(`research-detail-${articlePath}`, () =>
  queryCollection('research').path(articlePath).first(),
)
const { data: relatedArticles } = await useAsyncData(`research-related-${articlePath}`, async () => {
  const entries = await queryCollection('research').order('order', 'ASC').all()

  return entries
    .filter((entry) => entry.path !== articlePath)
    .slice(0, 3)
    .map((entry) => ({
      path: entry.path,
      title: entry.title,
      category: entry.category ?? '内容规划',
    }))
})

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '研究院内容暂未找到',
    fatal: true,
  })
}

const siteOrigin = computed(() =>
  resolveSiteOrigin(runtimeConfig.public.siteUrl, requestUrl.origin),
)
const breadcrumbItems = computed<SeoBreadcrumbItem[]>(() => [
  { name: '首页', path: '/' },
  { name: '健康研究院', path: '/research' },
  { name: article.value?.title ?? '文章详情', path: articlePath },
])
const related = computed(() => relatedArticles.value ?? [])
const articleDescription = computed(
  () => article.value?.description ?? '知宠健康研究院文章草稿，正文与发布日期待项目方确认。',
)

const updateReadingProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0
}

onMounted(() => {
  updateReadingProgress()
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})

useSeoMeta({
  title: () => `${article.value?.title ?? '文章详情'} | 健康研究院 | 知宠 ZHIPET`,
  description: () => articleDescription.value,
  ogTitle: () => `${article.value?.title ?? '文章详情'} | 健康研究院 | 知宠 ZHIPET`,
  ogDescription: () => articleDescription.value,
  ogType: 'article',
})

useHead({
  script: [
    {
      key: 'jsonld-research-page',
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify(
          createWebPageJsonLd({
            name: article.value?.title ?? '文章详情',
            description: articleDescription.value,
            path: articlePath,
            siteOrigin: siteOrigin.value,
          }),
        ),
    },
    {
      key: 'jsonld-research-breadcrumb',
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(createBreadcrumbJsonLd(breadcrumbItems.value, siteOrigin.value)),
    },
  ],
})
</script>

<template>
  <div v-if="article" class="research-detail-page">
    <section class="research-detail-hero" aria-labelledby="research-detail-title">
      <BaseContainer class="research-detail-hero__inner" width="narrow">
        <nav class="breadcrumb" aria-label="面包屑">
          <NuxtLink to="/">首页</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink to="/research">健康研究院</NuxtLink>
          <span aria-hidden="true">/</span>
          <span>{{ article.title }}</span>
        </nav>
        <BaseTag tone="concept">{{ article.status }}</BaseTag>
        <h1 id="research-detail-title">{{ article.title }}</h1>
        <p>{{ article.description }}</p>
      </BaseContainer>
    </section>

    <BaseContainer class="article-visual" tag="section" width="narrow" aria-label="文章概念视觉">
      <BaseImage
        src="/images/concepts/team-lab.svg"
        alt="知宠健康研究院安静阅读场景概念视觉"
        aspect-ratio="16 / 8"
        radius="lg"
        priority
        concept
        label-placement="below"
      />
    </BaseContainer>

    <BaseContainer
      tag="section"
      class="research-detail-section boundary-notice"
      width="narrow"
      aria-labelledby="boundary-title"
    >
      <BaseIcon name="shield-check" aria-hidden="true" />
      <div>
        <h2 id="boundary-title">风险边界提示</h2>
        <p>本文不提供医疗诊断或治疗建议。内容仅供参考，不能替代专业兽医意见。如宠物出现异常，请及时咨询执业兽医。</p>
      </div>
    </BaseContainer>

    <BaseContainer
      tag="section"
      class="research-detail-section article-layout"
      width="wide"
      aria-labelledby="article-body-title"
    >
      <article class="article-body">
        <h2 id="article-body-title" class="sr-only">正文</h2>
        <div class="article-meta" aria-label="文章信息">
          <span>{{ article.category }}</span>
          <span>{{ article.publishedLabel }}</span>
        </div>
        <ContentRenderer :value="article" class="research-prose" />
      </article>

      <aside class="article-sidebar" aria-label="文章侧栏">
        <section class="sidebar-panel">
          <h2>阅读进度</h2>
          <div class="progress-track" aria-hidden="true">
            <span :style="{ width: `${readingProgress}%` }" />
          </div>
          <p>{{ readingProgress }}%</p>
        </section>
        <section class="sidebar-panel">
          <h2>相关阅读</h2>
          <NuxtLink v-for="item in related" :key="item.path" :to="item.path">
            <span>{{ item.category }}</span>
            <strong>{{ item.title }}</strong>
          </NuxtLink>
        </section>
        <section class="sidebar-panel product-card">
          <BaseTag tone="concept">产品参考</BaseTag>
          <h2>知宠智能项圈</h2>
          <p>当前为产品方向展示，真实硬件参数、上市时间和能力范围待项目方确认。</p>
          <BaseButton to="/products" variant="text">
            查看产品
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </section>
      </aside>
    </BaseContainer>

    <BaseContainer
      tag="section"
      class="research-detail-section editorial-boundary"
      width="narrow"
      aria-labelledby="editorial-boundary-title"
    >
      <BaseTag tone="warning">发布边界</BaseTag>
      <h2 id="editorial-boundary-title">正式发布前仍需确认</h2>
      <p>
        标题、发布日期、引用来源、正文事实、图表和配图均需项目方确认后再作为正式研究院内容公开。
      </p>
      <BaseButton to="/research" variant="text">
        返回健康研究院
        <template #iconRight>
          <BaseIcon name="arrow-right" />
        </template>
      </BaseButton>
    </BaseContainer>

    <CTASection
      title="想了解文章背后的产品路径？"
      description="预约演示，确认当前样机能力、App 流程和健康趋势观察边界。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.research-detail-page {
  overflow: hidden;
}

.research-detail-hero {
  padding-block: var(--space-8) var(--space-6);
}

.research-detail-hero__inner {
  display: grid;
  gap: var(--space-4);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 650;
}

.breadcrumb a {
  color: var(--color-text-secondary);
}

.breadcrumb a:hover {
  color: var(--color-accent-600);
}

.research-detail-hero h1 {
  max-width: 860px;
  font-size: 50px;
  line-height: 1.1;
  letter-spacing: 0;
  text-wrap: balance;
}

.research-detail-hero p {
  max-width: 760px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.article-visual {
  padding-bottom: var(--space-7);
}

.research-detail-section {
  @include section-spacing;
}

.boundary-notice {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid rgb(183 121 43 / 24%);
  border-radius: var(--radius-media);
  background: var(--color-accent-100);
}

.boundary-notice .base-icon {
  color: var(--color-accent-600);
  font-size: 24px;
}

.boundary-notice h2 {
  margin-bottom: var(--space-2);
  font-size: 20px;
}

.boundary-notice p,
.article-meta,
.research-prose :deep(p),
.research-prose :deep(li),
.article-sidebar p,
.editorial-boundary p {
  color: var(--color-text-secondary);
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.32fr);
  gap: var(--space-7);
  align-items: start;
}

.article-body {
  min-width: 0;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
  font-weight: 650;
}

.research-prose {
  padding-top: var(--space-7);
  color: var(--color-text);
  font-size: 17px;
  line-height: 1.86;
}

.research-prose :deep(h2) {
  margin: var(--space-7) 0 var(--space-3);
  color: var(--color-brand-900);
  font-size: 28px;
  line-height: 1.25;
  letter-spacing: 0;
}

.research-prose :deep(p) {
  margin: 0 0 var(--space-4);
}

.research-prose :deep(ul) {
  display: grid;
  gap: var(--space-2);
  margin: 0 0 var(--space-5);
  padding-left: 1.25em;
}

.article-sidebar {
  position: sticky;
  top: 104px;
  display: grid;
  gap: var(--space-4);
}

.sidebar-panel {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.sidebar-panel h2 {
  font-size: 18px;
}

.sidebar-panel a {
  display: grid;
  gap: var(--space-1);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  color: var(--color-brand-900);
}

.sidebar-panel a span {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.progress-track {
  overflow: hidden;
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--color-surface-soft);
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-accent-600);
  transition: width var(--motion-duration-fast) var(--motion-ease-out);
}

.editorial-boundary {
  display: grid;
  gap: var(--space-3);
  padding-top: 0;
}

.editorial-boundary h2 {
  font-size: 28px;
}

@media (max-width: 980px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-sidebar {
    position: static;
  }
}

@media (max-width: 760px) {
  .research-detail-hero h1 {
    font-size: 38px;
  }
}

@media (max-width: 560px) {
  .research-detail-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .research-detail-hero h1 {
    font-size: 34px;
  }

  .research-detail-hero p,
  .research-prose {
    font-size: 15px;
  }

  .boundary-notice,
  .sidebar-panel {
    grid-template-columns: 1fr;
    padding: var(--space-4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .progress-track span {
    transition-duration: 0.01ms;
  }
}
</style>

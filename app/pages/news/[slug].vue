<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import type { SeoBreadcrumbItem } from '~/utils/site-seo'

const route = useRoute()
const requestUrl = useRequestURL()
const runtimeConfig = useRuntimeConfig()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

if (!slugParam) {
  throw createError({
    statusCode: 404,
    statusMessage: '资讯内容暂未找到',
    fatal: true,
  })
}

const articlePath = `/news/${slugParam}`
const { data: article } = await useAsyncData(`news-detail-${articlePath}`, () =>
  queryCollection('news').path(articlePath).first(),
)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '资讯内容暂未找到',
    fatal: true,
  })
}

const siteOrigin = computed(() =>
  resolveSiteOrigin(runtimeConfig.public.siteUrl, requestUrl.origin),
)
const breadcrumbItems = computed<SeoBreadcrumbItem[]>(() => [
  { name: '首页', path: '/' },
  { name: '资讯中心', path: '/news' },
  { name: article.value?.title ?? '资讯详情', path: articlePath },
])

useSeoMeta({
  title: () => `${article.value?.title ?? '资讯详情'} | 知宠 ZHIPET`,
  description: () =>
    article.value?.description ??
    '知宠 ZHIPET 资讯内容草稿，正文与发布日期待项目方确认。',
  ogTitle: () => `${article.value?.title ?? '资讯详情'} | 知宠 ZHIPET`,
  ogDescription: () =>
    article.value?.description ??
    '知宠 ZHIPET 资讯内容草稿，正文与发布日期待项目方确认。',
  ogType: 'article',
})

useHead({
  script: [
    {
      key: 'jsonld-news-page',
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify(
          createWebPageJsonLd({
            name: article.value?.title ?? '资讯详情',
            description:
              article.value?.description ??
              '知宠 ZHIPET 资讯内容草稿，正文与发布日期待项目方确认。',
            path: articlePath,
            siteOrigin: siteOrigin.value,
          }),
        ),
    },
    {
      key: 'jsonld-news-breadcrumb',
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(createBreadcrumbJsonLd(breadcrumbItems.value, siteOrigin.value)),
    },
  ],
})
</script>

<template>
  <div v-if="article" class="news-detail-page">
    <section class="news-detail-hero" aria-labelledby="news-detail-title">
      <BaseContainer class="news-detail-hero__inner" width="narrow">
        <nav class="breadcrumb" aria-label="面包屑">
          <NuxtLink to="/">首页</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink to="/news">资讯中心</NuxtLink>
          <span aria-hidden="true">/</span>
          <span>{{ article.title }}</span>
        </nav>
        <BaseTag tone="concept">{{ article.status }}</BaseTag>
        <h1 id="news-detail-title">{{ article.title }}</h1>
        <p>{{ article.description }}</p>
      </BaseContainer>
    </section>

    <BaseContainer
      tag="section"
      class="news-detail-section news-detail-meta"
      width="narrow"
      aria-labelledby="news-meta-title"
    >
      <h2 id="news-meta-title" class="sr-only">资讯状态</h2>
      <dl>
        <div>
          <dt>栏目</dt>
          <dd>{{ article.category }}</dd>
        </div>
        <div>
          <dt>发布日期</dt>
          <dd>{{ article.publishedLabel }}</dd>
        </div>
        <div>
          <dt>公开状态</dt>
          <dd>{{ article.status }}</dd>
        </div>
      </dl>
    </BaseContainer>

    <BaseContainer
      tag="section"
      class="news-detail-section news-detail-body"
      width="narrow"
      role="article"
      aria-labelledby="news-body-title"
    >
      <h2 id="news-body-title" class="sr-only">正文</h2>
      <ContentRenderer :value="article" class="news-prose" />
    </BaseContainer>

    <BaseContainer
      tag="section"
      class="news-detail-section editorial-boundary"
      width="narrow"
      aria-labelledby="editorial-boundary-title"
    >
      <BaseTag tone="warning">发布边界</BaseTag>
      <h2 id="editorial-boundary-title">正式发布前仍需确认</h2>
      <p>
        该页面用于官网内容运营预览。标题、发布日期、发布主体、正文事实、引用来源和配图均需项目方确认后再作为正式资讯公开。
      </p>
      <BaseButton to="/news" variant="text">
        返回资讯中心
        <template #iconRight>
          <BaseIcon name="arrow-right" />
        </template>
      </BaseButton>
    </BaseContainer>

    <CTASection
      title="准备补齐正式资讯？"
      description="确认正文、发布时间和发布主体后，可直接更新 Markdown 文件并同步上线。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.news-detail-page {
  overflow: hidden;
}

.news-detail-hero {
  padding-block: var(--space-8) var(--space-6);
}

.news-detail-hero__inner {
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

.news-detail-hero h1 {
  max-width: 820px;
  font-size: 50px;
  line-height: 1.1;
  letter-spacing: 0;
  text-wrap: balance;
}

.news-detail-hero p {
  max-width: 760px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.news-detail-section {
  @include section-spacing;
}

.news-detail-meta {
  padding-block: var(--space-5);
  border-block: 1px solid var(--color-border);
}

.news-detail-meta dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
  margin: 0;
}

.news-detail-meta div {
  display: grid;
  gap: var(--space-2);
}

.news-detail-meta dt {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.news-detail-meta dd {
  margin: 0;
  color: var(--color-brand-900);
  font-size: 18px;
  font-weight: 750;
}

.news-detail-body {
  padding-top: var(--space-9);
}

.news-prose {
  color: var(--color-text);
  font-size: 17px;
  line-height: 1.86;
}

.news-prose :deep(h2) {
  margin: var(--space-7) 0 var(--space-3);
  color: var(--color-brand-900);
  font-size: 28px;
  line-height: 1.25;
  letter-spacing: 0;
}

.news-prose :deep(p) {
  margin: 0 0 var(--space-4);
  color: var(--color-text-secondary);
}

.news-prose :deep(ul) {
  display: grid;
  gap: var(--space-2);
  margin: 0 0 var(--space-5);
  padding-left: 1.25em;
  color: var(--color-text-secondary);
}

.editorial-boundary {
  display: grid;
  gap: var(--space-3);
  padding-top: 0;
}

.editorial-boundary h2 {
  font-size: 28px;
  line-height: 1.25;
}

.editorial-boundary p {
  max-width: 760px;
  color: var(--color-text-secondary);
  line-height: 1.75;
}

@media (max-width: 760px) {
  .news-detail-hero h1 {
    font-size: 38px;
  }

  .news-detail-meta dl {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .news-detail-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .news-detail-hero h1 {
    font-size: 34px;
  }

  .news-detail-hero p,
  .news-prose {
    font-size: 15px;
  }
}
</style>

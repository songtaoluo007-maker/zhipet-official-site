<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import EditorialHero from '~/components/common/EditorialHero.vue'
import { resolveResearchVisual } from '~/data/research-visuals'
import type { SeoBreadcrumbItem } from '~/utils/site-seo'

const route = useRoute()
const requestUrl = useRequestURL()
const runtimeConfig = useRuntimeConfig()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const readingProgress = ref(0)

if (!slugParam) {
  throw createError({ statusCode: 404, message: '研究院内容暂未找到', fatal: true })
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
      category: entry.category ?? '专题内容',
    }))
})

if (!article.value) {
  throw createError({ statusCode: 404, message: '研究院内容暂未找到', fatal: true })
}

const visual = resolveResearchVisual(articlePath)
const siteOrigin = computed(() => resolveSiteOrigin(runtimeConfig.public.siteUrl, requestUrl.origin))
const breadcrumbItems = computed<SeoBreadcrumbItem[]>(() => [
  { name: '首页', path: '/' },
  { name: '健康研究院', path: '/research' },
  { name: article.value?.title ?? '文章详情', path: articlePath },
])
const related = computed(() => relatedArticles.value ?? [])
const articleDescription = computed(
  () => article.value?.description ?? '围绕宠物健康观察与科学照护方法展开。',
)

const updateReadingProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = scrollable > 0
    ? Math.min(100, Math.round((window.scrollY / scrollable) * 100))
    : 0
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
      innerHTML: () => JSON.stringify(createWebPageJsonLd({
        name: article.value?.title ?? '文章详情',
        description: articleDescription.value,
        path: articlePath,
        siteOrigin: siteOrigin.value,
      })),
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
  <main v-if="article" class="research-detail-page">
    <EditorialHero
      :eyebrow="article.category ?? '专题内容'"
      :title="article.title"
      :description="article.description ?? '围绕宠物健康观察与科学照护方法展开。'"
      :image="visual.src"
      :image-alt="visual.alt"
      :object-position="visual.objectPosition"
      :crumbs="[
        { label: '首页', to: '/' },
        { label: '健康研究院', to: '/research' },
        { label: article.title },
      ]"
      primary-label="开始阅读"
      primary-to="#article-body"
      secondary-label="返回研究院"
      secondary-to="/research"
      priority
    />

    <section class="reading-meter" aria-label="阅读进度">
      <span :style="{ width: `${readingProgress}%` }" />
    </section>

    <BaseContainer
      id="article-body"
      tag="section"
      class="article-layout"
      width="wide"
      aria-labelledby="article-body-title"
    >
      <article class="article-body">
        <h2 id="article-body-title" class="sr-only">正文</h2>
        <div class="article-meta" aria-label="文章信息">
          <span>{{ article.category }}</span>
          <span>{{ article.publishedLabel }}</span>
          <span>阅读进度 {{ readingProgress }}%</span>
        </div>
        <ContentRenderer :value="article" class="research-prose" />
        <section
          v-if="article.sources?.length"
          class="article-sources"
          aria-labelledby="article-sources-title"
        >
          <header>
            <p>可核验信息</p>
            <h2 id="article-sources-title">参考来源</h2>
            <span>用于支撑背景论述，不代表合作、产品验证或诊疗结论。</span>
          </header>
          <ol>
            <li v-for="source in article.sources" :key="source.url">
              <a :href="source.url" target="_blank" rel="noopener noreferrer">
                <span>{{ source.publication }} · {{ source.year }}</span>
                <strong>{{ source.title }}</strong>
                <small v-if="source.authors">{{ source.authors }}</small>
                <p v-if="source.note">{{ source.note }}</p>
                <BaseIcon name="arrow-right" aria-hidden="true" />
              </a>
            </li>
          </ol>
        </section>
      </article>

      <aside class="article-rail" aria-label="相关阅读">
        <p class="article-rail__eyebrow">继续阅读</p>
        <NuxtLink v-for="item in related" :key="item.path" :to="item.path">
          <span>{{ item.category }}</span>
          <strong>{{ item.title }}</strong>
          <BaseIcon name="arrow-right" aria-hidden="true" />
        </NuxtLink>
      </aside>
    </BaseContainer>

    <section class="reading-boundary" aria-labelledby="reading-boundary-title">
      <BaseContainer class="reading-boundary__inner" width="wide">
        <BaseIcon name="shield-check" aria-hidden="true" />
        <div>
          <p class="reading-boundary__eyebrow">阅读边界</p>
          <h2 id="reading-boundary-title">健康观察不能替代专业诊疗</h2>
        </div>
        <p>
          文中内容用于帮助理解日常变化与照护线索，不提供医疗诊断或治疗建议。宠物出现持续或明显异常时，请及时咨询执业兽医。
        </p>
      </BaseContainer>
    </section>

    <BaseContainer tag="section" class="article-end" width="wide">
      <div>
        <p>知宠研究院</p>
        <h2>把观察变成更有依据的照护</h2>
      </div>
      <div class="article-end__actions">
        <BaseButton to="/research" variant="secondary">返回研究院</BaseButton>
        <BaseButton to="/help#feedback">
          提交意见反馈
          <template #iconRight><BaseIcon name="arrow-right" /></template>
        </BaseButton>
      </div>
    </BaseContainer>
  </main>
</template>

<style scoped lang="scss">
.research-detail-page {
  overflow: hidden;
}

.reading-meter {
  position: sticky;
  z-index: 12;
  top: var(--header-height, 80px);
  height: 3px;
  background: rgb(16 73 58 / 10%);
}

.reading-meter span {
  display: block;
  height: 100%;
  background: var(--color-accent-600);
  transition: width var(--motion-duration-fast) var(--motion-ease-out);
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 780px) minmax(220px, 1fr);
  gap: clamp(48px, 8vw, 112px);
  align-items: start;
  padding-block: clamp(96px, 11vw, 144px);
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
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.research-prose {
  padding-top: var(--space-7);
  color: var(--color-text);
  font-size: 18px;
  line-height: 1.9;
}

.research-prose :deep(h2) {
  margin: var(--space-8) 0 var(--space-3);
  color: var(--color-brand-900);
  font-size: 32px;
  line-height: 1.24;
  letter-spacing: 0;
}

.research-prose :deep(p),
.research-prose :deep(li) {
  color: var(--color-text-secondary);
}

.research-prose :deep(p) {
  margin: 0 0 var(--space-4);
}

.research-prose :deep(ul) {
  display: grid;
  gap: var(--space-2);
  margin: 0 0 var(--space-5);
  padding-left: 1.2em;
}

.article-sources {
  margin-top: clamp(72px, 8vw, 104px);
  border-top: 1px solid var(--color-border-strong);
}

.article-sources header {
  display: grid;
  gap: var(--space-2);
  padding-block: var(--space-6);
}

.article-sources header > p {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.article-sources h2 {
  color: var(--color-brand-900);
  font-size: 30px;
}

.article-sources header > span {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.article-sources ol {
  padding: 0;
  margin: 0;
  border-bottom: 1px solid var(--color-border-strong);
  list-style: none;
}

.article-sources li {
  border-top: 1px solid var(--color-border);
}

.article-sources a {
  position: relative;
  display: grid;
  gap: var(--space-2);
  padding: var(--space-5) 44px var(--space-5) 0;
  color: var(--color-brand-900);
}

.article-sources a > span,
.article-sources a > small {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.article-sources a > strong {
  line-height: 1.55;
}

.article-sources a > p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.65;
}

.article-sources a > .base-icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.article-rail {
  position: sticky;
  top: 120px;
  display: grid;
  border-top: 1px solid var(--color-border-strong);
}

.article-rail__eyebrow {
  padding-block: var(--space-4);
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.article-rail a {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-1) var(--space-3);
  padding-block: var(--space-4);
  border-top: 1px solid var(--color-border);
  color: var(--color-brand-900);
}

.article-rail a span {
  grid-column: 1 / -1;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.article-rail a strong {
  line-height: 1.5;
}

.article-rail a .base-icon {
  align-self: center;
}

.reading-boundary {
  background: var(--color-brand-900);
  color: #fff;
}

.reading-boundary__inner {
  display: grid;
  grid-template-columns: auto minmax(220px, 0.7fr) minmax(320px, 1fr);
  gap: var(--space-5);
  align-items: center;
  padding-block: clamp(64px, 7vw, 88px);
}

.reading-boundary__inner > .base-icon {
  color: var(--color-accent-300);
  font-size: 34px;
}

.reading-boundary__eyebrow {
  margin-bottom: var(--space-2);
  color: var(--color-accent-300);
  font-size: 13px;
  font-weight: 800;
}

.reading-boundary h2 {
  color: #fff;
  font-size: 28px;
}

.reading-boundary__inner > p {
  color: rgb(255 255 255 / 72%);
  line-height: 1.8;
}

.article-end {
  display: flex;
  gap: var(--space-6);
  align-items: end;
  justify-content: space-between;
  padding-block: clamp(96px, 10vw, 128px);
}

.article-end p {
  margin-bottom: var(--space-2);
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.article-end h2 {
  max-width: 620px;
  font-size: 38px;
}

.article-end__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-rail {
    position: static;
  }

  .reading-boundary__inner {
    grid-template-columns: auto 1fr;
  }

  .reading-boundary__inner > p {
    grid-column: 2;
  }
}

@media (max-width: 640px) {
  .article-layout {
    padding-block: 72px;
  }

  .research-prose {
    font-size: 16px;
  }

  .research-prose :deep(h2) {
    font-size: 26px;
  }

  .reading-boundary__inner {
    grid-template-columns: 1fr;
  }

  .reading-boundary__inner > p {
    grid-column: auto;
  }

  .article-end {
    display: grid;
    align-items: start;
  }

  .article-end h2 {
    font-size: 30px;
  }

  .article-end__actions,
  .article-end__actions :deep(.base-button) {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reading-meter span {
    transition-duration: 0.01ms;
  }
}
</style>

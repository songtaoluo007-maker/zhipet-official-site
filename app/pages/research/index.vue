<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SceneFrame from '~/components/common/SceneFrame.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'

const { register } = useScrollReveal()

interface ResearchArticleCard {
  path: string
  title: string
  description: string
  category: string
  publishedLabel: string
  status: string
  order: number
  tags: string[]
}

const selectedCategory = ref('全部')
const subscribeEmail = ref('')
const subscribeTouched = ref(false)

const toResearchArticleCard = (entry: {
  path: string
  title: string
  description?: string
  category?: string
  publishedLabel?: string
  status?: string
  order?: number
  tags?: string[]
}): ResearchArticleCard => ({
  path: entry.path,
  title: entry.title,
  description: entry.description ?? '正文待项目方确认。',
  category: entry.category ?? '内容规划',
  publishedLabel: entry.publishedLabel ?? '发布日期待项目方确认',
  status: entry.status ?? '正文待项目方确认',
  order: entry.order ?? 999,
  tags: entry.tags ?? [],
})

const { data: researchArticles } = await useAsyncData('research-list', async () => {
  const entries = await queryCollection('research').order('order', 'ASC').all()

  return entries.map(toResearchArticleCard)
})

const articleCards = computed(() => researchArticles.value ?? [])
const featuredArticle = computed(() => articleCards.value[0])
const categories = computed(() => [
  '全部',
  ...Array.from(new Set(articleCards.value.map((article) => article.category))),
])
const filteredArticles = computed(() => {
  if (selectedCategory.value === '全部') {
    return articleCards.value
  }

  return articleCards.value.filter((article) => article.category === selectedCategory.value)
})
const allTags = computed(() =>
  Array.from(new Set(articleCards.value.flatMap((article) => article.tags))).slice(0, 8),
)
const subscribeMessage = computed(() => {
  if (!subscribeTouched.value) {
    return '订阅入口为前端占位，正式通知接口待项目方确认。'
  }

  if (!subscribeEmail.value.trim()) {
    return '请输入邮箱后再记录订阅意向。'
  }

  return '订阅意向已在前端记录，正式接口接入后再完成通知。'
})

const selectCategory = (category: string) => {
  selectedCategory.value = category
}

const handleSubscribe = () => {
  subscribeTouched.value = true
}

useSeoMeta({
  title: '健康研究院 | 知宠 ZHIPET',
  description:
    '知宠健康研究院用于发布宠物健康趋势、AI 状态解释、产品思考与养护指南。正式发布时间和资料来源待项目方确认。',
  ogTitle: '健康研究院 | 知宠 ZHIPET',
  ogDescription: '展示知宠健康研究院的内容方向、研究边界和文章草稿。',
  ogType: 'website',
})
</script>

<template>
  <div class="research-page">
    <section class="research-hero" aria-labelledby="research-title">
      <BaseContainer class="research-hero__inner" width="wide">
        <div class="research-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>健康研究院</span>
          </nav>
          <BaseTag tone="concept">内容资料待确认</BaseTag>
          <h1 id="research-title">健康研究院</h1>
          <p>
            用连续观察、状态解释和安全边界，帮助更多家庭理解宠物健康管理。研究院内容不提供医疗诊断或治疗建议。
          </p>
          <BaseButton to="#research-articles" size="lg">
            阅读文章
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </div>
        <SceneFrame
          class="research-hero__visual"
          src="/images/generated/pages/zhipet-research-observation-scene.png"
          alt="犬只户外健康观察研究院概念图"
          aspect-ratio="16 / 10"
          object-position="center"
          tone="dark"
        >
          <div class="research-hero__card">
            <span>研究边界</span>
            <strong>观察趋势，不替代诊疗</strong>
            <p>异常情况请及时咨询执业兽医。</p>
          </div>
        </SceneFrame>
      </BaseContainer>
    </section>

    <BaseContainer
      v-if="featuredArticle"
      :ref="register"
      tag="section"
      class="research-section featured-section"
      width="wide"
      aria-labelledby="featured-title"
    >
      <SectionHeading
        id="featured-title"
        title="精选文章"
        description="先建立健康观察的基础认知，再理解产品为什么强调长期记录。"
      />
      <article class="featured-card">
        <SceneFrame
          src="/images/generated/pages/zhipet-research-observation-scene.png"
          alt="犬猫休息状态与健康观察文章概念图"
          aspect-ratio="4 / 3"
          object-position="center"
        />
        <div class="featured-card__copy">
          <BaseTag>{{ featuredArticle.category }}</BaseTag>
          <h2>{{ featuredArticle.title }}</h2>
          <p>{{ featuredArticle.description }}</p>
          <div class="tag-list" aria-label="文章标签">
            <span v-for="tag in featuredArticle.tags" :key="tag">{{ tag }}</span>
          </div>
          <BaseButton :to="featuredArticle.path" variant="text">
            查看文章
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </div>
      </article>
    </BaseContainer>

    <section
      id="research-articles"
      :ref="register"
      class="research-section article-section"
      aria-labelledby="article-title"
    >
      <BaseContainer width="wide">
        <div class="article-layout">
          <div class="article-layout__main">
            <SectionHeading
              id="article-title"
              title="研究与养护内容"
              description="分类筛选仅在前端完成，正式文章发布日期、作者和引用来源待确认。"
              align="left"
            />
            <div class="category-tabs" role="tablist" aria-label="研究院分类">
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                role="tab"
                :aria-selected="selectedCategory === category"
                :class="{ 'is-active': selectedCategory === category }"
                @click="selectCategory(category)"
              >
                {{ category }}
              </button>
            </div>
            <div class="article-grid">
              <article v-for="article in filteredArticles" :key="article.path" class="article-card">
                <div class="article-card__meta">
                  <BaseTag>{{ article.category }}</BaseTag>
                  <span>{{ article.publishedLabel }}</span>
                </div>
                <h2>{{ article.title }}</h2>
                <p>{{ article.description }}</p>
                <div class="tag-list" aria-label="文章标签">
                  <span v-for="tag in article.tags" :key="tag">{{ tag }}</span>
                </div>
                <div class="article-card__footer">
                  <BaseTag tone="concept">{{ article.status }}</BaseTag>
                  <BaseButton :to="article.path" variant="text">
                    阅读
                    <template #iconRight>
                      <BaseIcon name="arrow-right" />
                    </template>
                  </BaseButton>
                </div>
              </article>
            </div>
          </div>

          <aside class="research-sidebar" aria-label="研究院侧栏">
            <section class="sidebar-panel">
              <h2>研究标签</h2>
              <div class="tag-cloud">
                <button v-for="tag in allTags" :key="tag" type="button">{{ tag }}</button>
              </div>
            </section>
            <section class="sidebar-panel">
              <h2>重要提示</h2>
              <p>研究院内容仅供参考，不构成医疗诊断、治疗建议或替代兽医判断。</p>
            </section>
            <form class="sidebar-panel subscribe-card" aria-label="研究院订阅" @submit.prevent="handleSubscribe">
              <h2>订阅更新</h2>
              <BaseInput
                v-model="subscribeEmail"
                type="email"
                name="email"
                placeholder="邮箱待项目方确认接口"
                autocomplete="email"
              />
              <p>{{ subscribeMessage }}</p>
              <BaseButton type="submit" variant="secondary">记录订阅意向</BaseButton>
            </form>
          </aside>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="想把研究内容转化为产品演示？"
      description="预约演示，了解知宠如何把安全防走失、健康趋势和状态解释放进同一套官网产品叙事。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.research-page {
  overflow: hidden;
}

.research-hero {
  position: relative;
  isolation: isolate;
  padding-block: var(--space-8) var(--space-7);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 58%), rgb(251 248 242 / 0) 78%),
    radial-gradient(circle at 72% 20%, rgb(86 130 103 / 14%), transparent 32%);
}

.research-hero::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, var(--color-bg) 0%, rgb(251 248 242 / 74%) 42%, rgb(251 248 242 / 26%) 100%),
    url('/images/generated/pages/zhipet-research-observation-scene.png') center / cover no-repeat;
  content: '';
  opacity: 0.16;
}

.research-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.84fr) minmax(360px, 0.8fr);
  gap: var(--space-8);
  align-items: center;
}

.research-hero__copy {
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

.research-hero h1 {
  font-size: 72px;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.research-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.research-hero__visual {
  min-height: 430px;
}

.research-hero__card {
  position: absolute;
  right: var(--space-7);
  bottom: var(--space-8);
  display: grid;
  max-width: 280px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 90%);
  backdrop-filter: blur(10px);
}

.research-hero__card span,
.article-card__meta,
.sidebar-panel h2 {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.research-hero__card strong {
  color: var(--color-brand-900);
  font-size: 18px;
}

.research-hero__card p {
  font-size: 13px;
}

.research-section {
  @include section-spacing;
}

.featured-section {
  padding-top: var(--space-6);
}

.featured-card {
  display: grid;
  grid-template-columns: minmax(320px, 0.78fr) minmax(0, 0.9fr);
  gap: var(--space-6);
  align-items: center;
  padding: var(--space-6);
  border: 1px solid rgb(255 255 255 / 68%);
  border-radius: 22px;
  background: rgb(255 255 255 / 74%);
  box-shadow: 0 18px 46px rgb(47 36 27 / 6%);
}

.featured-card__copy,
.article-card,
.research-sidebar,
.sidebar-panel {
  display: grid;
  gap: var(--space-4);
}

.featured-card h2 {
  font-size: 32px;
  line-height: 1.2;
}

.featured-card p,
.article-card p,
.sidebar-panel p {
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.article-section {
  background: var(--color-surface-soft);
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.32fr);
  gap: var(--space-7);
  align-items: start;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.category-tabs button,
.tag-cloud button {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface);
  font-size: 14px;
  font-weight: 650;
}

.category-tabs button.is-active,
.category-tabs button:hover,
.tag-cloud button:hover {
  border-color: rgb(183 121 43 / 42%);
  background: var(--color-accent-100);
}

.category-tabs button:focus-visible,
.tag-cloud button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.article-card,
.sidebar-panel {
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.article-card h2 {
  font-size: 22px;
  line-height: 1.28;
}

.article-card__meta,
.article-card__footer,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

.article-card__meta,
.article-card__footer {
  justify-content: space-between;
}

.tag-list span {
  padding: 6px 9px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 650;
}

.research-sidebar {
  position: sticky;
  top: 104px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.subscribe-card :deep(.base-button) {
  width: 100%;
}

@media (max-width: 1050px) {
  .research-hero__inner,
  .featured-card,
  .article-layout {
    grid-template-columns: 1fr;
  }

  .research-sidebar {
    position: static;
  }
}

@media (max-width: 760px) {
  .article-grid {
    grid-template-columns: 1fr;
  }

  .research-hero h1 {
    font-size: 42px;
  }
}

@media (max-width: 560px) {
  .research-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .research-hero h1 {
    font-size: 36px;
  }

  .research-hero p {
    font-size: 15px;
  }

  .featured-card,
  .article-card,
  .sidebar-panel {
    padding: var(--space-4);
  }

  .research-hero__card {
    right: var(--space-4);
    bottom: var(--space-4);
    width: min(280px, calc(100% - 32px));
    max-width: none;
  }
}
</style>

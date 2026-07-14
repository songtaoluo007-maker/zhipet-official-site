<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import CTASection from '~/components/common/CTASection.vue'
import EditorialHero from '~/components/common/EditorialHero.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { usePublicAssetUrl } from '~/composables/usePublicAssetUrl'
import { resolveResearchVisual } from '~/data/research-visuals'

interface ResearchArticleCard {
  path: string
  title: string
  description: string
  category: string
  order: number
  tags: string[]
  image: string
}

const { register } = useScrollReveal()
const publicAssetUrl = usePublicAssetUrl()
const selectedCategory = ref('全部')

const toResearchArticleCard = (entry: {
  path: string
  title: string
  description?: string
  category?: string
  order?: number
  tags?: string[]
}): ResearchArticleCard => ({
  path: entry.path,
  title: entry.title,
  description: entry.description ?? '围绕宠物健康观察与照护方法展开。',
  category: entry.category ?? '健康观察',
  order: entry.order ?? 999,
  tags: entry.tags ?? [],
  image: resolveResearchVisual(entry.path).src,
})

const { data: researchArticles } = await useAsyncData('research-list', async () => {
  const entries = await queryCollection('research').order('order', 'ASC').all()
  return entries.map(toResearchArticleCard)
})

const articleCards = computed(() => researchArticles.value ?? [])
const categories = computed(() => [
  '全部',
  ...Array.from(new Set(articleCards.value.map((article) => article.category))),
])
const filteredArticles = computed(() =>
  selectedCategory.value === '全部'
    ? articleCards.value
    : articleCards.value.filter((article) => article.category === selectedCategory.value),
)

useSeoMeta({
  title: '健康研究院 | 知宠 ZHIPET',
  description: '阅读知宠团队关于宠物健康趋势、连续观察、AI 状态解释与养护方法的专题内容。',
  ogTitle: '健康研究院 | 知宠 ZHIPET',
  ogDescription: '用科学、克制的方式理解宠物日常变化。',
  ogType: 'website',
})
</script>

<template>
  <main class="research-page">
    <EditorialHero
      eyebrow="健康研究院"
      title="宠物不会说话，变化会留下线索"
      description="我们从日常活动、休息节律、行为变化与照护记录出发，讨论如何更科学地理解宠物，同时始终保留专业判断边界。"
      image="/images/generated/pages/zhipet-research-observation-scene.webp"
      image-alt="犬猫与健康观察记录同框的真实研究场景"
      object-position="center"
      :crumbs="[{ label: '首页', to: '/' }, { label: '健康研究院' }]"
      primary-label="阅读文章"
      primary-to="#research-articles"
      secondary-label="了解使用边界"
      secondary-to="/research/ai-state-boundary"
      priority
    />

    <BaseContainer
      id="research-articles"
      :ref="register"
      tag="section"
      class="research-index"
      width="wide"
      aria-labelledby="research-index-title"
    >
      <div class="research-index__head">
        <SectionHeading
          id="research-index-title"
          title="精选文章"
          description="按主题浏览健康观察、产品方法和 AI 使用边界。"
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
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div class="article-feed">
        <NuxtLink
          v-for="(article, index) in filteredArticles"
          :key="article.path"
          :to="article.path"
          class="article-row"
        >
          <div class="article-row__media">
            <img
              :src="publicAssetUrl(article.image)"
              :alt="`${article.title} 文章配图`"
              loading="lazy"
            >
            <span>AI 概念图，仅供参考</span>
          </div>
          <div class="article-row__copy">
            <span>{{ String(index + 1).padStart(2, '0') }} / {{ article.category }}</span>
            <h2>{{ article.title }}</h2>
            <p>{{ article.description }}</p>
            <div class="article-row__meta">
              <ul aria-label="文章标签">
                <li v-for="tag in article.tags" :key="tag">{{ tag }}</li>
              </ul>
              <strong>
                阅读全文
                <BaseIcon name="arrow-right" />
              </strong>
            </div>
          </div>
        </NuxtLink>
      </div>
    </BaseContainer>

    <section :ref="register" class="research-principles" aria-labelledby="principles-title">
      <BaseContainer width="wide">
        <SectionHeading
          id="principles-title"
          title="我们的内容原则"
          description="每一篇内容都应让读者知道信息从哪里来、能说明什么，以及不能替代什么。"
          align="left"
        />
        <div class="principle-line">
          <article>
            <span>01</span>
            <h2>关注长期趋势</h2>
            <p>用连续记录理解变化，避免从单次信号直接下结论。</p>
          </article>
          <article>
            <span>02</span>
            <h2>保留不确定性</h2>
            <p>使用“可能、趋势、风险提示”等表达，说明其他解释。</p>
          </article>
          <article>
            <span>03</span>
            <h2>尊重专业判断</h2>
            <p>健康内容仅用于辅助观察，不替代执业兽医诊疗。</p>
          </article>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="对研究内容有意见或问题？"
      description="通过反馈告诉知宠团队您关心的主题，也可以使用公开邮箱联系我们。"
      primary-label="意见问题反馈"
      primary-to="/help#feedback"
      secondary-label="邮件联系我们"
      secondary-to="/contact"
    />
  </main>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.research-page {
  overflow: hidden;
}

.research-index {
  @include section-spacing;
}

.research-index__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-5);
  align-items: end;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: flex-end;
}

.category-tabs button {
  min-height: 38px;
  padding: 0 14px;
  border: 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.category-tabs button:hover,
.category-tabs button.is-active {
  color: var(--color-brand-900);
  border-color: var(--color-accent-600);
}

.category-tabs button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
}

.article-feed {
  margin-top: var(--space-7);
  border-top: 1px solid var(--color-border);
}

.article-row {
  display: grid;
  grid-template-columns: minmax(320px, 0.7fr) minmax(0, 1fr);
  min-height: 300px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-brand-900);
}

.article-row__media {
  position: relative;
  min-height: 300px;
  overflow: hidden;
}

.article-row__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms var(--motion-ease-out);
}

.article-row:hover .article-row__media img {
  transform: scale(1.02);
}

.article-row__media > span {
  position: absolute;
  right: var(--space-3);
  bottom: var(--space-3);
  color: rgb(255 255 255 / 72%);
  font-size: 11px;
  text-shadow: 0 1px 4px rgb(0 0 0 / 44%);
}

.article-row__copy {
  display: grid;
  align-content: center;
  gap: var(--space-3);
  padding: clamp(28px, 5vw, 64px);
}

.article-row__copy > span {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.article-row h2 {
  max-width: 640px;
  font-size: 30px;
  line-height: 1.22;
}

.article-row p {
  max-width: 680px;
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.article-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.article-row ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: 0;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
  list-style: none;
}

.article-row strong {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  font-size: 13px;
}

.research-principles {
  @include section-spacing;

  background: #eef2ec;
}

.principle-line {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: var(--space-7);
  border-block: 1px solid rgb(33 72 55 / 18%);
}

.principle-line article {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border-left: 1px solid rgb(33 72 55 / 18%);
}

.principle-line article:first-child {
  border-left: 0;
}

.principle-line span {
  color: var(--color-sage-700);
  font-size: 13px;
  font-weight: 850;
}

.principle-line h2 {
  font-size: 20px;
}

.principle-line p {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

@media (max-width: 860px) {
  .research-index__head,
  .article-row {
    grid-template-columns: 1fr;
  }

  .category-tabs {
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .article-row__media {
    min-height: 0;
    aspect-ratio: 4 / 3;
  }

  .article-row__copy {
    padding: var(--space-5) var(--space-3) var(--space-7);
  }

  .article-row h2 {
    font-size: 25px;
  }

  .principle-line {
    grid-template-columns: 1fr;
  }

  .principle-line article {
    border-top: 1px solid rgb(33 72 55 / 18%);
    border-left: 0;
  }

  .principle-line article:first-child {
    border-top: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .article-row__media img {
    transition: none;
  }
}
</style>

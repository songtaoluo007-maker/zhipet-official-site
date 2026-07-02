<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { newsItems } from '~/data/corporate'

const { register } = useScrollReveal()

const contentPlans = [
  {
    title: '产品动态',
    description: '用于发布智能挂件、知宠 App 和健康管理平台的真实进展。',
  },
  {
    title: '场景研究',
    description: '用于整理家庭养宠、宠物医院与门店服务中的真实观察。',
  },
  {
    title: '品牌公告',
    description: '用于发布主体信息、合作信息、资质资料和官网内容更新。',
  },
]

useSeoMeta({
  title: '资讯中心 | 知宠 ZHIPET',
  description:
    '知宠 ZHIPET 资讯中心当前为内容规划阶段。文章标题和发布日期待项目方确认，不伪造媒体报道或公司新闻。',
  ogTitle: '资讯中心 | 知宠 ZHIPET',
  ogDescription: '展示知宠官网资讯内容规划和待确认文章状态。',
  ogType: 'website',
})
</script>

<template>
  <div class="news-page">
    <section class="news-hero" aria-labelledby="news-title">
      <BaseContainer class="news-hero__inner" width="wide">
        <div class="news-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>资讯中心</span>
          </nav>
          <BaseTag tone="concept">内容规划阶段</BaseTag>
          <h1 id="news-title">资讯中心</h1>
          <p>
            知宠资讯中心用于承载产品动态、场景研究和品牌公告。当前不伪造新闻日期、媒体报道或发布会信息，所有正式内容待项目方确认。
          </p>
          <BaseButton to="/contact" variant="secondary" size="lg">
            提供新闻资料
            <template #iconRight>
              <BaseIcon name="arrow-right" />
            </template>
          </BaseButton>
        </div>
        <div class="news-hero__visual">
          <BaseImage
            src="/images/concepts/app-platform.svg"
            alt="知宠资讯与产品内容规划概念视觉"
            aspect-ratio="16 / 10"
            radius="lg"
            priority
            concept
          />
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="news-section"
      width="wide"
      aria-labelledby="plan-title"
    >
      <SectionHeading
        id="plan-title"
        title="当前内容规划"
        description="先确定资讯栏目结构，正式文章将在标题、发布时间和发布主体确认后上线。"
      />
      <div class="plan-grid">
        <article v-for="item in contentPlans" :key="item.title" class="plan-card">
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="news-section article-section"
      aria-labelledby="article-title"
    >
      <BaseContainer width="wide">
        <SectionHeading
          id="article-title"
          title="待发布内容"
          description="以下为文章方向占位，发布日期、作者和正式正文待项目方确认。"
        />
        <div class="article-list">
          <article v-for="item in newsItems" :key="item.id" class="article-card">
            <div class="article-card__meta">
              <BaseTag>{{ item.category }}</BaseTag>
              <span>{{ item.date }}</span>
            </div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.summary }}</p>
            <BaseButton disabled variant="text">正文待项目方确认</BaseButton>
          </article>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="需要整理官网新闻与公告？"
      description="确认标题、发布日期、发布主体和正文后，可将当前占位内容替换为正式资讯。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.news-page {
  overflow: hidden;
}

.news-hero {
  padding-block: var(--space-8) var(--space-7);
}

.news-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.82fr);
  gap: var(--space-8);
  align-items: center;
}

.news-hero__copy {
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

.news-hero h1 {
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.news-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
}

.news-hero__visual {
  position: relative;
}

.news-hero__visual::before {
  position: absolute;
  inset: -18px 24px 24px -18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

.news-section {
  @include section-spacing;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.plan-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.plan-card h2,
.article-card h2 {
  font-size: 22px;
}

.plan-card p,
.article-card p {
  color: var(--color-text-secondary);
}

.article-section {
  background: var(--color-surface-soft);
}

.article-list {
  display: grid;
  gap: var(--space-4);
}

.article-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.article-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 650;
}

@media (max-width: 1000px) {
  .news-hero__inner {
    grid-template-columns: 1fr;
  }

  .news-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 760px) {
  .plan-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .news-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .news-hero h1 {
    font-size: 36px;
  }

  .news-hero p {
    font-size: 15px;
  }

  .news-hero__visual {
    width: min(100%, 300px);
    margin-inline: auto;
  }

  .news-hero__visual::before {
    inset: -12px 16px 16px -12px;
  }
}
</style>

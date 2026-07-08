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
import { faqItems, helpCategories } from '~/data/v2'

const { register } = useScrollReveal()

const searchQuery = ref('')
const selectedCategory = ref('全部')
const openFaqId = ref<string | null>(null)
const feedbackMessage = ref('客服入口和反馈接口待项目方确认。')

const categoryLabels = computed(() => ['全部', ...helpCategories.map((category) => category.title)])
const hotSearches = ['设备连接', '定位提醒', '健康数据', '隐私保护']
const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())
const filteredFaqs = computed(() =>
  faqItems.filter((item) => {
    const matchesCategory = selectedCategory.value === '全部' || item.category === selectedCategory.value
    const matchesSearch =
      !normalizedSearch.value ||
      item.question.toLowerCase().includes(normalizedSearch.value) ||
      item.answer.toLowerCase().includes(normalizedSearch.value) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedSearch.value))

    return matchesCategory && matchesSearch
  }),
)

const selectCategory = (category: string) => {
  selectedCategory.value = category
}

const selectHotSearch = (keyword: string) => {
  searchQuery.value = keyword
}

const toggleFaq = (id: string) => {
  openFaqId.value = openFaqId.value === id ? null : id
}

const showSupportPlaceholder = (type: 'contact' | 'feedback') => {
  feedbackMessage.value =
    type === 'contact'
      ? '客服入口待项目方确认，当前不会发起真实会话。'
      : '反馈内容提交接口待项目方确认，当前仅展示前端占位提示。'
}

useSeoMeta({
  title: '帮助中心 | 知宠 ZHIPET',
  description: '知宠帮助中心，展示安装佩戴、连接定位、健康提醒、数据隐私和售后支持的 FAQ 草稿。',
  ogTitle: '帮助中心 | 知宠 ZHIPET',
  ogDescription: '搜索常见问题，查看知宠当前帮助内容与待确认边界。',
  ogType: 'website',
})
</script>

<template>
  <div class="help-page">
    <section class="help-hero" aria-labelledby="help-title">
      <BaseContainer class="help-hero__inner" width="wide">
        <div class="help-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>帮助中心</span>
          </nav>
          <BaseTag tone="concept">服务入口待确认</BaseTag>
          <h1 id="help-title">帮助中心</h1>
          <p>查找安装佩戴、连接定位、健康提醒和数据隐私相关问题。正式客服渠道和服务时段待项目方确认。</p>
          <div class="help-search" role="search">
            <BaseInput
              v-model="searchQuery"
              type="search"
              name="help-search"
              placeholder="搜索问题，例如：定位、续航、隐私"
              autocomplete="off"
            />
          </div>
          <div class="hot-searches" aria-label="热门搜索">
            <button v-for="keyword in hotSearches" :key="keyword" type="button" @click="selectHotSearch(keyword)">
              {{ keyword }}
            </button>
          </div>
        </div>
        <div class="help-hero__visual">
          <SceneFrame
            class="help-support-frame"
            src="/images/generated/pages/zhipet-help-setup-scene.png"
            alt="知宠设备设置与帮助中心支持场景"
            aspect-ratio="4 / 5"
            object-position="center"
          >
            <div class="help-hero__card">
              <span>支持状态</span>
              <strong>FAQ 草稿已建立</strong>
              <p>客服、反馈和售后流程待项目方确认。</p>
            </div>
          </SceneFrame>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="help-section"
      width="wide"
      aria-labelledby="category-title"
    >
      <SectionHeading
        id="category-title"
        title="帮助分类"
        description="分类卡用于快速定位问题，不跳转到未建立的真实服务后台。"
      />
      <div class="category-grid">
        <button
          v-for="category in helpCategories"
          :key="category.id"
          type="button"
          class="category-card"
          :class="{ 'is-active': selectedCategory === category.title }"
          @click="selectCategory(category.title)"
        >
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="category.icon" />
          </span>
          <strong>{{ category.title }}</strong>
          <small>{{ category.description }}</small>
        </button>
      </div>
    </BaseContainer>

    <section
      :ref="register"
      class="help-section faq-section"
      aria-labelledby="faq-title"
    >
      <BaseContainer width="wide">
        <div class="faq-layout">
          <aside class="faq-filter" aria-label="FAQ 分类筛选">
            <h2>分类筛选</h2>
            <button
              v-for="category in categoryLabels"
              :key="category"
              type="button"
              :class="{ 'is-active': selectedCategory === category }"
              @click="selectCategory(category)"
            >
              {{ category }}
            </button>
          </aside>
          <div class="faq-list">
            <SectionHeading
              id="faq-title"
              title="常见问题"
              description="答案仅作为当前官网草稿，正式版本需要结合产品发布状态更新。"
              align="left"
            />
            <div v-if="filteredFaqs.length" class="faq-items">
              <article v-for="item in filteredFaqs" :key="item.id" class="faq-item">
                <button
                  type="button"
                  :aria-expanded="openFaqId === item.id"
                  :aria-controls="`${item.id}-answer`"
                  @click="toggleFaq(item.id)"
                >
                  <span>{{ item.question }}</span>
                  <BaseIcon name="arrow-right" aria-hidden="true" />
                </button>
                <p v-show="openFaqId === item.id" :id="`${item.id}-answer`">
                  {{ item.answer }}
                </p>
              </article>
            </div>
            <div v-else class="empty-state" role="status">
              <BaseIcon name="mail" aria-hidden="true" />
              <p>暂未找到匹配问题。可以调整关键词，或等待项目方确认正式反馈入口。</p>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="help-section support-panel"
      width="wide"
      aria-labelledby="support-title"
    >
      <div>
        <BaseTag tone="warning">服务入口待确认</BaseTag>
        <h2 id="support-title">仍然需要帮助？</h2>
        <p>{{ feedbackMessage }}</p>
      </div>
      <div class="support-actions">
        <BaseButton type="button" @click="showSupportPlaceholder('contact')">
          联系客服
          <template #iconLeft>
            <BaseIcon name="headset" />
          </template>
        </BaseButton>
        <BaseButton type="button" variant="secondary" @click="showSupportPlaceholder('feedback')">提交反馈</BaseButton>
      </div>
    </BaseContainer>

    <CTASection
      title="需要面向客户整理更多帮助内容？"
      description="预约演示，确认产品发布前后的 FAQ、客服渠道和反馈流程。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.help-page {
  overflow: hidden;
}

.help-hero {
  position: relative;
  isolation: isolate;
  padding-block: var(--space-8) var(--space-7);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 58%), rgb(251 248 242 / 0) 78%),
    radial-gradient(circle at 72% 18%, rgb(86 130 103 / 14%), transparent 32%);
}

.help-hero::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, var(--color-bg) 0%, rgb(251 248 242 / 74%) 42%, rgb(251 248 242 / 28%) 100%),
    url('/images/generated/pages/zhipet-help-setup-scene.png') center / cover no-repeat;
  content: '';
  opacity: 0.16;
}

.help-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.78fr);
  gap: var(--space-8);
  align-items: center;
}

.help-hero__copy {
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

.help-hero h1 {
  font-size: 72px;
  line-height: 1.08;
  letter-spacing: 0;
}

.help-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.help-search {
  max-width: 620px;
}

.hot-searches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.hot-searches button,
.faq-filter button {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface);
  font-size: 14px;
  font-weight: 650;
}

.hot-searches button:hover,
.faq-filter button:hover,
.faq-filter button.is-active {
  border-color: rgb(183 121 43 / 42%);
  background: var(--color-accent-100);
}

.help-hero__visual {
  position: relative;
  min-height: 520px;
}

.help-support-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  min-height: 520px;
}

.help-hero__card {
  position: absolute;
  left: var(--space-4);
  bottom: var(--space-4);
  display: grid;
  width: min(280px, calc(100% - 32px));
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 90%);
}

.help-hero__card span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.help-hero__card strong {
  color: var(--color-brand-900);
  font-size: 18px;
}

.help-hero__card p {
  font-size: 13px;
}

.help-section {
  @include section-spacing;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.category-card {
  @include subtle-lift(-2px);

  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  color: inherit;
  background: var(--color-surface);
  text-align: left;
}

.category-card:hover,
.category-card.is-active {
  border-color: rgb(183 121 43 / 42%);
  background: var(--color-accent-100);
}

.category-card:focus-visible,
.hot-searches button:focus-visible,
.faq-filter button:focus-visible,
.faq-item button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.category-card strong {
  color: var(--color-brand-900);
  font-size: 19px;
}

.category-card small {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.icon-shell {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(86 130 103 / 22%);
  border-radius: var(--radius-button);
  color: var(--color-sage-700);
  background: var(--color-sage-100);
  font-size: 22px;
}

.faq-section {
  background: var(--color-surface-soft);
}

.faq-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: var(--space-7);
  align-items: start;
}

.faq-filter,
.faq-items,
.faq-list {
  display: grid;
  gap: var(--space-3);
}

.faq-filter {
  position: sticky;
  top: 104px;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.faq-filter h2 {
  font-size: 18px;
}

.faq-filter button {
  width: 100%;
  justify-content: start;
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.faq-item button {
  display: flex;
  width: 100%;
  min-height: 58px;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 0 var(--space-5);
  border: 0;
  color: var(--color-brand-900);
  background: transparent;
  font-size: 16px;
  font-weight: 750;
  text-align: left;
}

.faq-item button .base-icon {
  color: var(--color-accent-600);
  transition: transform var(--motion-duration-fast) var(--motion-ease-out);
}

.faq-item button[aria-expanded='true'] .base-icon {
  transform: rotate(90deg);
}

.faq-item p {
  padding: 0 var(--space-5) var(--space-5);
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.empty-state {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.empty-state .base-icon {
  color: var(--color-accent-600);
  font-size: 24px;
}

.support-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
}

.support-panel h2 {
  margin-block: var(--space-3) var(--space-2);
  font-size: 28px;
}

.support-panel p {
  color: var(--color-text-secondary);
}

.support-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 1000px) {
  .help-hero__inner,
  .faq-layout,
  .category-grid {
    grid-template-columns: 1fr;
  }

  .faq-filter {
    position: static;
  }
}

@media (max-width: 640px) {
  .help-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .help-hero h1 {
    font-size: 36px;
  }

  .help-hero p {
    font-size: 15px;
  }

  .category-card,
  .faq-filter,
  .support-panel {
    padding: var(--space-4);
  }

  .help-hero__visual {
    min-height: 520px;
  }

  .help-support-frame {
    min-height: 430px;
  }

  .support-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .support-actions,
  .support-actions :deep(.base-button) {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-item button .base-icon {
    transition-duration: 0.01ms;
  }
}
</style>

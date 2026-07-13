<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseTextarea from '~/components/base/BaseTextarea.vue'
import EditorialHero from '~/components/common/EditorialHero.vue'
import FormField from '~/components/forms/FormField.vue'
import { faqItems, helpCategories } from '~/data/v2'
import type { FeedbackCategoryValue, FeedbackResponse } from '~~/shared/types/feedback'

const runtimeConfig = useRuntimeConfig()
const site = useSiteConfig()
const feedbackEnabled = computed(() => runtimeConfig.public.feedbackEnabled)
const feedbackMailto = computed(
  () => `mailto:${site.contact.email}?subject=${encodeURIComponent('知宠意见反馈')}`,
)

const searchQuery = ref('')
const selectedCategory = ref('全部')
const openFaqId = ref<string | null>(null)
const feedbackMessage = ref(
  feedbackEnabled.value
    ? '反馈将由知宠团队统一查阅；如需回复，请留下可用的联系方式。'
    : `在线反馈暂未开放，可发送邮件至 ${site.contact.email}。`,
)
const showFeedbackForm = ref(false)
const feedbackLoading = ref(false)
const feedbackForm = reactive({
  category: 'product' as FeedbackCategoryValue,
  message: '',
  contact: '',
  acceptedPrivacy: false,
})
const feedbackErrors = reactive({ message: '', acceptedPrivacy: '' })

const feedbackCategoryOptions: Array<{ value: FeedbackCategoryValue; label: string }> = [
  { value: 'product', label: '产品建议' },
  { value: 'device', label: '设备问题' },
  { value: 'app', label: 'App 使用' },
  { value: 'content', label: '官网内容' },
  { value: 'privacy', label: '隐私与数据' },
  { value: 'other', label: '其他' },
]

const categoryLabels = computed(() => ['全部', ...helpCategories.map((category) => category.title)])
const hotSearches = ['设备连接', '定位提醒', '健康数据', '隐私保护']
const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())
const filteredFaqs = computed(() => faqItems.filter((item) => {
  const matchesCategory = selectedCategory.value === '全部' || item.category === selectedCategory.value
  const matchesSearch = !normalizedSearch.value
    || item.question.toLowerCase().includes(normalizedSearch.value)
    || item.answer.toLowerCase().includes(normalizedSearch.value)
    || item.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedSearch.value))

  return matchesCategory && matchesSearch
}))

const selectHotSearch = (keyword: string) => {
  searchQuery.value = keyword
}

const toggleFaq = (id: string) => {
  openFaqId.value = openFaqId.value === id ? null : id
}

const openFeedbackForm = () => {
  if (!feedbackEnabled.value) {
    feedbackMessage.value = `在线反馈暂未开放，可发送邮件至 ${site.contact.email}。`
    return
  }

  showFeedbackForm.value = true
  feedbackMessage.value = '填写内容后将安全提交给知宠团队。'
}

const validateFeedback = () => {
  feedbackErrors.message = feedbackForm.message.trim().length >= 10
    ? ''
    : '反馈内容至少需要 10 个字符。'
  feedbackErrors.acceptedPrivacy = feedbackForm.acceptedPrivacy
    ? ''
    : '请先确认已阅读隐私说明。'

  return !feedbackErrors.message && !feedbackErrors.acceptedPrivacy
}

const handleFeedbackSubmit = async () => {
  if (!validateFeedback()) {
    feedbackMessage.value = '请先补齐反馈必填信息。'
    return
  }

  feedbackLoading.value = true
  feedbackMessage.value = '正在提交反馈，请稍候。'

  try {
    const response = await $fetch<FeedbackResponse>('/api/feedback', {
      method: 'POST',
      body: {
        category: feedbackForm.category,
        message: feedbackForm.message,
        contact: feedbackForm.contact,
        acceptedPrivacy: feedbackForm.acceptedPrivacy,
      },
    })

    feedbackMessage.value = `反馈已提交，反馈编号：${response.data.feedbackId}`
    feedbackForm.message = ''
    feedbackForm.contact = ''
    feedbackForm.acceptedPrivacy = false
    showFeedbackForm.value = false
  } catch {
    feedbackMessage.value = '反馈暂时无法提交，请稍后重试。已填写的信息仍保留在当前页面。'
  } finally {
    feedbackLoading.value = false
  }
}

useSeoMeta({
  title: '联系与反馈 | 知宠 ZHIPET',
  description: '查找知宠常见问题说明，或向知宠团队提交产品、内容和隐私相关意见反馈。',
  ogTitle: '联系与反馈 | 知宠 ZHIPET',
  ogDescription: '搜索常见问题，提交产品建议与意见反馈。',
  ogType: 'website',
})
</script>

<template>
  <main class="help-page">
    <EditorialHero
      eyebrow="联系与反馈"
      title="先找到答案，再把问题交给我们"
      description="浏览公开说明，了解设备、健康提示与数据隐私的使用边界；没有找到答案时，可以直接向知宠团队提交反馈。"
      image="/images/generated/pages/zhipet-help-setup-scene.webp"
      image-alt="宠物主人在猫咪陪伴下查看知宠设备"
      object-position="center"
      :crumbs="[{ label: '首页', to: '/' }, { label: '联系与反馈' }]"
      primary-label="查找问题"
      primary-to="#faq"
      secondary-label="提交反馈"
      secondary-to="#feedback"
      priority
    />

    <BaseContainer tag="section" class="help-search-section" width="wide" aria-label="问题搜索">
      <div class="help-search-section__label">
        <span>快速查找</span>
        <p>输入关键词，或从常见主题中选择。</p>
      </div>
      <div class="help-search" role="search">
        <BaseInput
          v-model="searchQuery"
          type="search"
          name="help-search"
          placeholder="搜索定位、续航、健康或隐私"
          autocomplete="off"
        />
        <BaseIcon name="search" aria-hidden="true" />
      </div>
      <div class="hot-searches" aria-label="常见搜索">
        <button v-for="keyword in hotSearches" :key="keyword" type="button" @click="selectHotSearch(keyword)">
          {{ keyword }}
        </button>
      </div>
    </BaseContainer>

    <section id="faq" class="faq-section" aria-labelledby="faq-title">
      <BaseContainer width="wide">
        <div class="faq-section__head">
          <div>
            <p>常见问题</p>
            <h2 id="faq-title">从具体问题开始</h2>
          </div>
          <div class="category-tabs" role="tablist" aria-label="问题分类">
            <button
              v-for="category in categoryLabels"
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

        <div v-if="filteredFaqs.length" class="faq-list">
          <article v-for="(item, index) in filteredFaqs" :key="item.id">
            <span>0{{ index + 1 }}</span>
            <button
              type="button"
              :aria-expanded="openFaqId === item.id"
              :aria-controls="`${item.id}-answer`"
              @click="toggleFaq(item.id)"
            >
              {{ item.question }}
              <BaseIcon name="arrow-right" aria-hidden="true" />
            </button>
            <p v-show="openFaqId === item.id" :id="`${item.id}-answer`">{{ item.answer }}</p>
          </article>
        </div>
        <div v-else class="empty-state" role="status">
          <p>暂未找到匹配问题，可以调整关键词或直接提交反馈。</p>
        </div>
      </BaseContainer>
    </section>

    <section id="feedback" class="feedback-section" aria-labelledby="feedback-title">
      <BaseContainer class="feedback-section__inner" width="wide">
        <div class="feedback-intro">
          <p>意见问题反馈</p>
          <h2 id="feedback-title">把你的观察告诉知宠团队</h2>
          <p role="status" aria-live="polite">{{ feedbackMessage }}</p>
          <BaseButton
            v-if="feedbackEnabled && !showFeedbackForm"
            type="button"
            @click="openFeedbackForm"
          >
            填写反馈
            <template #iconRight><BaseIcon name="arrow-right" /></template>
          </BaseButton>
          <BaseButton v-else-if="!feedbackEnabled" :href="feedbackMailto">
            发送反馈邮件
            <template #iconRight><BaseIcon name="arrow-right" /></template>
          </BaseButton>
        </div>

        <form
          v-if="showFeedbackForm && feedbackEnabled"
          class="feedback-form"
          aria-label="意见反馈表单"
          novalidate
          @submit.prevent="handleFeedbackSubmit"
        >
          <FormField id="feedback-category" v-slot="field" label="反馈分类" required>
            <select
              :id="field.id"
              v-model="feedbackForm.category"
              class="feedback-select"
              name="category"
              required
            >
              <option v-for="option in feedbackCategoryOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </FormField>
          <FormField id="feedback-contact" v-slot="field" label="联系方式" helper="选填，用于后续沟通">
            <BaseInput
              :id="field.id"
              v-model="feedbackForm.contact"
              name="contact"
              placeholder="手机号或邮箱"
              :described-by="field.describedBy"
            />
          </FormField>
          <FormField
            id="feedback-message"
            v-slot="field"
            class="feedback-form__full"
            label="反馈内容"
            required
            :error="feedbackErrors.message"
          >
            <BaseTextarea
              :id="field.id"
              v-model="feedbackForm.message"
              name="message"
              placeholder="请描述遇到的问题、建议或希望补充的内容"
              :required="field.required"
              :invalid="field.invalid"
              :described-by="field.describedBy"
            />
          </FormField>
          <FormField id="feedback-privacy" class="feedback-form__full" :error="feedbackErrors.acceptedPrivacy">
            <label class="feedback-consent">
              <input v-model="feedbackForm.acceptedPrivacy" type="checkbox">
              <span>
                我已阅读并理解 <NuxtLink to="/privacy">隐私说明</NuxtLink>，同意为处理本次反馈保存所填写的信息。
              </span>
            </label>
          </FormField>
          <div class="feedback-form__actions feedback-form__full">
            <BaseButton type="submit" :loading="feedbackLoading">提交反馈</BaseButton>
            <BaseButton type="button" variant="text" @click="showFeedbackForm = false">取消</BaseButton>
          </div>
        </form>
      </BaseContainer>
    </section>
  </main>
</template>

<style scoped lang="scss">
.help-page {
  overflow: hidden;
}

.help-search-section {
  display: grid;
  grid-template-columns: minmax(180px, 0.36fr) minmax(360px, 1fr) auto;
  gap: var(--space-5);
  align-items: center;
  padding-block: clamp(56px, 7vw, 80px);
  border-bottom: 1px solid var(--color-border);
}

.help-search-section__label span,
.faq-section__head > div > p,
.feedback-intro > p:first-child {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.help-search-section__label p {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
  font-size: 14px;
}

.help-search {
  position: relative;
}

.help-search .base-icon {
  position: absolute;
  top: 50%;
  right: var(--space-4);
  color: var(--color-text-secondary);
  transform: translateY(-50%);
  pointer-events: none;
}

.help-search :deep(input) {
  padding-right: 48px;
}

.hot-searches,
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.hot-searches button,
.category-tabs button {
  min-height: 36px;
  padding: 0 12px;
  border: 0;
  border-bottom: 1px solid transparent;
  color: var(--color-text-secondary);
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.hot-searches button:hover,
.category-tabs button:hover,
.category-tabs button.is-active {
  color: var(--color-brand-900);
  border-bottom-color: var(--color-accent-600);
}

.faq-section {
  padding-block: clamp(96px, 11vw, 144px);
}

.faq-section__head {
  display: flex;
  gap: var(--space-6);
  align-items: end;
  justify-content: space-between;
  margin-bottom: var(--space-7);
}

.faq-section h2 {
  margin-top: var(--space-2);
  font-size: 42px;
}

.category-tabs {
  justify-content: flex-end;
}

.faq-list {
  border-top: 1px solid var(--color-border-strong);
}

.faq-list article {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  border-bottom: 1px solid var(--color-border);
}

.faq-list article > span {
  padding-top: 27px;
  color: var(--color-accent-600);
  font-size: 12px;
  font-weight: 800;
}

.faq-list button {
  display: flex;
  width: 100%;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  border: 0;
  color: var(--color-brand-900);
  background: transparent;
  font-size: 19px;
  font-weight: 750;
  text-align: left;
}

.faq-list button .base-icon {
  transition: transform var(--motion-duration-fast) var(--motion-ease-out);
}

.faq-list button[aria-expanded='true'] .base-icon {
  transform: rotate(90deg);
}

.faq-list article > p {
  grid-column: 2;
  max-width: 820px;
  padding: 0 var(--space-7) var(--space-5) 0;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.empty-state {
  padding-block: var(--space-6);
  border-block: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.feedback-section {
  color: #fff;
  background: var(--color-brand-900);
}

.feedback-section__inner {
  display: grid;
  grid-template-columns: minmax(280px, 0.7fr) minmax(0, 1fr);
  gap: clamp(56px, 9vw, 120px);
  align-items: start;
  padding-block: clamp(96px, 11vw, 136px);
}

.feedback-intro {
  display: grid;
  gap: var(--space-4);
}

.feedback-intro h2 {
  color: #fff;
  font-size: 42px;
}

.feedback-intro > p:not(:first-child) {
  color: rgb(255 255 255 / 68%);
  line-height: 1.8;
}

.feedback-intro :deep(.base-button) {
  width: fit-content;
  color: var(--color-brand-900);
  border-color: #fff;
  background: #fff;
}

.feedback-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
  padding-top: var(--space-1);
}

.feedback-form :deep(.form-field__label),
.feedback-form :deep(.form-field__helper) {
  color: rgb(255 255 255 / 82%);
}

.feedback-form :deep(input),
.feedback-form :deep(textarea),
.feedback-select {
  color: var(--color-text);
  border-color: rgb(255 255 255 / 24%);
  background: #fff;
}

.feedback-select {
  width: 100%;
  min-height: 48px;
  padding-inline: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
}

.feedback-form__full {
  grid-column: 1 / -1;
}

.feedback-consent {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  color: rgb(255 255 255 / 76%);
  line-height: 1.7;
}

.feedback-consent input {
  width: 18px;
  height: 18px;
  margin-top: 3px;
}

.feedback-consent a {
  color: #fff;
  text-decoration: underline;
}

.feedback-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.feedback-form__actions :deep(.base-button--primary) {
  color: var(--color-brand-900);
  border-color: #fff;
  background: #fff;
}

.feedback-form__actions :deep(.base-button--text) {
  color: #fff;
}

@media (max-width: 960px) {
  .help-search-section,
  .feedback-section__inner {
    grid-template-columns: 1fr;
  }

  .faq-section__head {
    display: grid;
    align-items: start;
  }

  .category-tabs {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .faq-section h2,
  .feedback-intro h2 {
    font-size: 32px;
  }

  .faq-list article {
    grid-template-columns: 36px minmax(0, 1fr);
  }

  .faq-list button {
    font-size: 17px;
  }

  .feedback-form {
    grid-template-columns: 1fr;
  }

  .feedback-form__full {
    grid-column: auto;
  }

  .feedback-intro :deep(.base-button),
  .feedback-form__actions,
  .feedback-form__actions :deep(.base-button) {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-list button .base-icon {
    transition-duration: 0.01ms;
  }
}
</style>

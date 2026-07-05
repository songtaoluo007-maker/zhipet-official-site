<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import BaseTextarea from '~/components/base/BaseTextarea.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import FormField from '~/components/forms/FormField.vue'
import type { IconName } from '~/types/ui'

const { register } = useScrollReveal()

const demoForm = reactive({
  name: '',
  contact: '',
  organization: '',
  role: 'family',
  message: '',
  acceptedPrivacy: false,
})
const formErrors = reactive({
  name: '',
  contact: '',
  role: '',
  acceptedPrivacy: '',
})
const submitStatus = ref('正式提交接口接入前，页面只做前端校验与需求记录提示。')

const selectedFocus = ref('family')

const scenarioOptions = [
  { value: 'family', label: '宠物家庭' },
  { value: 'hospital', label: '宠物医院' },
  { value: 'store', label: '宠物门店' },
  { value: 'partner', label: '行业伙伴' },
  { value: 'investor', label: '投资人' },
  { value: 'other', label: '其他' },
] as const

const focusOptions: Array<{
  id: string
  icon: IconName
  role: (typeof scenarioOptions)[number]['value']
  title: string
  description: string
}> = [
  {
    id: 'family',
    icon: 'home',
    role: 'family',
    title: '家庭养宠方案',
    description: '了解智能挂件、App 记录和家庭协作如何组合成日常观察与照护路径。',
  },
  {
    id: 'product',
    icon: 'collar',
    role: 'family',
    title: '智能挂件产品',
    description: '聚焦样机能力、设备与 App 协同方式，以及后续需要确认的硬件参数。',
  },
  {
    id: 'institution',
    icon: 'building',
    role: 'partner',
    title: '机构合作方向',
    description: '讨论医院、门店和合作机构的服务流程、数据接入与合作边界。',
  },
]

const selectedFocusOption = computed(
  () => focusOptions.find((option) => option.id === selectedFocus.value) ?? focusOptions[0],
)
const selectedFocusTitle = computed(() => selectedFocusOption.value?.title ?? '家庭养宠方案')

const selectFocusOption = (option: (typeof focusOptions)[number]) => {
  selectedFocus.value = option.id
  demoForm.role = option.role
}

watch(
  () => demoForm.role,
  (role) => {
    const matchingOption = focusOptions.find((option) => option.role === role)

    if (matchingOption) {
      selectedFocus.value = matchingOption.id
    }
  },
)

const validateForm = () => {
  formErrors.name = demoForm.name.trim() ? '' : '请输入姓名。'
  formErrors.contact = demoForm.contact.trim() ? '' : '请输入联系方式。'
  formErrors.role = demoForm.role ? '' : '请选择身份角色。'
  formErrors.acceptedPrivacy = demoForm.acceptedPrivacy ? '' : '请先确认已阅读隐私政策。'

  return !formErrors.name && !formErrors.contact && !formErrors.role && !formErrors.acceptedPrivacy
}

const handleSubmit = () => {
  if (!validateForm()) {
    submitStatus.value = '请先补齐必填信息。'
    return
  }

  submitStatus.value = '演示需求已记录，正式提交接口接入后将完成通知。'
}

useSeoMeta({
  title: '预约演示 | 知宠 ZHIPET',
  description: '预约知宠 ZHIPET 产品和解决方案演示。演示排期与提交接口待项目方确认。',
  ogTitle: '预约演示 | 知宠 ZHIPET',
  ogDescription: '选择关注场景，整理产品或合作演示需求。',
  ogType: 'website',
})
</script>

<template>
  <div class="demo-page">
    <section class="demo-hero" aria-labelledby="demo-title">
      <BaseContainer class="demo-hero__inner" width="wide">
        <div class="demo-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>预约演示</span>
          </nav>
          <BaseTag tone="concept">演示排期待项目方确认</BaseTag>
          <h1 id="demo-title">预约演示</h1>
          <p>
            选择您关注的产品或场景，提前整理演示沟通信息。当前页面为前端预约流程，正式排期和提交接口待项目方确认。
          </p>
          <div class="demo-hero__actions" aria-label="预约演示主要操作">
            <BaseButton to="#demo-form" size="lg">
              填写预约信息
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="/help" variant="text" size="lg">查看帮助中心</BaseButton>
          </div>
        </div>
        <BaseImage
          src="/images/concepts/app-platform.svg"
          alt="知宠 App 与健康管理平台演示概念视觉"
          aspect-ratio="16 / 10"
          radius="lg"
          priority
          concept
          label-placement="below"
        />
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="demo-section"
      width="wide"
      aria-labelledby="focus-title"
    >
      <SectionHeading
        id="focus-title"
        title="选择演示重点"
        description="先选择沟通方向，页面不会展示未确认客户案例、价格套餐或上线承诺。"
      />
      <div class="focus-grid" role="list" aria-label="演示重点">
        <button
          v-for="option in focusOptions"
          :key="option.id"
          class="focus-option"
          :class="{ 'is-selected': selectedFocus === option.id }"
          type="button"
          :aria-pressed="selectedFocus === option.id"
          @click="selectFocusOption(option)"
        >
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="option.icon" />
          </span>
          <span>
            <strong>{{ option.title }}</strong>
            <small>{{ option.description }}</small>
          </span>
          <BaseIcon v-if="selectedFocus === option.id" name="check-circle" class="focus-option__check" />
        </button>
      </div>
    </BaseContainer>

    <section
      id="demo-form"
      :ref="register"
      class="demo-section form-section"
      aria-labelledby="demo-form-title"
    >
      <BaseContainer width="wide">
        <div class="form-layout">
          <div class="form-layout__copy">
            <SectionHeading
              id="demo-form-title"
              title="预约信息"
              description="前端会校验必填字段；没有后端接口时，不请求不存在的 API。"
            />
            <div class="selected-summary" aria-live="polite">
              <BaseIcon name="check-circle" />
              <span>当前关注：{{ selectedFocusTitle }}</span>
            </div>
          </div>
          <form class="demo-form" aria-label="预约演示表单" novalidate @submit.prevent="handleSubmit">
            <FormField id="demo-name" v-slot="field" label="姓名" required :error="formErrors.name">
              <BaseInput
                :id="field.id"
                v-model="demoForm.name"
                name="name"
                placeholder="请输入联系人"
                autocomplete="name"
                :required="field.required"
                :invalid="field.invalid"
                :described-by="field.describedBy"
              />
            </FormField>
            <FormField id="demo-contact" v-slot="field" label="联系方式" required helper="电话或邮箱均可" :error="formErrors.contact">
              <BaseInput
                :id="field.id"
                v-model="demoForm.contact"
                name="contact"
                placeholder="请输入联系方式"
                autocomplete="email"
                :required="field.required"
                :invalid="field.invalid"
                :described-by="field.describedBy"
              />
            </FormField>
            <FormField id="demo-organization" v-slot="field" label="公司/机构">
              <BaseInput
                :id="field.id"
                v-model="demoForm.organization"
                name="organization"
                placeholder="家庭用户可不填"
                autocomplete="organization"
                :invalid="field.invalid"
                :described-by="field.describedBy"
              />
            </FormField>
            <FormField id="demo-role" v-slot="field" label="身份角色" required :error="formErrors.role">
              <select
                :id="field.id"
                v-model="demoForm.role"
                class="demo-select"
                name="role"
                :required="field.required"
                :aria-describedby="field.describedBy"
              >
                <option v-for="option in scenarioOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </FormField>
            <FormField id="demo-message" v-slot="field" label="补充需求">
              <BaseTextarea
                :id="field.id"
                v-model="demoForm.message"
                name="message"
                placeholder="请描述想重点了解的产品、方案或合作方式"
                :invalid="field.invalid"
                :described-by="field.describedBy"
              />
            </FormField>
            <FormField id="demo-privacy" :error="formErrors.acceptedPrivacy">
              <label class="privacy-check">
                <input v-model="demoForm.acceptedPrivacy" type="checkbox">
                <span>
                  我已阅读并理解
                  <NuxtLink to="/privacy">隐私政策</NuxtLink>
                  。正式数据提交与通知方式待项目方确认。
                </span>
              </label>
            </FormField>
            <div class="form-status-panel" role="note">
              <BaseIcon name="shield-check" />
              <div>
                <strong>当前是演示需求整理表</strong>
                <p>{{ submitStatus }}</p>
              </div>
            </div>
            <BaseButton type="submit">提交预约</BaseButton>
          </form>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.demo-page {
  overflow: hidden;
}

.demo-hero {
  padding-block: var(--space-8) var(--space-7);
}

.demo-hero__inner,
.form-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.82fr);
  gap: var(--space-8);
  align-items: center;
}

.demo-hero__copy,
.form-layout__copy {
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

.demo-hero h1 {
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
  text-wrap: balance;
}

.demo-hero p {
  max-width: 720px;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.72;
}

.demo-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.demo-section {
  @include section-spacing;
}

.focus-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.focus-option {
  @include subtle-lift(-1px);

  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  align-items: start;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  color: inherit;
  background: var(--color-surface);
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--motion-duration-fast) var(--motion-ease-out),
    background var(--motion-duration-fast) var(--motion-ease-out),
    box-shadow var(--motion-duration-fast) var(--motion-ease-out),
    transform var(--motion-duration-fast) var(--motion-ease-out);
}

.focus-option:hover,
.focus-option.is-selected {
  border-color: rgb(183 121 43 / 52%);
  background: var(--color-accent-100);
}

.focus-option:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-option:hover {
  transform: translateY(-1px);
}

.focus-option strong,
.focus-option small {
  display: block;
}

.focus-option strong {
  margin-bottom: var(--space-2);
  color: var(--color-brand-900);
  font-size: 18px;
}

.focus-option small,
.selected-summary span {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.focus-option__check {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  color: var(--color-success);
  font-size: 18px;
}

.icon-shell {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  color: var(--color-accent-600);
  background: var(--color-accent-100);
  font-size: 22px;
}

.form-section {
  background: var(--color-surface-soft);
}

.selected-summary {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  width: fit-content;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
}

.selected-summary .base-icon {
  color: var(--color-success);
}

.demo-form {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
}

.form-status-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid rgb(86 130 103 / 22%);
  border-radius: var(--radius-button);
  background: rgb(86 130 103 / 8%);
}

.privacy-check {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-2);
  align-items: start;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.privacy-check input {
  margin-top: 0.28em;
}

.privacy-check a {
  color: var(--color-accent-600);
  font-weight: 650;
}

.form-status-panel .base-icon {
  color: var(--color-success);
  font-size: 20px;
}

.form-status-panel strong {
  color: var(--color-brand-900);
}

.form-status-panel p {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
  font-size: 14px;
}

.demo-select {
  width: 100%;
  min-height: 44px;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-field);
  color: var(--color-text);
  background: var(--color-surface);
  font-size: 15px;
}

.demo-select:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

@media (max-width: 1100px) {
  .demo-hero__inner,
  .form-layout,
  .focus-grid {
    grid-template-columns: 1fr;
  }

  .demo-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 560px) {
  .demo-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .demo-hero h1 {
    font-size: 36px;
  }

  .demo-hero p {
    font-size: 15px;
  }

  .demo-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .focus-option {
    grid-template-columns: 1fr;
  }

  .demo-form {
    padding: var(--space-5);
  }

  .form-status-panel {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .focus-option:hover {
    transform: none;
  }
}
</style>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import BaseTextarea from '~/components/base/BaseTextarea.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import FormField from '~/components/forms/FormField.vue'

const site = useSiteConfig()
const { register } = useScrollReveal()

const contactForm = reactive({
  name: '',
  company: '',
  contact: '',
  message: '',
})

const contactItems = [
  { id: 'phone', icon: 'phone', label: '电话', value: site.contact.phone },
  { id: 'email', icon: 'mail', label: '邮箱', value: site.contact.email },
  { id: 'address', icon: 'home', label: '地址', value: site.contact.address },
  { id: 'registration', icon: 'shield-check', label: '备案', value: site.contact.registrationNumber },
] as const

const serviceTopics = ['产品演示', '家庭养宠方案', '医院/门店合作', '品牌与商务合作']

useSeoMeta({
  title: '联系我们 | 知宠 ZHIPET',
  description: '联系知宠 ZHIPET，提交合作或产品咨询需求。真实联系方式和提交接口待项目方确认。',
  ogTitle: '联系我们 | 知宠 ZHIPET',
  ogDescription: '提交合作或产品咨询需求，真实联系方式以项目方确认为准。',
  ogType: 'website',
})
</script>

<template>
  <div class="contact-page">
    <section class="contact-hero" aria-labelledby="contact-title">
      <BaseContainer class="contact-hero__inner" width="wide">
        <div class="contact-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>联系我们</span>
          </nav>
          <BaseTag tone="concept">联系方式待项目方确认</BaseTag>
          <h1 id="contact-title">联系我们</h1>
          <p>
            如果您关注知宠产品、解决方案或合作计划，可以先留下需求。电话、地址、备案和提交接口将在项目方确认后更新。
          </p>
          <div class="contact-hero__actions" aria-label="联系页主要操作">
            <BaseButton to="/demo" size="lg">
              预约演示
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="#contact-form" variant="secondary" size="lg">填写需求</BaseButton>
          </div>
        </div>
        <BaseImage
          src="/images/concepts/team-lab.svg"
          alt="知宠团队沟通与产品讨论概念视觉"
          aspect-ratio="16 / 10"
          radius="lg"
          priority
          concept
        />
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="contact-section"
      width="wide"
      aria-labelledby="contact-info-title"
    >
      <SectionHeading
        id="contact-info-title"
        title="联系信息"
        description="以下信息在未确认前不生成看似真实的电话、地址、二维码或备案号。"
      />
      <div class="contact-info-grid">
        <article v-for="item in contactItems" :key="item.id" class="contact-info-item">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <div>
            <h2>{{ item.label }}</h2>
            <p>{{ item.value }}</p>
          </div>
        </article>
      </div>
    </BaseContainer>

    <section
      id="contact-form"
      :ref="register"
      class="contact-section form-section"
      aria-labelledby="contact-form-title"
    >
      <BaseContainer width="wide">
        <div class="form-layout">
          <div class="form-layout__copy">
            <SectionHeading
              id="contact-form-title"
              title="留下合作需求"
              description="当前为前端表单样式与信息结构展示，提交接口待项目方确认后接入。"
            />
            <ul class="topic-list" aria-label="常见咨询方向">
              <li v-for="topic in serviceTopics" :key="topic">{{ topic }}</li>
            </ul>
          </div>
          <form class="contact-form" aria-label="联系需求表单" @submit.prevent>
            <FormField id="contact-name" v-slot="field" label="姓名" required>
              <BaseInput
                :id="field.id"
                v-model="contactForm.name"
                name="name"
                placeholder="请输入姓名"
                autocomplete="name"
                :required="field.required"
                :invalid="field.invalid"
                :described-by="field.describedBy"
              />
            </FormField>
            <FormField id="contact-company" v-slot="field" label="公司/机构">
              <BaseInput
                :id="field.id"
                v-model="contactForm.company"
                name="company"
                placeholder="请输入公司或机构名称"
                autocomplete="organization"
                :invalid="field.invalid"
                :described-by="field.describedBy"
              />
            </FormField>
            <FormField id="contact-method" v-slot="field" label="联系方式" required helper="电话或邮箱均可">
              <BaseInput
                :id="field.id"
                v-model="contactForm.contact"
                name="contact"
                placeholder="请输入联系方式"
                autocomplete="email"
                :required="field.required"
                :invalid="field.invalid"
                :described-by="field.describedBy"
              />
            </FormField>
            <FormField id="contact-message" v-slot="field" label="合作需求">
              <BaseTextarea
                :id="field.id"
                v-model="contactForm.message"
                name="message"
                placeholder="请简要描述想了解的产品、场景或合作方式"
                :invalid="field.invalid"
                :described-by="field.describedBy"
              />
            </FormField>
            <BaseButton disabled type="submit">提交接口待项目方确认</BaseButton>
          </form>
        </div>
      </BaseContainer>
    </section>

    <CTASection
      title="想先了解知宠方案？"
      description="进入预约演示页，选择关注场景并整理沟通信息。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.contact-page {
  overflow: hidden;
}

.contact-hero {
  padding-block: var(--space-8) var(--space-7);
}

.contact-hero__inner,
.form-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.82fr);
  gap: var(--space-8);
  align-items: center;
}

.contact-hero__copy,
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

.contact-hero h1 {
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.contact-hero p,
.contact-info-item p {
  color: var(--color-text-secondary);
}

.contact-hero p {
  max-width: 720px;
  font-size: 18px;
}

.contact-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.contact-section {
  @include section-spacing;
}

.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}

.contact-info-item {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.contact-info-item h2 {
  margin-bottom: var(--space-1);
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

.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  list-style: none;
}

.topic-list li {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-brand-900);
  background: var(--color-surface);
  font-size: 13px;
  font-weight: 650;
}

.contact-form {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
}

@media (max-width: 1100px) {
  .contact-hero__inner,
  .form-layout {
    grid-template-columns: 1fr;
  }

  .contact-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .contact-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 560px) {
  .contact-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .contact-hero h1 {
    font-size: 36px;
  }

  .contact-hero p {
    font-size: 15px;
  }

  .contact-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .contact-info-grid {
    grid-template-columns: 1fr;
  }

  .contact-form {
    padding: var(--space-5);
  }
}
</style>

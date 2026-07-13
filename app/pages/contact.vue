<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'

const site = useSiteConfig()
const emailCopyState = ref<'idle' | 'copied' | 'manual'>('idle')
let emailCopyResetTimer: ReturnType<typeof setTimeout> | undefined

const copyWithSelection = () => {
  const textarea = document.createElement('textarea')
  textarea.value = site.contact.email
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.append(textarea)
  textarea.select()

  const copied = document.execCommand('copy')
  textarea.remove()
  return copied
}

const scheduleCopyStateReset = () => {
  if (emailCopyResetTimer) clearTimeout(emailCopyResetTimer)
  emailCopyResetTimer = setTimeout(() => {
    emailCopyState.value = 'idle'
    emailCopyResetTimer = undefined
  }, 5000)
}

const copyContactEmail = async () => {
  let copied = false

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(site.contact.email)
      copied = true
    } else {
      copied = copyWithSelection()
    }
  } catch {
    try {
      copied = copyWithSelection()
    } catch {
      copied = false
    }
  }

  emailCopyState.value = copied ? 'copied' : 'manual'
  scheduleCopyStateReset()
}

onBeforeUnmount(() => {
  if (emailCopyResetTimer) clearTimeout(emailCopyResetTimer)
})

useSeoMeta({
  title: '联系与反馈 | 知宠 ZHIPET',
  description: `通过公开邮箱 ${site.contact.email} 联系知宠团队，或提交意见与问题反馈。`,
  ogTitle: '联系与反馈 | 知宠 ZHIPET',
  ogDescription: '知宠官网提供公开邮箱和意见问题反馈两种联系入口。',
  ogType: 'website',
})
</script>

<template>
  <main class="contact-page">
    <BaseContainer class="contact-hero" width="wide">
      <nav class="breadcrumb" aria-label="面包屑">
        <NuxtLink to="/">首页</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>联系与反馈</span>
      </nav>
      <p class="contact-hero__eyebrow">知宠团队</p>
      <h1>让每一次沟通，都指向更好的陪伴</h1>
      <p class="contact-hero__description">
        关于产品、内容、隐私与合作的想法，可以通过公开邮箱或意见反馈入口告诉我们。我们会认真阅读，并在需要进一步沟通时与你联系。
      </p>
    </BaseContainer>

    <section class="contact-options" aria-labelledby="contact-options-title">
      <BaseContainer width="wide">
        <h2 id="contact-options-title" class="sr-only">联系入口</h2>
        <article>
          <span class="contact-options__index">01</span>
          <BaseIcon name="mail" aria-hidden="true" />
          <div>
            <p>邮箱联系我们</p>
            <h3>{{ site.contact.email }}</h3>
            <span>适合产品交流、内容纠错、隐私权利请求与合作沟通。</span>
          </div>
          <div class="contact-options__action">
            <BaseButton variant="secondary" @click="copyContactEmail">
              {{ emailCopyState === 'copied' ? '邮箱已复制' : '复制邮箱' }}
              <template #iconRight>
                <BaseIcon :name="emailCopyState === 'copied' ? 'check-circle' : 'mail'" />
              </template>
            </BaseButton>
            <p v-if="emailCopyState !== 'idle'" class="contact-options__status" role="status">
              {{
                emailCopyState === 'copied'
                  ? '邮箱地址已复制。'
                  : `请手动复制：${site.contact.email}`
              }}
            </p>
          </div>
        </article>
        <article>
          <span class="contact-options__index">02</span>
          <BaseIcon name="check-circle" aria-hidden="true" />
          <div>
            <p>意见问题反馈</p>
            <h3>把使用感受和建议告诉我们</h3>
            <span>适合提交官网内容、产品建议、设备、App 与数据隐私相关问题。</span>
          </div>
          <BaseButton to="/help#feedback" variant="secondary">
            前往反馈
            <template #iconRight><BaseIcon name="arrow-right" /></template>
          </BaseButton>
        </article>
      </BaseContainer>
    </section>

    <BaseContainer tag="section" class="contact-note" width="wide" aria-labelledby="contact-note-title">
      <p>联系说明</p>
      <h2 id="contact-note-title">由知宠团队统一查阅与回复</h2>
      <p>
        为便于识别事项，请在邮件主题或反馈分类中说明问题类型。涉及隐私权利请求时，可同时提供反馈编号或足以核验提交关系的信息。
      </p>
    </BaseContainer>
  </main>
</template>

<style scoped lang="scss">
.contact-page {
  overflow: hidden;
}

.contact-hero {
  display: grid;
  min-height: 620px;
  align-content: center;
  padding-block: clamp(96px, 12vw, 160px);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.breadcrumb a {
  color: inherit;
}

.contact-hero__eyebrow,
.contact-note > p:first-child,
.contact-options article > div > p {
  margin-bottom: var(--space-3);
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.contact-hero h1 {
  max-width: 930px;
  font-size: clamp(48px, 6.6vw, 82px);
  line-height: 1.08;
  text-wrap: balance;
}

.contact-hero__description {
  max-width: 720px;
  margin-top: var(--space-5);
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.8;
}

.contact-options {
  color: #fff;
  background: var(--color-brand-900);
}

.contact-options article {
  display: grid;
  grid-template-columns: 56px 48px minmax(0, 1fr) auto;
  gap: var(--space-5);
  align-items: center;
  padding-block: clamp(48px, 6vw, 72px);
  border-bottom: 1px solid rgb(255 255 255 / 16%);
}

.contact-options article:last-child {
  border-bottom: 0;
}

.contact-options__index {
  color: var(--color-accent-300);
  font-size: 13px;
  font-weight: 800;
}

.contact-options article > .base-icon {
  color: var(--color-accent-300);
  font-size: 30px;
}

.contact-options h3 {
  margin-bottom: var(--space-2);
  color: #fff;
  font-size: 28px;
}

.contact-options article > div > span {
  color: rgb(255 255 255 / 68%);
  line-height: 1.7;
}

.contact-options :deep(.base-button--secondary) {
  color: #fff;
  border-color: rgb(255 255 255 / 38%);
  background: transparent;
}

.contact-options__action {
  display: grid;
  justify-items: end;
  gap: var(--space-2);
}

.contact-options__status {
  max-width: 240px;
  margin: 0;
  color: rgb(255 255 255 / 72%);
  font-size: 12px;
  line-height: 1.5;
  text-align: right;
  overflow-wrap: anywhere;
}

.contact-note {
  display: grid;
  grid-template-columns: minmax(220px, 0.5fr) minmax(280px, 0.8fr) minmax(320px, 1fr);
  gap: var(--space-7);
  align-items: start;
  padding-block: clamp(96px, 11vw, 136px);
}

.contact-note h2 {
  font-size: 34px;
}

.contact-note > p:last-child {
  color: var(--color-text-secondary);
  line-height: 1.8;
}

@media (max-width: 820px) {
  .contact-options article,
  .contact-note {
    grid-template-columns: 1fr;
  }

  .contact-options article > .base-button {
    width: fit-content;
  }

  .contact-options__action {
    justify-items: start;
  }

  .contact-options__status {
    text-align: left;
  }
}

@media (max-width: 560px) {
  .contact-hero {
    min-height: 560px;
  }

  .contact-hero__description {
    font-size: 16px;
  }

  .contact-options article > .base-button {
    width: 100%;
  }

  .contact-options__action,
  .contact-options__action :deep(.base-button) {
    width: 100%;
  }
}
</style>

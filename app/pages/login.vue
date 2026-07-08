<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import FormField from '~/components/forms/FormField.vue'

const route = useRoute()
const activeMode = ref(route.query.mode === 'register' ? 'register' : 'login')
const authNotice = ref('账号体系待项目方确认，当前页面只展示静态前端入口。')
const form = reactive({
  account: '',
  password: '',
  remember: false,
})

const submitLabel = computed(() => (activeMode.value === 'register' ? '注册入口待开放' : '登录入口待开放'))
const title = computed(() => (activeMode.value === 'register' ? '注册知宠账号' : '登录知宠账号'))

watch(
  () => route.query.mode,
  (mode) => {
    activeMode.value = mode === 'register' ? 'register' : 'login'
  },
)

const setMode = (mode: 'login' | 'register') => {
  activeMode.value = mode
  authNotice.value = '账号体系待项目方确认，当前页面只展示静态前端入口。'
}

const handleSubmit = () => {
  authNotice.value = '未接入真实鉴权接口。本页不会保存登录状态、Token 或模拟用户已登录。'
}

useSeoMeta({
  title: '登录注册 | 知宠 ZHIPET',
  description: '知宠登录注册静态入口。账号体系、鉴权接口和第三方登录待项目方确认。',
  ogTitle: '登录注册 | 知宠 ZHIPET',
  ogDescription: '展示知宠账号入口规划，不接入真实登录或注册业务。',
  ogType: 'website',
})
</script>

<template>
  <div class="login-page">
    <BaseContainer class="auth-layout" width="wide">
      <section class="auth-card" aria-labelledby="auth-title">
        <div class="auth-tabs" role="tablist" aria-label="登录注册切换">
          <button
            type="button"
            role="tab"
            :aria-selected="activeMode === 'login'"
            :class="{ 'is-active': activeMode === 'login' }"
            @click="setMode('login')"
          >
            登录
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeMode === 'register'"
            :class="{ 'is-active': activeMode === 'register' }"
            @click="setMode('register')"
          >
            注册
          </button>
        </div>

        <div class="auth-card__head">
          <h2 id="auth-title">{{ title }}</h2>
          <p>手机号、邮箱、密码规则和第三方登录方式待项目方确认。</p>
        </div>

        <form class="auth-form" novalidate @submit.prevent="handleSubmit">
          <FormField id="auth-account" v-slot="field" label="手机号或邮箱" required>
            <BaseInput
              :id="field.id"
              v-model="form.account"
              name="account"
              placeholder="请输入手机号或邮箱"
              autocomplete="username"
              :required="field.required"
              :invalid="field.invalid"
              :described-by="field.describedBy"
            />
          </FormField>
          <FormField id="auth-password" v-slot="field" label="密码" required>
            <BaseInput
              :id="field.id"
              v-model="form.password"
              type="password"
              name="password"
              placeholder="请输入密码"
              autocomplete="current-password"
              :required="field.required"
              :invalid="field.invalid"
              :described-by="field.describedBy"
            />
          </FormField>
          <div class="auth-options">
            <label>
              <input v-model="form.remember" type="checkbox">
              <span>记住我</span>
            </label>
            <button type="button" @click="authNotice = '找回密码流程待项目方确认。'">忘记密码</button>
          </div>
          <BaseButton type="submit" block>{{ submitLabel }}</BaseButton>
        </form>

        <div class="auth-third-party" aria-label="其他登录方式">
          <span>其他方式登录</span>
          <div>
            <button type="button" @click="authNotice = '微信登录待项目方确认。'">微信</button>
            <button type="button" @click="authNotice = 'Apple 登录待项目方确认。'">Apple</button>
            <button type="button" @click="authNotice = '手机验证码登录待项目方确认。'">手机</button>
          </div>
        </div>

        <p class="auth-notice" role="status">
          <BaseIcon name="shield-check" aria-hidden="true" />
          <span>{{ authNotice }}</span>
        </p>

        <p class="auth-agreement">
          使用入口前需同意
          <NuxtLink to="/terms">知宠用户服务协议</NuxtLink>
          与
          <NuxtLink to="/privacy">隐私政策</NuxtLink>
          。正式协议待项目方确认。
        </p>
      </section>
    </BaseContainer>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  position: relative;
  isolation: isolate;
  min-height: calc(100vh - 76px);
  display: grid;
  align-items: center;
  padding-block: var(--space-8);
  background:
    linear-gradient(90deg, rgb(251 248 242 / 86%) 0%, rgb(251 248 242 / 42%) 58%, rgb(251 248 242 / 84%) 100%),
    var(--color-bg);
}

.login-page::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: url('/images/generated/pages/zhipet-family-care-scene.png') center / cover no-repeat;
  content: '';
  opacity: 0.24;
}

.auth-layout {
  display: grid;
  grid-template-columns: minmax(0, 520px);
  align-items: center;
  justify-content: center;
}

.auth-card {
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: rgb(255 255 255 / 72%);
  box-shadow: 0 24px 72px rgb(47 36 27 / 9%);
  backdrop-filter: blur(18px);
}

.auth-card__head p,
.auth-agreement,
.auth-notice,
.auth-third-party span {
  color: var(--color-text-secondary);
  line-height: 1.72;
}

.auth-card {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-6);
}

.auth-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 4px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface-soft);
}

.auth-tabs button {
  min-height: 40px;
  border: 0;
  border-radius: 6px;
  color: var(--color-text-secondary);
  background: transparent;
  font-weight: 750;
}

.auth-tabs button.is-active {
  color: var(--color-brand-900);
  background: var(--color-surface);
}

.auth-card__head {
  display: grid;
  gap: var(--space-2);
}

.auth-card__head h2 {
  font-size: 30px;
  line-height: 1.2;
}

.auth-form {
  display: grid;
  gap: var(--space-4);
}

.auth-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
}

.auth-options label {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  color: var(--color-brand-900);
  font-size: 14px;
  font-weight: 650;
}

.auth-options button,
.auth-third-party button {
  border: 0;
  color: var(--color-accent-600);
  background: transparent;
  font-weight: 650;
}

.auth-third-party {
  display: grid;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.auth-third-party div {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}

.auth-third-party button {
  min-height: 42px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  color: var(--color-brand-900);
  background: var(--color-surface);
}

.auth-notice {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid rgb(86 130 103 / 22%);
  border-radius: var(--radius-button);
  background: var(--color-sage-100);
  font-size: 14px;
}

.auth-notice .base-icon {
  color: var(--color-sage-700);
  font-size: 18px;
}

.auth-agreement {
  font-size: 13px;
}

.auth-agreement a {
  color: var(--color-accent-600);
  font-weight: 650;
}

.auth-tabs button:focus-visible,
.auth-options button:focus-visible,
.auth-third-party button:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

@media (max-width: 980px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .login-page {
    padding-block: var(--space-5);
  }

  .auth-card {
    padding: var(--space-4);
  }

  .auth-options {
    align-items: flex-start;
    flex-direction: column;
  }

  .auth-third-party div {
    grid-template-columns: 1fr;
  }
}
</style>

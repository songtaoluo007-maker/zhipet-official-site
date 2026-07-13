<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import EditorialHero from '~/components/common/EditorialHero.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { aboutAbilities, productBoundaries } from '~/data/v2'

const { register } = useScrollReveal()
const site = useSiteConfig()

useSeoMeta({
  title: '项目介绍 | 知宠 ZHIPET',
  description: '了解知宠团队关于宠物安全、健康趋势、状态理解与专业协作的产品理念。',
  ogTitle: '项目介绍 | 知宠 ZHIPET',
  ogDescription: '因为懂你，所以更懂它。了解知宠的品牌信念与产品边界。',
  ogType: 'website',
})
</script>

<template>
  <main class="about-page">
    <EditorialHero
      eyebrow="项目介绍"
      title="因为懂你，所以更懂它"
      description="知宠关注的不只是设备记录了什么，更是家庭如何理解变化、保留判断边界，并在需要时与专业服务建立更有依据的沟通。"
      image="/images/generated/pages/zhipet-family-care-scene.webp"
      image-alt="宠物主人与犬猫在家庭环境中温暖互动"
      object-position="center"
      :crumbs="[{ label: '首页', to: '/' }, { label: '项目介绍' }]"
      primary-label="了解解决方案"
      primary-to="/solutions"
      secondary-label="联系知宠团队"
      secondary-to="/contact"
      priority
    />

    <BaseContainer
      :ref="register"
      tag="section"
      class="belief-section"
      width="wide"
      aria-labelledby="belief-title"
    >
      <p class="section-kicker">我们的信念</p>
      <div class="belief-section__layout">
        <h2 id="belief-title">让科技成为陪伴的一部分，而不是制造焦虑的另一块屏幕。</h2>
        <div class="belief-section__copy">
          <p>
            宠物健康往往藏在微小、连续的日常变化里。知宠希望把设备、App 与健康档案组织成容易理解的观察路径，让主人看见趋势，也知道何时应该停止猜测并寻求专业帮助。
          </p>
          <p>
            我们坚持克制表达：不把概率写成结论，不把状态解释包装成宠物语言翻译，也不让产品替代执业兽医的诊断与治疗建议。
          </p>
        </div>
      </div>
    </BaseContainer>

    <section :ref="register" class="ability-section" aria-labelledby="ability-title">
      <BaseContainer width="wide">
        <SectionHeading
          id="ability-title"
          title="三个长期关注的方向"
          description="从安全到健康，再到可解释的状态提示，每一步都围绕真实照护场景展开。"
          align="left"
        />
        <div class="ability-list">
          <article v-for="(item, index) in aboutAbilities" :key="item.id">
            <span class="ability-list__index">0{{ index + 1 }}</span>
            <BaseIcon :name="item.icon" aria-hidden="true" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      :ref="register"
      tag="section"
      class="boundary-section"
      width="wide"
      aria-labelledby="boundary-title"
    >
      <SectionHeading
        id="boundary-title"
        title="可信，先从说清边界开始"
        description="我们希望每一条提示都让用户知道它能做什么，也知道它不能替代什么。"
        align="left"
      />
      <div class="boundary-list">
        <article v-for="(item, index) in productBoundaries" :key="item.id">
          <span>0{{ index + 1 }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <section :ref="register" class="team-section" aria-labelledby="team-title">
      <BaseContainer class="team-section__inner" width="wide">
        <div>
          <p>知宠团队</p>
          <h2 id="team-title">围绕真实问题持续交流</h2>
        </div>
        <p class="team-section__description">
          官网内容由知宠团队维护。关于产品、内容、隐私或合作的意见，可以通过公开邮箱或反馈页面告诉我们。
        </p>
        <div class="team-section__actions">
          <BaseButton :href="`mailto:${site.contact.email}`" variant="secondary">
            {{ site.contact.email }}
          </BaseButton>
          <BaseButton to="/help#feedback">
            意见问题反馈
            <template #iconRight><BaseIcon name="arrow-right" /></template>
          </BaseButton>
        </div>
      </BaseContainer>
    </section>
  </main>
</template>

<style scoped lang="scss">
.about-page {
  overflow: hidden;
}

.belief-section,
.boundary-section {
  padding-block: clamp(96px, 11vw, 144px);
}

.section-kicker {
  margin-bottom: var(--space-5);
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.belief-section__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.7fr);
  gap: clamp(48px, 9vw, 120px);
  align-items: start;
}

.belief-section h2 {
  max-width: 760px;
  font-size: clamp(38px, 4.4vw, 58px);
  line-height: 1.18;
  text-wrap: balance;
}

.belief-section__copy {
  display: grid;
  gap: var(--space-4);
  padding-top: var(--space-2);
}

.belief-section__copy p,
.ability-list p,
.boundary-list p,
.team-section__description {
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.ability-section {
  padding-block: clamp(96px, 10vw, 128px);
  background: var(--color-surface-soft);
}

.ability-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: var(--space-7);
  border-top: 1px solid var(--color-border-strong);
}

.ability-list article {
  display: grid;
  min-height: 310px;
  gap: var(--space-3);
  align-content: start;
  padding: var(--space-5);
  border-right: 1px solid var(--color-border);
}

.ability-list article:last-child {
  border-right: 0;
}

.ability-list__index {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.ability-list .base-icon {
  margin-top: var(--space-5);
  color: var(--color-sage-700);
  font-size: 34px;
}

.ability-list h3 {
  margin-top: var(--space-2);
  font-size: 28px;
}

.boundary-list {
  margin-top: var(--space-7);
  border-top: 1px solid var(--color-border-strong);
}

.boundary-list article {
  display: grid;
  grid-template-columns: 72px minmax(180px, 0.42fr) minmax(0, 1fr);
  gap: var(--space-5);
  align-items: baseline;
  padding-block: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.boundary-list span {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.boundary-list h3 {
  font-size: 24px;
}

.team-section {
  color: #fff;
  background: var(--color-brand-900);
}

.team-section__inner {
  display: grid;
  grid-template-columns: minmax(240px, 0.72fr) minmax(320px, 1fr) auto;
  gap: var(--space-7);
  align-items: end;
  padding-block: clamp(72px, 8vw, 96px);
}

.team-section__inner > div:first-child p {
  margin-bottom: var(--space-2);
  color: var(--color-accent-300);
  font-size: 13px;
  font-weight: 800;
}

.team-section h2 {
  color: #fff;
  font-size: 34px;
}

.team-section__description {
  color: rgb(255 255 255 / 70%);
}

.team-section__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: flex-end;
}

.team-section__actions :deep(.base-button--secondary) {
  color: #fff;
  border-color: rgb(255 255 255 / 36%);
  background: transparent;
}

@media (max-width: 960px) {
  .belief-section__layout,
  .team-section__inner {
    grid-template-columns: 1fr;
  }

  .team-section__actions {
    justify-content: flex-start;
  }
}

@media (max-width: 760px) {
  .ability-list {
    grid-template-columns: 1fr;
  }

  .ability-list article {
    min-height: auto;
    padding-inline: 0;
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }

  .boundary-list article {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .boundary-list p {
    grid-column: 2;
  }
}

@media (max-width: 560px) {
  .team-section__actions,
  .team-section__actions :deep(.base-button) {
    width: 100%;
  }
}
</style>

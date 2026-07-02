<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import { smartCollarProduct as product } from '~/data/products'

const { register } = useScrollReveal()

useSeoMeta({
  title: `${product.name} | 知宠 ZHIPET`,
  description: `${product.name}${product.headline}，探索生命体征监测、行为活动分析与异常预警提醒。当前参数以样机展示和项目方确认为准。`,
  ogTitle: `${product.name} | 知宠 ZHIPET`,
  ogDescription: product.summary,
  ogType: 'website',
})
</script>

<template>
  <div class="product-page">
    <section class="product-hero" aria-labelledby="product-title">
      <BaseContainer class="product-hero__inner" width="wide">
        <div class="product-hero__copy">
          <nav class="breadcrumb" aria-label="面包屑">
            <NuxtLink to="/">首页</NuxtLink>
            <span aria-hidden="true">/</span>
            <NuxtLink to="/products">产品中心</NuxtLink>
            <span aria-hidden="true">/</span>
            <span>{{ product.name }}</span>
          </nav>
          <BaseTag tone="concept">{{ product.status }}</BaseTag>
          <h1 id="product-title">{{ product.name }}</h1>
          <p class="product-hero__headline">{{ product.headline }}</p>
          <p class="product-hero__summary">{{ product.summary }}</p>
          <div class="product-hero__actions" aria-label="产品页主要操作">
            <BaseButton to="/demo" size="lg">
              预约演示
              <template #iconRight>
                <BaseIcon name="arrow-right" />
              </template>
            </BaseButton>
            <BaseButton to="#specifications" variant="secondary" size="lg">查看样机参数</BaseButton>
          </div>
          <div class="product-hero__tags" aria-label="产品核心能力">
            <BaseTag v-for="value in product.values" :key="value.id">{{ value.title }}</BaseTag>
          </div>
        </div>
        <div class="product-hero__visual">
          <BaseImage
            :src="product.cover"
            :alt="product.coverAlt"
            aspect-ratio="3 / 2"
            radius="lg"
            priority
            concept
          />
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="values"
      :ref="register"
      tag="section"
      class="product-section value-section"
      width="wide"
      aria-labelledby="values-title"
    >
      <SectionHeading
        id="values-title"
        title="三项核心价值"
        description="当前阶段只呈现智能项圈最核心的产品方向，其他功能留待样机和真实测试确认后再扩展。"
      />
      <div class="value-grid">
        <article v-for="item in product.values" :key="item.id" class="value-card">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </BaseContainer>

    <section
      id="ecosystem"
      :ref="register"
      class="product-section ecosystem-section"
      aria-labelledby="ecosystem-title"
    >
      <BaseContainer width="wide">
        <div class="ecosystem-layout">
          <div class="ecosystem-layout__copy">
            <SectionHeading
              id="ecosystem-title"
              title="设备、App 与平台协同"
              description="智能项圈不独立承诺结果，而是与知宠 App 和健康管理平台共同形成记录、提醒与服务连接。"
            />
            <ol class="ecosystem-steps">
              <li v-for="item in product.ecosystem" :key="item.id">
                <span class="icon-shell" aria-hidden="true">
                  <BaseIcon :name="item.icon" />
                </span>
                <div>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                </div>
              </li>
            </ol>
          </div>
          <BaseImage
            src="/images/concepts/collar-ecosystem.svg"
            alt="知宠智能项圈连接 App 与健康管理平台的协同概念视觉"
            aspect-ratio="16 / 10"
            radius="lg"
            concept
          />
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="scenarios"
      :ref="register"
      tag="section"
      class="product-section scenario-section"
      width="wide"
      aria-labelledby="scenarios-title"
    >
      <SectionHeading
        id="scenarios-title"
        title="使用场景"
        description="同一设备能力在家庭、医院和门店中承担不同角色，页面不展示套餐价格或购买入口。"
      />
      <div class="scenario-list">
        <article v-for="item in product.scenarios" :key="item.id" class="scenario-item">
          <span class="icon-shell" aria-hidden="true">
            <BaseIcon :name="item.icon" />
          </span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </div>
    </BaseContainer>

    <section
      id="specifications"
      :ref="register"
      class="product-section specs-section"
      aria-labelledby="specifications-title"
    >
      <BaseContainer width="wide">
        <div class="specs-layout">
          <SectionHeading
            id="specifications-title"
            title="技术参数"
            description="以下为样机参数展示口径，不作为最终硬件承诺；真实参数将在项目方确认后更新。"
          />
          <div class="specs-table-wrap">
            <table class="specs-table">
              <caption>
                知宠智能项圈样机参数，仅供展示
              </caption>
              <tbody>
                <tr v-for="item in product.specifications" :key="item.label">
                  <th scope="row">{{ item.label }}</th>
                  <td>
                    <strong>{{ item.value }}</strong>
                    <span v-if="item.note">{{ item.note }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </BaseContainer>
    </section>

    <BaseContainer
      id="process"
      :ref="register"
      tag="section"
      class="product-section process-section"
      width="wide"
      aria-labelledby="process-title"
    >
      <SectionHeading
        id="process-title"
        title="使用流程"
        description="从佩戴到查看趋势，流程保持清晰和克制，后续再接入真实设备绑定和服务表单。"
      />
      <ol class="process-list">
        <li v-for="item in product.process" :key="item.id">
          <span>{{ item.order }}</span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ol>
    </BaseContainer>

    <CTASection
      title="了解知宠智能项圈的合作与演示计划"
      description="预约产品演示，确认样机能力、适用场景和下一步合作方式。"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.product-page {
  overflow: hidden;
}

.product-hero {
  padding-block: var(--space-8) var(--space-7);
}

.product-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 0.78fr);
  gap: var(--space-8);
  align-items: center;
}

.product-hero__copy {
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

.product-hero h1 {
  max-width: 660px;
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: 0;
}

.product-hero__headline {
  color: var(--color-brand-800);
  font-size: 24px;
  font-weight: 750;
}

.product-hero__summary {
  max-width: 680px;
  color: var(--color-text-secondary);
  font-size: 17px;
}

.product-hero__actions,
.product-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.product-hero__visual {
  position: relative;
}

.product-hero__visual::before {
  position: absolute;
  inset: -18px 24px 24px -18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  content: '';
}

.product-hero__visual :deep(.base-image) {
  box-shadow: 0 24px 64px rgb(47 36 27 / 10%);
}

.product-section {
  @include section-spacing;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.value-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.value-card p,
.ecosystem-steps p,
.scenario-item p,
.process-list p {
  color: var(--color-text-secondary);
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

.ecosystem-section,
.specs-section {
  background: var(--color-surface-soft);
}

.ecosystem-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.76fr) minmax(420px, 1fr);
  gap: var(--space-8);
  align-items: center;
}

.ecosystem-layout__copy {
  min-width: 0;
}

.ecosystem-steps {
  display: grid;
  gap: var(--space-4);
  padding: 0;
  margin: 0;
  list-style: none;
}

.ecosystem-steps li,
.scenario-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4);
  align-items: start;
  padding-block: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.ecosystem-steps li:first-child,
.scenario-item:first-child {
  padding-top: 0;
}

.ecosystem-steps h3,
.scenario-item h3 {
  margin-bottom: var(--space-2);
}

.scenario-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.scenario-item {
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.specs-layout {
  display: grid;
  gap: var(--space-2);
}

.specs-table-wrap {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-media);
  background: var(--color-surface);
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table caption {
  padding: var(--space-4) var(--space-5);
  color: var(--color-accent-600);
  font-size: 14px;
  font-weight: 750;
  text-align: left;
}

.specs-table tr {
  border-top: 1px solid var(--color-border);
}

.specs-table th,
.specs-table td {
  padding: var(--space-4) var(--space-5);
  text-align: left;
  vertical-align: top;
}

.specs-table th {
  width: 220px;
  color: var(--color-brand-900);
  font-size: 15px;
  font-weight: 750;
}

.specs-table td {
  color: var(--color-text-secondary);
}

.specs-table td strong {
  display: block;
  color: var(--color-text);
  font-weight: 650;
}

.specs-table td span {
  display: block;
  margin-top: var(--space-1);
  font-size: 13px;
}

.process-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  padding: 0;
  margin: 0;
  list-style: none;
}

.process-list li {
  display: grid;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.process-list span {
  color: var(--color-accent-600);
  font-size: 15px;
  font-weight: 800;
}

@media (max-width: 1100px) {
  .product-hero__inner,
  .ecosystem-layout {
    grid-template-columns: 1fr;
  }

  .product-hero h1 {
    font-size: 44px;
  }
}

@media (max-width: 820px) {
  .product-hero {
    padding-block: var(--space-7);
  }

  .product-hero h1 {
    font-size: 38px;
  }

  .product-hero__headline {
    font-size: 20px;
  }

  .value-grid,
  .scenario-list,
  .process-list {
    grid-template-columns: 1fr;
  }

  .specs-table,
  .specs-table tbody,
  .specs-table tr,
  .specs-table th,
  .specs-table td {
    display: block;
    width: 100%;
  }

  .specs-table th {
    padding-bottom: var(--space-1);
  }

  .specs-table td {
    padding-top: 0;
  }
}

@media (max-width: 560px) {
  .product-hero {
    padding-block: var(--space-6) var(--space-5);
  }

  .product-hero__copy {
    gap: var(--space-3);
  }

  .product-hero h1 {
    font-size: 34px;
  }

  .product-hero__summary {
    font-size: 15px;
  }

  .product-hero__actions :deep(.base-button) {
    width: 100%;
  }

  .product-hero__tags {
    gap: var(--space-2);
  }

  .product-hero__visual {
    width: min(100%, 280px);
    margin-inline: auto;
  }

  .product-hero__visual::before {
    inset: -12px 16px 16px -12px;
  }

  .ecosystem-steps li,
  .scenario-item {
    grid-template-columns: 1fr;
  }
}
</style>

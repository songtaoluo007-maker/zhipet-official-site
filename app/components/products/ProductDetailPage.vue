<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import BaseContainer from '~/components/base/BaseContainer.vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import BaseImage from '~/components/base/BaseImage.vue'
import BaseTag from '~/components/base/BaseTag.vue'
import CTASection from '~/components/common/CTASection.vue'
import SectionHeading from '~/components/common/SectionHeading.vue'
import type { ProductDetail } from '~/types/product'

const props = defineProps<{
  product: ProductDetail
}>()

const { register } = useScrollReveal()

const product = props.product

const productSignalFlow = [
  {
    label: '输入',
    title: '采集日常信号',
    description: '围绕声音、活动、照护记录和主人反馈形成可回看的连续线索。',
  },
  {
    label: '分析',
    title: '综合多模态信息',
    description: '结合设备、App 和 PetSense 引擎，推测可能状态并保留不确定性。',
  },
  {
    label: '输出',
    title: '呈现依据与建议',
    description: '向用户展示可能状态、分析依据、趋势提示和下一步观察重点。',
  },
  {
    label: '边界',
    title: '等待真实确认',
    description: '参数、上线版本、权限和数据规则以项目方后续确认资料为准。',
  },
]
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
            <BaseButton
              :to="product.secondaryAction?.to ?? '#specifications'"
              variant="text"
              size="lg"
            >
              {{ product.secondaryAction?.label ?? '查看规划参数' }}
            </BaseButton>
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
            label-placement="below"
          />
          <div class="product-hero__status-panel" aria-label="产品确认状态">
            <span>当前阶段</span>
            <strong>{{ product.status }}</strong>
            <p>真实参数、上线版本和能力边界以项目方确认资料为准。</p>
          </div>
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
        title="产品如何形成参考"
        :description="`${product.name}当前先讲清输入、分析、输出和边界，避免把规划能力包装成确定承诺。`"
      />
      <div class="signal-flow-grid" aria-label="产品信号处理链路">
        <article v-for="item in productSignalFlow" :key="item.label" class="signal-flow-card">
          <span>{{ item.label }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
      <div class="value-grid" aria-label="产品核心价值">
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
              :title="product.ecosystemTitle ?? '设备、App 与平台协同'"
              :description="
                product.ecosystemDescription ??
                '知宠产品不独立包装结果承诺，而是与设备、App 和健康管理平台共同形成记录、提醒与服务连接。'
              "
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
            :src="product.cover"
            :alt="product.coverAlt"
            aspect-ratio="16 / 10"
            radius="lg"
            concept
            label-placement="below"
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
        description="同一产品能力在家庭、医院、门店与合作机构中承担不同角色，页面不展示套餐价格或购买入口。"
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
            description="以下为当前规划展示口径，不作为最终产品承诺；真实参数将在项目方确认后更新。"
          />
          <div class="specs-table-wrap">
            <table class="specs-table">
              <caption>
                {{ product.specificationsCaption }}
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
        description="流程保持清晰和克制，后续再接入真实设备绑定、账号体系和服务表单。"
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
      :title="`了解${product.name}的演示与合作计划`"
      description="预约产品演示，确认当前能力、适用场景和下一步合作方式。"
      secondary-label="返回产品中心"
      secondary-to="/products"
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
  text-wrap: balance;
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
  line-height: 1.72;
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

.product-hero__visual :deep(.base-image__frame) {
  box-shadow: 0 24px 64px rgb(47 36 27 / 10%);
}

.product-hero__status-panel {
  position: absolute;
  right: var(--space-5);
  bottom: var(--space-7);
  display: grid;
  max-width: 280px;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgb(200 138 56 / 24%);
  border-radius: var(--radius-button);
  background: rgb(255 255 255 / 90%);
}

.product-hero__status-panel span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 750;
}

.product-hero__status-panel strong {
  color: var(--color-brand-900);
}

.product-hero__status-panel p {
  color: var(--color-text-secondary);
  font-size: 13px;
}

.product-section {
  @include section-spacing;
}

.signal-flow-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.signal-flow-card {
  display: grid;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.signal-flow-card span {
  color: var(--color-accent-600);
  font-size: 13px;
  font-weight: 800;
}

.signal-flow-card p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.value-card {
  @include subtle-lift(-1px);

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
  @include subtle-lift(-1px);

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
  .signal-flow-grid,
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
    margin-inline: auto;
  }

  .product-hero__visual::before {
    inset: -12px 16px 16px -12px;
  }

  .product-hero__status-panel {
    position: static;
    margin-top: var(--space-3);
  }

  .ecosystem-steps li,
  .scenario-item {
    grid-template-columns: 1fr;
  }
}
</style>

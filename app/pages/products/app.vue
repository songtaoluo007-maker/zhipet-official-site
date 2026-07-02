<script setup lang="ts">
import ProductDetailPage from '~/components/products/ProductDetailPage.vue'
import { zhipetAppProduct as product } from '~/data/products'

useSeoMeta({
  title: `${product.name} | 知宠 ZHIPET`,
  description: `${product.name}${product.headline}，规划健康档案、趋势记录、提醒协作与复诊资料整理。当前功能以项目方确认为准。`,
  ogTitle: `${product.name} | 知宠 ZHIPET`,
  ogDescription: product.summary,
  ogType: 'website',
})
</script>

<template>
  <ProductDetailPage :product="product" />
</template>
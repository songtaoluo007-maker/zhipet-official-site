<script setup lang="ts">
import ProductDetailPage from '~/components/products/ProductDetailPage.vue'
import { smartCollarProduct as product } from '~/data/products'

useSeoMeta({
  title: `${product.name} | 知宠 ZHIPET`,
  description: `${product.name}${product.headline}，探索宠物声音采集、动作与活动趋势记录、行为姿态感知和定位与安全提醒。当前参数以样机展示和项目方确认为准。`,
  ogTitle: `${product.name} | 知宠 ZHIPET`,
  ogDescription: product.summary,
  ogType: 'website',
})
</script>

<template>
  <ProductDetailPage :product="product" />
</template>
<script setup lang="ts">
import ProductDetailPage from '~/components/products/ProductDetailPage.vue'
import { healthPlatformProduct as product } from '~/data/products'

useSeoMeta({
  title: `${product.name} | 知宠 ZHIPET`,
  description: `${product.name}${product.headline}，探索设备数据接入、服务流程记录和运营辅助能力。当前部署方式以项目方确认为准。`,
  ogTitle: `${product.name} | 知宠 ZHIPET`,
  ogDescription: product.summary,
  ogType: 'website',
})
</script>

<template>
  <ProductDetailPage :product="product" />
</template>
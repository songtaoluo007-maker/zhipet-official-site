<script setup lang="ts">
import ProductDetailPage from '~/components/products/ProductDetailPage.vue'
import { smartCollarProduct as product } from '~/data/products'

useSeoMeta({
  title: `${product.name} | 知宠 ZHIPET`,
  description: `${product.name}${product.headline}，围绕宠物声音、动作、活动趋势、行为姿态与位置线索提供日常观察和安全提醒。`,
  ogTitle: `${product.name} | 知宠 ZHIPET`,
  ogDescription: product.summary,
  ogType: 'website',
})
</script>

<template>
  <ProductDetailPage :product="product" />
</template>

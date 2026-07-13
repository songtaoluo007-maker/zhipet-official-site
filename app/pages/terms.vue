<script setup lang="ts">
import LegalDocumentPage from '~/components/corporate/LegalDocumentPage.vue'
import { legalDocuments } from '~/data/corporate'

const document = legalDocuments.find((item) => item.slug === 'terms')!

useSeoMeta({
  title: '使用条款 | 知宠 ZHIPET',
  description: '了解知宠官网的服务范围、使用边界、内容说明和联系路径。',
  ogTitle: '使用条款 | 知宠 ZHIPET',
  ogDescription: document.status,
  ogType: 'website',
})
</script>

<template>
  <LegalDocumentPage :document="document" />
</template>

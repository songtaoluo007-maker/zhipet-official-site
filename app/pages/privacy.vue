<script setup lang="ts">
import LegalDocumentPage from '~/components/corporate/LegalDocumentPage.vue'
import { legalDocuments } from '~/data/corporate'

const document = legalDocuments.find((item) => item.slug === 'privacy')!

useSeoMeta({
  title: '隐私政策 | 知宠 ZHIPET',
  description: '知宠 ZHIPET 隐私政策占位页。正式隐私政策需由项目方和法务确认后发布。',
  ogTitle: '隐私政策 | 知宠 ZHIPET',
  ogDescription: document.status,
  ogType: 'website',
})
</script>

<template>
  <LegalDocumentPage :document="document" />
</template>

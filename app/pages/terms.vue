<script setup lang="ts">
import LegalDocumentPage from '~/components/corporate/LegalDocumentPage.vue'
import { legalDocuments } from '~/data/corporate'

const document = legalDocuments.find((item) => item.slug === 'terms')!

useSeoMeta({
  title: '服务条款 | 知宠 ZHIPET',
  description: '知宠 ZHIPET 服务条款占位页。正式服务条款需由项目方和法务确认后发布。',
  ogTitle: '服务条款 | 知宠 ZHIPET',
  ogDescription: document.status,
  ogType: 'website',
})
</script>

<template>
  <LegalDocumentPage :document="document" />
</template>

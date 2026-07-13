<script setup lang="ts">
import LegalDocumentPage from '~/components/corporate/LegalDocumentPage.vue'
import { legalDocuments } from '~/data/corporate'

const document = legalDocuments.find((item) => item.slug === 'privacy')!

useSeoMeta({
  title: '隐私说明 | 知宠 ZHIPET',
  description: '了解知宠官网处理意见反馈与邮件联系信息的目的、保存期限、安全措施和个人权利路径。',
  ogTitle: '隐私说明 | 知宠 ZHIPET',
  ogDescription: document.status,
  ogType: 'website',
})
</script>

<template>
  <LegalDocumentPage :document="document" />
</template>

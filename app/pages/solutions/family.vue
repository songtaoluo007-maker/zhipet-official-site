<script setup lang="ts">
import SolutionDetailPage from '~/components/solutions/SolutionDetailPage.vue'
import { familySolution as solution } from '~/data/solutions'

useSeoMeta({
  title: `${solution.title} | 知宠 ZHIPET`,
  description: `${solution.title}${solution.headline}，连接智能挂件、知宠 App 与 PetSense 多模态分析。`,
  ogTitle: `${solution.title} | 知宠 ZHIPET`,
  ogDescription: solution.summary,
  ogType: 'website',
})
</script>

<template>
  <SolutionDetailPage :solution="solution" />
</template>

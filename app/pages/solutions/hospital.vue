<script setup lang="ts">
import SolutionDetailPage from '~/components/solutions/SolutionDetailPage.vue'
import { hospitalSolution as solution } from '~/data/solutions'

useSeoMeta({
  title: `${solution.title} | 知宠 ZHIPET`,
  description: `${solution.title}${solution.headline}，面向院外健康记录、复诊沟通与授权协同。`,
  ogTitle: `${solution.title} | 知宠 ZHIPET`,
  ogDescription: solution.summary,
  ogType: 'website',
})
</script>

<template>
  <SolutionDetailPage :solution="solution" />
</template>

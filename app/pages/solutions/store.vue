<script setup lang="ts">
import SolutionDetailPage from '~/components/solutions/SolutionDetailPage.vue'
import { storeSolution as solution } from '~/data/solutions'

useSeoMeta({
  title: `${solution.title} | 知宠 ZHIPET`,
  description: `${solution.title}${solution.headline}，面向会员健康服务、提醒触达和照护记录归档。真实合作信息待项目方确认。`,
  ogTitle: `${solution.title} | 知宠 ZHIPET`,
  ogDescription: solution.summary,
  ogType: 'website',
})
</script>

<template>
  <SolutionDetailPage :solution="solution" />
</template>

<script setup lang="ts">
const route = useRoute()
const requestUrl = useRequestURL()
const runtimeConfig = useRuntimeConfig()

const siteOrigin = computed(() =>
  resolveSiteOrigin(runtimeConfig.public.siteUrl, requestUrl.origin),
)
const canonicalUrl = computed(() => resolveAbsoluteUrl(route.path, siteOrigin.value))
const shareImageUrl = computed(() => createShareImageUrl(siteOrigin.value))

useSeoMeta({
  ogSiteName: '知宠 ZHIPET',
  ogLocale: 'zh_CN',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => shareImageUrl.value,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: '知宠 ZHIPET 官网分享图',
  twitterCard: 'summary_large_image',
  twitterImage: () => shareImageUrl.value,
  twitterImageAlt: '知宠 ZHIPET 官网分享图',
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: () => canonicalUrl.value,
    },
  ],
  meta: [
    { name: 'theme-color', content: '#faf8f4' },
    { name: 'format-detection', content: 'telephone=no,address=no,email=no' },
  ],
  script: [
    {
      key: 'jsonld-website',
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(createWebSiteJsonLd(siteOrigin.value)),
    },
    {
      key: 'jsonld-organization',
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(createOrganizationJsonLd(siteOrigin.value)),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

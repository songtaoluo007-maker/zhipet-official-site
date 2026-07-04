const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  ?.env

export default defineNuxtConfig({
  compatibilityDate: '2026-07-02',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts', '@nuxt/eslint'],
  components: [{ path: './app/components', pathPrefix: false }],
  css: ['~/assets/styles/main.scss'],
  runtimeConfig: {
    public: {
      siteUrl: '',
    },
  },
  app: {
    baseURL: nodeEnv?.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      title: '知宠 ZHIPET',
      meta: [
        {
          name: 'description',
          content: '知宠 ZHIPET 企业级官方网站工程底座。',
        },
        { property: 'og:title', content: '知宠 ZHIPET' },
        {
          property: 'og:description',
          content: '以温暖、专业、可信的方式展示宠物健康科技能力。',
        },
        { property: 'og:type', content: 'website' },
      ],
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  fonts: {
    provider: 'none',
  },
  content: {
    experimental: {
      sqliteConnector: 'native',
    },
  },
  nitro: {
    prerender: {
      routes: ['/robots.txt', '/sitemap.xml'],
    },
  },
  image: {
    format: ['webp', 'avif'],
    quality: 82,
  },
})

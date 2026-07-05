const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  ?.env
const rawAppBaseURL = nodeEnv?.NUXT_APP_BASE_URL || '/'
const appBaseURL = rawAppBaseURL.endsWith('/') ? rawAppBaseURL : `${rawAppBaseURL}/`

export default defineNuxtConfig({
  compatibilityDate: '2026-07-02',
  devtools: { enabled: nodeEnv?.NUXT_DEVTOOLS === 'true' },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts', '@nuxt/eslint'],
  components: [{ path: './app/components', pathPrefix: false }],
  css: ['~/assets/styles/main.scss'],
  runtimeConfig: {
    public: {
      siteUrl: '',
    },
  },
  app: {
    baseURL: appBaseURL,
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${appBaseURL}favicon.svg` },
        { rel: 'manifest', href: `${appBaseURL}site.webmanifest` },
      ],
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
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: [
        '/robots.txt',
        '/sitemap.xml',
        '/news',
        '/news/product-direction',
        '/news/scenario-research',
        '/news/brand-progress',
        '/partners',
        '/contact',
        '/ai-pet-understanding',
        '/cases',
        '/products/smart-collar',
        '/products/app',
        '/products/health-platform',
      ],
    },
    routeRules: {
      '/_nuxt/**': {
        headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      },
      '/images/**': {
        headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' },
      },
      '/favicon.svg': {
        headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' },
      },
    },
  },
  image: {
    format: ['webp', 'avif'],
    quality: 82,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1200,
      xxl: 1320,
    },
    densities: [1, 2],
  },
})

import { dataGovernance } from './shared/constants/data-governance'

const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  ?.env
const rawAppBaseURL = nodeEnv?.NUXT_APP_BASE_URL || '/'
const appBaseURL = rawAppBaseURL.endsWith('/') ? rawAppBaseURL : `${rawAppBaseURL}/`
const lifecycleEvent = nodeEnv?.npm_lifecycle_event || 'runtime'
const isolatedBuildEvents = new Set(['build', 'generate', 'typecheck'])
const nuxtBuildDir = isolatedBuildEvents.has(lifecycleEvent) ? `.nuxt-${lifecycleEvent}` : '.nuxt'
const contentCacheScope = lifecycleEvent.replace(/[^a-z0-9_-]+/gi, '-')
const contentLocalDatabase = `.data/content/contents-${contentCacheScope}.sqlite`
const isProduction = nodeEnv?.NODE_ENV === 'production'
const featureFlag = (value: string | undefined, fallback: boolean) =>
  value === undefined ? fallback : value === 'true'
const feedbackEnabled = featureFlag(nodeEnv?.NUXT_PUBLIC_FEEDBACK_ENABLED, !isProduction)
const appDownloadEnabled = featureFlag(nodeEnv?.NUXT_PUBLIC_APP_DOWNLOAD_ENABLED, false)

export default defineNuxtConfig({
  compatibilityDate: '2026-07-02',
  buildDir: nuxtBuildDir,
  devtools: { enabled: nodeEnv?.NUXT_DEVTOOLS === 'true' },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts', '@nuxt/eslint'],
  components: [{ path: './app/components', pathPrefix: false }],
  css: ['~/assets/styles/main.scss'],
  runtimeConfig: {
    privacyPolicyVersion: dataGovernance.privacyVersion,
    termsVersion: dataGovernance.termsVersion,
    public: {
      siteUrl: '',
      feedbackEnabled,
      appDownload: {
        enabled: appDownloadEnabled,
        iosUrl: nodeEnv?.NUXT_PUBLIC_APP_DOWNLOAD_IOS_URL || '',
        androidUrl: nodeEnv?.NUXT_PUBLIC_APP_DOWNLOAD_ANDROID_URL || '',
        allowedHosts:
          nodeEnv?.NUXT_PUBLIC_APP_DOWNLOAD_ALLOWED_HOSTS ||
          'apps.apple.com,testflight.apple.com',
        version: nodeEnv?.NUXT_PUBLIC_APP_DOWNLOAD_VERSION || '',
        publishedAt: nodeEnv?.NUXT_PUBLIC_APP_DOWNLOAD_PUBLISHED_AT || '',
        androidSha256: nodeEnv?.NUXT_PUBLIC_APP_DOWNLOAD_ANDROID_SHA256 || '',
      },
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
          content: '知宠 ZHIPET 宠物健康科技官网。',
        },
        { property: 'og:title', content: '知宠 ZHIPET' },
        {
          property: 'og:description',
          content: '围绕宠物安全、健康趋势与状态理解，连接家庭照护与专业服务。',
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
    _localDatabase: {
      type: 'sqlite',
      filename: contentLocalDatabase,
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },
  nitro: {
    compressPublicAssets: false,
    prerender: {
      crawlLinks: true,
      routes: [
        '/robots.txt',
        '/sitemap.xml',
        '/news',
        '/news/product-direction',
        '/news/scenario-research',
        '/news/brand-progress',
        '/contact',
        '/download',
        '/ai-pet-understanding',
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
      '/login': {
        redirect: { to: '/', statusCode: 301 },
      },
      '/account/**': {
        redirect: { to: '/', statusCode: 301 },
      },
      '/account': {
        redirect: { to: '/', statusCode: 301 },
      },
      '/admin': {
        redirect: { to: '/contact', statusCode: 301 },
      },
      '/demo': {
        redirect: { to: '/contact', statusCode: 301 },
      },
      '/cases': {
        redirect: { to: '/solutions', statusCode: 301 },
      },
      '/partners': {
        redirect: { to: '/solutions', statusCode: 301 },
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

import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    }),
    news: defineCollection({
      type: 'page',
      source: 'news/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishedAt: z.string().optional(),
      }),
    }),
    cases: defineCollection({
      type: 'page',
      source: 'cases/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        authorized: z.boolean().default(false),
      }),
    }),
  },
})

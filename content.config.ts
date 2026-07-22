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
    research: defineCollection({
      type: 'page',
      source: 'research/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.string().default('内容规划'),
        publishedLabel: z.string().default('知宠研究院'),
        status: z.string().default('专题文章'),
        order: z.number().default(999),
        tags: z.array(z.string()).default([]),
        publishedAt: z.string().optional(),
        sources: z.array(z.object({
          title: z.string(),
          authors: z.string().optional(),
          publication: z.string(),
          year: z.number(),
          url: z.string().url(),
          note: z.string().optional(),
        })).min(1),
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

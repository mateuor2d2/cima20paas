import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'sites/**/pages/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        site: z.string(),
        navOrder: z.number().optional(),
        hero: z.boolean().default(false),
      })
    }),
    posts: defineCollection({
      type: 'page',
      source: 'sites/**/posts/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        site: z.string(),
        date: z.date(),
        tags: z.array(z.string()).optional(),
        author: z.string().optional(),
        image: z.string().optional(),
      })
    }),
    site_config: defineCollection({
      type: 'data',
      source: 'sites/**/config.yml',
      schema: z.object({
        site: z.string(),
        name: z.string(),
        tagline: z.string().optional(),
        theme: z.string().default('default'),
        primaryColor: z.string().default('blue'),
        navigation: z.array(z.object({
          label: z.string(),
          to: z.string(),
          icon: z.string().optional(),
          children: z.array(z.object({
            label: z.string(),
            to: z.string(),
          })).optional(),
        })).optional(),
        footer: z.object({
          text: z.string(),
          links: z.array(z.object({
            label: z.string(),
            to: z.string(),
          })).optional(),
        }).optional(),
      })
    })
  }
})

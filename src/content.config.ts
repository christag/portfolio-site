import { defineCollection, z } from 'astro:content';

// Define the bio collection schema
const bioCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
      openGraph: z.object({
        title: z.string(),
        description: z.string(),
        type: z.string(),
        image: z.string().optional(),
      }),
      twitter: z.object({
        card: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
      }),
    }),
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      animation: z.string(),
      background: z.string(),
    }),
    profile: z.object({
      name: z.string(),
      title: z.string(),
      location: z.string(),
      status: z.string(),
      personality: z.record(z.string(), z.string()),
    }),
    social: z.object({
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      email: z.string().email().optional(),
      portfolio: z.string().url().optional(),
    }),
  }),
});

// Export the collections
export const collections = {
  bio: bioCollection,
};

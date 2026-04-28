import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cheatsheets = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/cheatsheets" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    createdAt: z.union([z.string(), z.date()]).optional().transform(v => v instanceof Date ? v.toISOString().split('T')[0] : v),
    updatedAt: z.union([z.string(), z.date()]).optional().transform(v => v instanceof Date ? v.toISOString().split('T')[0] : v),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    icon: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  'cheatsheets': cheatsheets,
};

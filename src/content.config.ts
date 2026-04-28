import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cheatsheets = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/cheatsheets" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  'cheatsheets': cheatsheets,
};

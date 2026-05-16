// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { rehypeAquaIcons } from './src/plugins/rehype-aqua-icons.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ai-cheatsheets.vercel.app',
  markdown: {
    rehypePlugins: [rehypeAquaIcons],
  },
  integrations: [mdx(), sitemap()]
});
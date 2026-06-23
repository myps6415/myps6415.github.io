import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkCjkFriendly from 'remark-cjk-friendly';

export default defineConfig({
  site: 'https://myps6415.github.io',
  // remark-cjk-friendly: lets **粗體** / *斜體* parse when adjacent to CJK
  // characters (CommonMark's flanking rules otherwise refuse to close the
  // delimiter next to a Chinese glyph, leaking literal ** into the output).
  markdown: { remarkPlugins: [remarkCjkFriendly] },
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

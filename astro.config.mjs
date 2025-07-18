import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.christagliaferro.com',
  integrations: [sitemap()],
  vite: {
    plugins: [
      tailwindcss(), // Native Tailwind v4 Vite plugin handles everything
    ],
  },
  markdown: {
    syntaxHighlight: false, // Disable syntax highlighting
  },
});

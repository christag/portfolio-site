import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.christagliaferro.com',
  output: 'static', // Static site generation
  integrations: [sitemap()],
  vite: {
    plugins: [
      tailwindcss(), // Native Tailwind v4 Vite plugin handles everything
    ],
  },
  markdown: {
    syntaxHighlight: false, // Disable syntax highlighting
  },
  build: {
    format: 'file', // Generate .html files for better compatibility
    assets: '_astro', // Asset directory
  },
  // Environment variable configuration for build-time data fetching
  env: {
    schema: {
      STRAPI_URL: {
        context: 'server',
        access: 'public',
        type: 'string',
        default: 'http://localhost:1337'
      },
      STRAPI_API_TOKEN: {
        context: 'server',
        access: 'secret',
        type: 'string'
      }
    }
  }
});

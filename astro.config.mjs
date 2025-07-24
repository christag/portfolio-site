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
    build: {
      // Optimize build for better caching and module loading
      rollupOptions: {
        output: {
          // Create separate chunks for better caching
          manualChunks: {
            // Separate vendor code for long-term caching
            vendor: ['astro/runtime'],
            // Separate utilities for better cache efficiency
            utils: ['src/lib/strapi.ts', 'src/lib/content.ts'],
          },
          // Ensure consistent file naming for better caching
          entryFileNames: '_astro/[name].[hash].js',
          chunkFileNames: '_astro/[name].[hash].js',
          assetFileNames: '_astro/[name].[hash][extname]',
        },
      },
      // Improve module resolution
      target: 'es2020',
      minify: 'esbuild',
    },
    // Improve module resolution for development
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
  markdown: {
    syntaxHighlight: false, // Disable syntax highlighting
  },
  build: {
    format: 'file', // Generate .html files for better compatibility - RESTORED to match main
    assets: '_astro', // Asset directory
    // Enable asset inlining for small assets to reduce requests
    inlineStylesheets: 'auto',
    // Split CSS for better caching
    split: true,
  },
  // Prefetch configuration for better performance - TEMPORARILY DISABLED
  // prefetch: {
  //   prefetchAll: true, // Prefetch all internal links
  //   defaultStrategy: 'viewport', // Prefetch when links enter viewport
  // },
  // Environment variable configuration for build-time data fetching
  env: {
    schema: {
      STRAPI_URL: {
        context: 'server',
        access: 'public',
        type: 'string',
        default: 'http://localhost:1337',
      },
      PUBLIC_STRAPI_URL: {
        context: 'client',
        access: 'public',
        type: 'string',
        default: 'http://localhost:1337',
      },
      STRAPI_API_TOKEN: {
        context: 'server',
        access: 'secret',
        type: 'string',
      },

      STRAPI_CACHE_TTL_MS: {
        context: 'server',
        access: 'public',
        type: 'string',
        default: '300000', // 5 minutes default
      },
      ENABLE_BUILD_CACHE: {
        context: 'server',
        access: 'public',
        type: 'string',
        default: 'true',
      },
    },
  },
});

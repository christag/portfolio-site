import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.christagliaferro.com',
  output: 'static', // Static site generation
  integrations: [
    sitemap({
      // Generate sitemap with proper priority and changefreq for caching
      customPages: [
        'https://www.christagliaferro.com/',
        'https://www.christagliaferro.com/services',
        'https://www.christagliaferro.com/portfolio',
        'https://www.christagliaferro.com/i-am',
      ],
      serialize(item) {
        // Set cache-friendly priorities and change frequencies
        if (item.url === 'https://www.christagliaferro.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/portfolio')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/services')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
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
    format: 'directory', // Generate clean URLs with index.html files
    assets: '_astro', // Asset directory
    // Enable asset inlining for small assets to reduce requests
    inlineStylesheets: 'auto',
    // Split CSS for better caching
    split: true,
  },
  // Prefetch configuration for better performance
  prefetch: {
    prefetchAll: true, // Prefetch all internal links
    defaultStrategy: 'viewport', // Prefetch when links enter viewport
  },
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

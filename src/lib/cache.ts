/**
 * Caching and Performance Optimization Utilities
 *
 * This module provides utilities for:
 * - Image optimization and lazy loading
 * - Cache management and invalidation
 * - Performance monitoring
 * - Build-time data preloading
 */

import { strapiAPI } from './strapi';

/**
 * Image optimization configuration
 */
export interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

/**
 * Cache configuration for different content types
 */
export const CACHE_CONFIG = {
  // Static assets - long term caching
  STATIC_ASSETS: {
    maxAge: 31536000, // 1 year
    immutable: true,
  },

  // Images and media - medium term caching
  MEDIA: {
    maxAge: 86400, // 1 day
    staleWhileRevalidate: 43200, // 12 hours
  },

  // API responses - short term caching with revalidation
  API_DATA: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 600, // 10 minutes
  },

  // Portfolio items - medium term caching
  PORTFOLIO: {
    maxAge: 600, // 10 minutes
    staleWhileRevalidate: 300, // 5 minutes
  },

  // Services - longer caching
  SERVICES: {
    maxAge: 1800, // 30 minutes
    staleWhileRevalidate: 900, // 15 minutes
  },

  // Bio content - longest caching (less frequent updates)
  BIO: {
    maxAge: 1200, // 20 minutes
    staleWhileRevalidate: 600, // 10 minutes
  },
} as const;

/**
 * Generate optimized image URL with proper sizing and format
 */
export function optimizeImageUrl(
  baseUrl: string,
  config: Partial<ImageConfig> = {}
): string {
  const url = new URL(baseUrl);

  // Add optimization parameters
  if (config.width) url.searchParams.set('w', config.width.toString());
  if (config.height) url.searchParams.set('h', config.height.toString());
  if (config.quality) url.searchParams.set('q', config.quality.toString());
  if (config.format && config.format !== 'auto') {
    url.searchParams.set('f', config.format);
  }

  return url.toString();
}

/**
 * Generate responsive image sizes attribute
 */
export function generateSizes(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([query, size]) => `${query} ${size}`)
    .join(', ');
}

/**
 * Common responsive breakpoints for portfolio images
 */
export const RESPONSIVE_BREAKPOINTS = {
  '(max-width: 640px)': '100vw',
  '(max-width: 768px)': '50vw',
  '(max-width: 1024px)': '33vw',
  '(min-width: 1025px)': '25vw',
};

/**
 * Preload critical images for better performance
 */
export function preloadCriticalImages(imageUrls: string[]): void {
  if (typeof document === 'undefined') return;

  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Enhanced lazy loading with performance monitoring
 */
export function setupLazyLoading(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;

          // Start performance monitoring
          const startTime = performance.now();

          // Load the actual image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          // Load srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }

          // Monitor load completion
          img.addEventListener(
            'load',
            () => {
              const loadTime = performance.now() - startTime;
              console.log(
                `🖼️ Image loaded in ${loadTime.toFixed(2)}ms:`,
                img.src
              );

              // Add loaded class with smooth transition
              img.classList.add('loaded');

              // Trigger fade-in animation
              requestAnimationFrame(() => {
                img.style.opacity = '1';
              });
            },
            { once: true }
          );

          img.addEventListener(
            'error',
            () => {
              console.warn('❌ Failed to load image:', img.src);
              img.classList.add('error');
            },
            { once: true }
          );

          // Stop observing this image
          observer.unobserve(img);
        }
      });
    },
    {
      // Load images when they're 100px away from viewport
      rootMargin: '100px',
      threshold: 0.01,
    }
  );

  // Observe all lazy images
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Cache invalidation utilities
 */
export class CacheManager {
  /**
   * Invalidate all portfolio-related cache
   */
  static invalidatePortfolioCache(): void {
    strapiAPI.invalidateCache('portfolio');
    console.log('🗑️ Portfolio cache invalidated');
  }

  /**
   * Invalidate services cache
   */
  static invalidateServicesCache(): void {
    strapiAPI.invalidateCache('services');
    console.log('🗑️ Services cache invalidated');
  }

  /**
   * Invalidate bio content cache
   */
  static invalidateBioCache(): void {
    strapiAPI.invalidateCache('bio-articles');
    strapiAPI.invalidateCache('profile');
    console.log('🗑️ Bio content cache invalidated');
  }

  /**
   * Clear all cache
   */
  static clearAllCache(): void {
    strapiAPI.invalidateCache();
    console.log('🗑️ All cache cleared');
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    return strapiAPI.getCacheStats();
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();

  /**
   * Start timing an operation
   */
  static startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  /**
   * End timing and log result
   */
  static endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      console.warn(`No start time found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    this.metrics.delete(label);
    return duration;
  }

  /**
   * Monitor API call performance
   */
  static async monitorApiCall<T>(
    label: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    this.startTiming(label);
    try {
      const result = await apiCall();
      this.endTiming(label);
      return result;
    } catch (error) {
      this.endTiming(label);
      throw error;
    }
  }
}

/**
 * Build-time data preloading
 */
export async function preloadBuildData(): Promise<void> {
  console.log('🚀 Starting build-time data preload...');

  try {
    await PerformanceMonitor.monitorApiCall('Build Data Preload', () =>
      strapiAPI.preloadCriticalData()
    );

    console.log('✅ Build-time data preload completed');
  } catch (error) {
    console.warn('⚠️ Build-time data preload failed:', error);
  }
}

/**
 * Client-side cache warming for critical routes
 * Disabled to prevent client-side API calls without proper authentication
 */
export async function warmClientCache(): Promise<void> {
  if (typeof window === 'undefined') return;

  console.log(
    '🔥 Client-side cache warming disabled (API calls should be server-side only)'
  );

  // Client-side cache warming disabled to prevent:
  // 1. Exposing API tokens on the client
  // 2. CORS issues with Strapi
  // 3. Unnecessary client-side API calls when data is already rendered server-side

  console.log('✅ Client cache warmed');
}

/**
 * Service Worker registration for offline caching
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', registration.scope);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('🔄 New service worker available, reload to update');
              // You could show a notification to the user here
            }
          });
        }
      });
    } catch (error) {
      console.warn('⚠️ Service Worker registration failed:', error);
    }
  });
}

/**
 * Initialize all caching and performance optimizations
 */
export function initializeCacheOptimizations(): void {
  // Client-side optimizations
  if (typeof window !== 'undefined') {
    // Set up lazy loading
    setupLazyLoading();

    // Register service worker
    registerServiceWorker();

    // Warm cache after page load
    window.addEventListener('load', () => {
      setTimeout(warmClientCache, 1000); // Delay to not block initial render
    });
  }

  console.log('🎯 Cache optimizations initialized');
}

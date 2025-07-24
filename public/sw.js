/**
 * Service Worker for Caching and Performance Optimization
 *
 * Features:
 * - Static asset caching with versioning
 * - API response caching with TTL
 * - Image optimization and caching
 * - Offline fallbacks
 * - Background sync for data updates
 *
 * v1.3.5 - FOUC fix: static assets now use cache-first (stale-while-revalidate) to prevent CSS flash
 */

const CACHE_VERSION = 'v1.3.5'; // Bump version to force update after FOUC fix
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const OFFLINE_CACHE = `offline-${CACHE_VERSION}`;

// Cache TTL in milliseconds - made less aggressive
const CACHE_TTL = {
  STATIC: 86400000, // 1 day (reduced from 1 year)
  API: 300000, // 5 minutes
  IMAGES: 86400000, // 1 day
  OFFLINE: 604800000, // 1 week
};

// Assets to cache immediately - reduced critical assets
const CRITICAL_ASSETS = ['/', '/manifest.json'];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/services',
  '/api/portfolio',
  '/api/profile',
  '/api/settings',
  '/api/bio-articles',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    Promise.all([
      // Cache critical static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching critical assets');
        return cache
          .addAll(
            CRITICAL_ASSETS.map(
              (url) =>
                new Request(url, {
                  credentials: 'same-origin',
                  cache: 'no-cache', // Don't use browser cache during SW installation
                })
            )
          )
          .catch((error) => {
            console.warn('[SW] Failed to cache some critical assets:', error);
            // Don't fail installation if some assets can't be cached
          });
      }),

      // Cache offline fallback page
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.add('/404').catch((error) => {
          console.warn('[SW] Failed to cache offline fallback:', error);
        });
      }),
    ])
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Take control of all clients
      self.clients.claim(),
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Debug logging for icon requests
  if (
    url.pathname.includes('favicon') ||
    url.pathname.includes('apple-touch-icon')
  ) {
    console.log('[SW] Icon request intercepted:', url.pathname);
  }

  // Skip caching for _astro files during development to prevent corruption
  if (
    url.pathname.startsWith('/_astro/') &&
    url.hostname.includes('pages.dev')
  ) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' }).catch(() => {
        return new Response('Asset temporarily unavailable', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );
    return;
  }

  // For all images on pages.dev, bypass service worker completely to debug issues
  if (url.hostname.includes('pages.dev') && isImageRequest(url)) {
    console.log(
      '[SW] Bypassing all image caching for pages.dev:',
      url.pathname
    );
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          console.log(
            '[SW] Image fetch response:',
            url.pathname,
            response.status,
            response.statusText
          );
          return response;
        })
        .catch((error) => {
          console.warn('[SW] Image fetch failed:', url.pathname, error);
          // Return a proper 404 response
          return new Response('Image not found', {
            status: 404,
            statusText: 'Not Found',
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(url)) {
    // Only handle images for non-pages.dev domains (already handled above for pages.dev)
    if (!url.hostname.includes('pages.dev')) {
      event.respondWith(handleImageRequest(request));
    }
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  }
});

// Handle static assets (CSS, JS, fonts) - switch to cache-first (stale-while-revalidate)
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isExpired(cachedResponse, CACHE_TTL.STATIC)) {
    // Update cache in background
    fetch(request, { cache: 'no-cache' })
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, addTimestamp(networkResponse.clone()));
        }
      })
      .catch(() => {});
    return cachedResponse;
  }

  // Not in cache or expired, fetch from network
  try {
    const networkResponse = await fetch(request, { cache: 'no-cache' });
    if (networkResponse.ok) {
      cache.put(request, addTimestamp(networkResponse.clone()));
    }
    return networkResponse;
  } catch (error) {
    // Fallback to cache if available, even if expired
    if (cachedResponse) return cachedResponse;
    return new Response('Asset not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Handle API requests with caching and offline fallback
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);

  // Try cache first for GET requests
  if (request.method === 'GET') {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isExpired(cachedResponse, CACHE_TTL.API)) {
      // Return cached data immediately, then update in background
      updateAPICache(request, cache);
      return cachedResponse;
    }
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok && request.method === 'GET') {
      // Cache successful GET responses
      const responseToCache = addTimestamp(networkResponse.clone());
      cache.put(request, responseToCache).catch((error) => {
        console.warn('[SW] Failed to cache API response:', error);
      });
    }

    return networkResponse;
  } catch (error) {
    console.warn('[SW] API request failed:', request.url, error);

    // Return cached response if available
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback for critical APIs
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Content not available offline',
        cached: false,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle image requests with optimization
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);

  try {
    // Try network first for images to ensure they load properly
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful image responses
      const responseToCache = addTimestamp(networkResponse.clone());
      cache.put(request, responseToCache).catch((error) => {
        console.warn('[SW] Failed to cache image:', error);
      });
      return networkResponse;
    } else {
      console.warn(
        '[SW] Image request failed with status:',
        networkResponse.status,
        request.url
      );
      // Try cache if network request failed
      const cachedResponse = await cache.match(request);
      if (cachedResponse && !isExpired(cachedResponse, CACHE_TTL.IMAGES)) {
        return cachedResponse;
      }
      // Return the failed network response instead of a custom 503
      return networkResponse;
    }
  } catch (error) {
    console.warn('[SW] Image fetch failed:', request.url, error);

    // Try cache as fallback
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isExpired(cachedResponse, CACHE_TTL.IMAGES)) {
      return cachedResponse;
    }

    // Let the browser handle the error naturally
    return new Response('', {
      status: 503,
      statusText: 'Image temporarily unavailable',
    });
  }
}

// Handle navigation requests (HTML pages) - network first
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation - always get fresh content
    const networkResponse = await fetch(request, { cache: 'no-cache' });

    if (networkResponse.ok) {
      // Cache successful navigation responses
      const cache = await caches.open(STATIC_CACHE);
      const responseToCache = addTimestamp(networkResponse.clone());
      cache.put(request, responseToCache).catch((error) => {
        console.warn('[SW] Failed to cache navigation response:', error);
      });
    }

    return networkResponse;
  } catch (error) {
    console.warn('[SW] Navigation request failed:', request.url, error);

    // Try cached version
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback page
    const offlineCache = await caches.open(OFFLINE_CACHE);
    const offlineResponse = await offlineCache.match('/404');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Background API cache update
async function updateAPICache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = addTimestamp(networkResponse.clone());
      cache.put(request, responseToCache);
    }
  } catch (error) {
    console.warn('[SW] Background cache update failed:', request.url, error);
  }
}

// Utility functions
function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_astro/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf')
  );
}

function isAPIRequest(url) {
  return (
    url.pathname.startsWith('/api/') ||
    CACHEABLE_APIS.some((api) => url.pathname.startsWith(api))
  );
}

function isImageRequest(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|webp|avif|svg|ico)$/i);
}

function isNavigationRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept') &&
      request.headers.get('accept').includes('text/html'))
  );
}

function addTimestamp(response) {
  // Cannot modify response headers directly as they are immutable
  // Instead, create a new response with modified headers
  try {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('sw-cached-at', Date.now().toString());
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (error) {
    console.warn('[SW] Failed to add timestamp to response:', error);
    return response; // Return original response if modification fails
  }
}

function isExpired(response, ttl) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return true;

  const age = Date.now() - parseInt(cachedAt);
  return age > ttl;
}

// Background sync for data updates
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'portfolio-update') {
    event.waitUntil(syncPortfolioData());
  } else if (event.tag === 'services-update') {
    event.waitUntil(syncServicesData());
  }
});

// Sync portfolio data in background
async function syncPortfolioData() {
  try {
    const cache = await caches.open(API_CACHE);
    const response = await fetch('/api/portfolios?populate=*');

    if (response.ok) {
      const responseToCache = addTimestamp(response.clone());
      cache.put('/api/portfolios?populate=*', responseToCache);
      console.log('[SW] Portfolio data synced');
    }
  } catch (error) {
    console.error('[SW] Portfolio sync failed:', error);
  }
}

// Sync services data in background
async function syncServicesData() {
  try {
    const cache = await caches.open(API_CACHE);
    const response = await fetch('/api/services?populate=*');

    if (response.ok) {
      const responseToCache = addTimestamp(response.clone());
      cache.put('/api/services?populate=*', responseToCache);
      console.log('[SW] Services data synced');
    }
  } catch (error) {
    console.error('[SW] Services sync failed:', error);
  }
}

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon-192.png',
    badge: '/favicon-192.png',
    tag: data.tag || 'default',
    requireInteraction: false,
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action) {
    // Handle action buttons
    console.log('[SW] Notification action:', event.action);
  } else {
    // Handle notification click
    event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
  }
});

console.log('[SW] Service worker loaded successfully');

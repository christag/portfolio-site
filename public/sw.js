/**
 * Service Worker for Caching and Performance Optimization
 *
 * Features:
 * - Static asset caching with versioning
 * - API response caching with TTL
 * - Image optimization and caching
 * - Offline fallbacks
 * - Background sync for data updates
 */

const CACHE_VERSION = 'v1.2.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const OFFLINE_CACHE = `offline-${CACHE_VERSION}`;

// Cache TTL in milliseconds
const CACHE_TTL = {
  STATIC: 31536000000, // 1 year
  API: 300000, // 5 minutes
  IMAGES: 86400000, // 1 day
  OFFLINE: 604800000, // 1 week
};

// Assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/portfolio',
  '/services',
  '/i-am',
  '/manifest.json',
  '/_astro/main.css', // This will be the actual generated CSS file
];

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
        return cache.addAll(
          CRITICAL_ASSETS.map(
            (url) =>
              new Request(url, {
                credentials: 'same-origin',
              })
          )
        );
      }),

      // Cache offline fallback page
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.add('/404'); // Use 404 page as offline fallback
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

  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  }
});

// Handle static assets (CSS, JS, fonts)
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);

  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse && !isExpired(cachedResponse, CACHE_TTL.STATIC)) {
    return cachedResponse;
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Add timestamp for TTL checking
      const responseToCache = networkResponse.clone();
      addTimestamp(responseToCache);
      cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.warn('[SW] Static asset fetch failed:', request.url, error);
    return (
      cachedResponse ||
      new Response('Asset not available offline', { status: 503 })
    );
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
      const responseToCache = networkResponse.clone();
      addTimestamp(responseToCache);
      cache.put(request, responseToCache);
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

  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse && !isExpired(cachedResponse, CACHE_TTL.IMAGES)) {
    return cachedResponse;
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache images
      const responseToCache = networkResponse.clone();
      addTimestamp(responseToCache);
      cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.warn('[SW] Image fetch failed:', request.url, error);
    return (
      cachedResponse ||
      new Response('Image not available offline', { status: 503 })
    );
  }
}

// Handle navigation requests (HTML pages)
async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful navigation responses
      const responseToCache = networkResponse.clone();
      addTimestamp(responseToCache);
      cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.warn('[SW] Navigation request failed:', request.url, error);

    // Try cached version
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
      const responseToCache = networkResponse.clone();
      addTimestamp(responseToCache);
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
  if (response.headers) {
    response.headers.set('sw-cached-at', Date.now().toString());
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
      const responseToCache = response.clone();
      addTimestamp(responseToCache);
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
      const responseToCache = response.clone();
      addTimestamp(responseToCache);
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

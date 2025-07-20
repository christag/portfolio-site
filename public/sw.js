// Service Worker for Christopher Tagliaferro Technology Consulting
// Optimized for iOS Safari PWA functionality

const CACHE_NAME = 'christagliaferro-v1';
const STATIC_CACHE_NAME = 'christagliaferro-static-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/services',
  '/portfolio',
  '/favicon.svg',
  '/favicon.ico',
  '/manifest.json',
];

// Assets to cache on first request
const RUNTIME_CACHE = ['/services/', '/portfolio/', '/i-am'];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external domains
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML documents - Network first, cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'image') {
    // Images - Cache first, network fallback
    event.respondWith(cacheFirstStrategy(request));
  } else if (
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    // JS/CSS - Cache first with network update
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    // Other resources - Network first
    event.respondWith(networkFirstStrategy(request));
  }
});

// Network first strategy (good for HTML)
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // If successful, cache the response
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // If it's a navigation request and we have no cache, return offline page
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }

    throw error;
  }
}

// Cache first strategy (good for images)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch and cache:', request.url);
    throw error;
  }
}

// Stale while revalidate strategy (good for JS/CSS)
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);

  // Always try to fetch from network to update cache
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.status === 200) {
        const cache = caches.open(CACHE_NAME);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => {
      console.log('[SW] Network failed for:', request.url);
    });

  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || networkPromise;
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ cacheSize: size });
    });
  }
});

// Utility function to get cache size
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    totalSize += requests.length;
  }

  return totalSize;
}

// Background sync for iOS Safari (limited support)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    // Implement background sync logic here
  }
});

// Push notifications (iOS Safari 16.4+)
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');

  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/favicon.svg',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.svg',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Christopher Tagliaferro', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow('/'));
  }
});

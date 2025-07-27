// Service Worker untuk Repareka
// Menyediakan caching dan offline functionality

const CACHE_NAME = 'repareka-v1'
const STATIC_CACHE_NAME = 'repareka-static-v1'
const DYNAMIC_CACHE_NAME = 'repareka-dynamic-v1'

// Assets yang akan di-cache secara static
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html'
]

// API endpoints yang akan di-cache
const CACHEABLE_APIS = [
  '/api/services',
  '/api/categories',
  '/api/locations'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error)
      })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle requests dengan caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    // Static assets - Cache First strategy
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
  } else if (isAPIRequest(request)) {
    // API requests - Network First strategy dengan fallback
    event.respondWith(networkFirstWithFallback(request))
  } else if (isPageRequest(request)) {
    // Page requests - Network First dengan offline fallback
    event.respondWith(networkFirstForPages(request))
  } else {
    // Other requests - Network First
    event.respondWith(networkFirst(request))
  }
})

// Helper functions

function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
         STATIC_ASSETS.includes(url.pathname)
}

function isAPIRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/api/') || 
         CACHEABLE_APIS.some(api => url.pathname.startsWith(api))
}

function isPageRequest(request) {
  const url = new URL(request.url)
  return request.headers.get('accept')?.includes('text/html') &&
         url.origin === self.location.origin
}

// Caching strategies

async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache', request.url)
      return cachedResponse
    }

    console.log('Service Worker: Fetching and caching', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Service Worker: Cache first error', error)
    throw error
  }
}

async function networkFirst(request) {
  try {
    console.log('Service Worker: Network first', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url)
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    throw error
  }
}

async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.log('Service Worker: API network failed, trying cache', request.url)
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return empty response untuk API calls yang gagal
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'Data tidak tersedia saat offline' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function networkFirstForPages(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Page network failed, trying cache', request.url)
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fallback ke offline page
    const offlineCache = await caches.open(STATIC_CACHE_NAME)
    const offlinePage = await offlineCache.match('/offline.html')
    
    if (offlinePage) {
      return offlinePage
    }
    
    // Last resort - basic offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Repareka</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              text-align: center; 
              padding: 2rem; 
              color: #374151;
            }
            .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
            .offline-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; }
            .offline-message { color: #6b7280; margin-bottom: 2rem; }
            .retry-button { 
              background: #10b981; 
              color: white; 
              border: none; 
              padding: 0.75rem 1.5rem; 
              border-radius: 0.5rem; 
              cursor: pointer; 
              font-size: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="offline-icon">📱</div>
          <h1 class="offline-title">Anda sedang offline</h1>
          <p class="offline-message">
            Periksa koneksi internet Anda dan coba lagi
          </p>
          <button class="retry-button" onclick="window.location.reload()">
            Coba Lagi
          </button>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Background sync untuk offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Implementasi background sync untuk offline actions
    console.log('Service Worker: Performing background sync')
    
    // Contoh: sync offline bookmarks, form submissions, etc.
    const offlineActions = await getOfflineActions()
    
    for (const action of offlineActions) {
      try {
        await processOfflineAction(action)
        await removeOfflineAction(action.id)
      } catch (error) {
        console.error('Service Worker: Failed to sync action', error)
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

async function getOfflineActions() {
  // Implementasi untuk mengambil offline actions dari IndexedDB
  return []
}

async function processOfflineAction(action) {
  // Implementasi untuk memproses offline action
  console.log('Processing offline action:', action)
}

async function removeOfflineAction(actionId) {
  // Implementasi untuk menghapus offline action setelah berhasil diproses
  console.log('Removing offline action:', actionId)
}

// Push notifications (untuk future implementation)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'Notifikasi baru dari Repareka',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Lihat',
        icon: '/icon-explore.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/icon-close.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Repareka', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
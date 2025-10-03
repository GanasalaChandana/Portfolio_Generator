// public/sw.js - Service Worker for Portfolio App
const CACHE_NAME = 'portfolio-v1.0.0'
const RUNTIME_CACHE = 'runtime-cache'

// Critical resources to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/_next/static/css/app.css',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/webpack.js',
  '/favicon.ico',
  '/manifest.json'
]

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Precaching critical resources')
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests (cache then network for portfolio data)
  if (url.pathname.startsWith('/api/portfolio')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        try {
          // Try network first
          const networkResponse = await fetch(request)
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch (error) {
          // Fall back to cache
          const cachedResponse = await cache.match(request)
          if (cachedResponse) {
            return cachedResponse
          }
          throw error
        }
      })
    )
    return
  }

  // Handle static assets (cache first)
  if (url.pathname.startsWith('/_next/static/') || 
      url.pathname.includes('.woff') || 
      url.pathname.includes('.woff2')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
      })
    )
    return
  }

  // Handle page requests (network first, cache fallback)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful page responses
          if (response.ok) {
            const responseToCache = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cached version
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Ultimate fallback - offline page
            return caches.match('/offline.html') || 
                   new Response('App is offline', { status: 503 })
          })
        })
    )
    return
  }

  // Default: network first, cache fallback for other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseToCache = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Background sync for portfolio saves
self.addEventListener('sync', (event) => {
  if (event.tag === 'portfolio-sync') {
    event.waitUntil(syncPortfolioData())
  }
})

async function syncPortfolioData() {
  try {
    // Get pending saves from IndexedDB
    const db = await openDB()
    const transaction = db.transaction(['pendingSaves'], 'readonly')
    const store = transaction.objectStore('pendingSaves')
    const pendingSaves = await store.getAll()

    // Sync each pending save
    for (const save of pendingSaves) {
      try {
        const response = await fetch('/api/portfolio/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(save.data)
        })

        if (response.ok) {
          // Remove from pending saves
          const deleteTransaction = db.transaction(['pendingSaves'], 'readwrite')
          const deleteStore = deleteTransaction.objectStore('pendingSaves')
          await deleteStore.delete(save.id)
        }
      } catch (error) {
        console.error('Sync failed for save:', save.id, error)
      }
    }
  } catch (error) {
    console.error('Portfolio sync failed:', error)
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PortfolioDatabase', 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: data.data,
      actions: [
        {
          action: 'view',
          title: 'View Portfolio'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Message handling between SW and main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_PORTFOLIO') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.put('/api/portfolio/current', 
          new Response(JSON.stringify(event.data.portfolio), {
            headers: { 'Content-Type': 'application/json' }
          })
        )
      })
    )
  }
})
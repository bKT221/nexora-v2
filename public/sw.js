// Nexora PWA Service Worker
// Vanilla service worker with workbox-like patterns

const CACHE_NAME = 'nexora-v2-cache-v1'
const STATIC_CACHE = 'nexora-static-v1'
const API_CACHE = 'nexora-api-v1'
const OFFLINE_URL = '/offline.html'

// Static assets to precache (app shell)
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/logo.svg',
  '/offline.html',
]

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Precaching app shell')
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Some app shell assets failed to cache:', err)
      })
    })
  )
  // Activate immediately without waiting
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== API_CACHE && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  // Claim all clients immediately
  self.clients.claim()
})

// Fetch event - routing strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests for caching
  if (request.method !== 'GET') {
    // For POST/PUT/DELETE, try network and fall through
    event.respondWith(
      fetch(request).catch(() => {
        // If it's a chat message POST, queue for background sync
        if (url.pathname.includes('/api/chat') && 'sync' in self) {
          return new Response(
            JSON.stringify({ queued: true, message: 'Message queued for sync' }),
            { headers: { 'Content-Type': 'application/json' } }
          )
        }
        return new Response(
          JSON.stringify({ error: 'Network unavailable' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      })
    )
    return
  }

  // API requests - Stale-While-Revalidate
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE))
    return
  }

  // Navigation requests - Network first, cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigations
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() => {
          // Try cache first
          return caches.match(request).then((cached) => {
            if (cached) return cached
            // Return offline page as last resort
            return caches.match(OFFLINE_URL).then((offlinePage) => {
              return offlinePage || new Response('Offline', { status: 503 })
            })
          })
        })
    )
    return
  }

  // Static assets - Cache First, then Network
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp)$/) ||
    url.pathname.includes('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          // Cache valid responses
          if (response.ok) {
            const clone = response.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        }).catch(() => {
          // Return a placeholder for images
          if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#0a1a14" width="100" height="100"/><text fill="#2d8a6e" x="50" y="55" text-anchor="middle" font-size="12">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            )
          }
          return new Response('', { status: 408 })
        })
      })
    )
    return
  }

  // Default - Network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})

// Stale-While-Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)

  // Return cached version if available, otherwise wait for network
  return cached || fetchPromise
}

// Background Sync for chat messages
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-chat-messages') {
    event.waitUntil(syncChatMessages())
  }
})

async function syncChatMessages() {
  // Replay queued chat messages when back online
  try {
    const db = await openIndexedDB()
    const messages = await getAllPendingMessages(db)
    for (const msg of messages) {
      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg),
        })
        await deletePendingMessage(db, msg.id)
      } catch (err) {
        console.warn('[SW] Failed to sync message:', err)
      }
    }
  } catch (err) {
    console.warn('[SW] Sync failed:', err)
  }
}

// IndexedDB helpers for offline message queue
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('nexora-offline', 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('pending-messages')) {
        db.createObjectStore('pending-messages', { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function getAllPendingMessages(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending-messages', 'readonly')
    const store = tx.objectStore('pending-messages')
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function deletePendingMessage(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending-messages', 'readwrite')
    const store = tx.objectStore('pending-messages')
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || 'Nouvelle notification Nexora',
      icon: '/logo.svg',
      badge: '/logo.svg',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/' },
      actions: data.actions || [],
    }
    event.waitUntil(
      self.registration.showNotification(data.title || 'Nexora', options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window or open new one
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    })
  )
})

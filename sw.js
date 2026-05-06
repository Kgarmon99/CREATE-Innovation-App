const CACHE_NAME = 'create-app-v1';
const urlsToCache = [
  '/CREATE-Innovation-App/',
  '/CREATE-Innovation-App/index.html'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache failed:', err))
  );
  self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(() => {
            // If network fails and not in cache, return offline fallback
            if (event.request.destination === 'document') {
              return caches.match('/CREATE-Innovation-App/index.html');
            }
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Push notifications (for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'New update from CREATE',
    icon: 'icon-192x192.png',
    badge: 'icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/CREATE-Innovation-App/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('CREATE', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/CREATE-Innovation-App/')
  );
});
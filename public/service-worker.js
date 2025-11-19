// Service Worker for Web Push Notifications

const CACHE_NAME = 'whatsapp-contact-manager-v1'

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker installed')
      self.skipWaiting()
    })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Push event - handles incoming push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('No data in push event')
    return
  }

  try {
    const data = event.data.json()

    const options = {
      body: data.body || 'Você tem um lembrete importante',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.contactId || 'contact-reminder',
      requireInteraction: data.requireInteraction !== undefined ? data.requireInteraction : true,
      data: {
        contactId: data.contactId,
        contactName: data.contactName,
        action: data.action || 'view_contact',
        url: data.url || '/dashboard'
      },
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/icon-192.png'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'WhatsApp Contact Manager', options)
    )
  } catch (error) {
    console.error('Error handling push notification:', error)
  }
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data
  const url = data.url || '/dashboard'

  // Handle different actions
  if (event.action === 'close') {
    return
  }

  // Handle open action or click on notification itself
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Notification close event (for analytics if needed)
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.data)
})

import { Contact } from './supabase'

/**
 * Register service worker for push notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none'
    })
    console.log('Service Worker registered:', registration)
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  if (!('Notification' in window)) {
    console.warn('Notifications not supported')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  return false
}

/**
 * Check if notifications are enabled
 */
export function areNotificationsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return 'Notification' in window && Notification.permission === 'granted'
}

/**
 * Calculate days since last contact
 */
function daysSinceLastContact(lastContactDate: string | null): number {
  if (!lastContactDate) return Infinity

  const last = new Date(lastContactDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - last.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Send local notification (for testing or offline support)
 */
export async function sendLocalNotification(
  title: string,
  options: NotificationOptions
): Promise<void> {
  if (typeof window === 'undefined') return

  if (!areNotificationsEnabled()) {
    console.warn('Notifications not enabled')
    return
  }

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Use service worker to show notification
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title,
      options
    })
  } else {
    // Fallback to direct notification
    new Notification(title, options)
  }
}

/**
 * Schedule follow-up reminders for contacts that haven't been contacted recently
 * Returns list of contacts that need follow-up
 */
export function getContactsNeedingFollowUp(
  contacts: Contact[],
  followUpIntervalDays: number = 7
): Contact[] {
  return contacts.filter((contact) => {
    const daysSince = daysSinceLastContact(contact.last_contact_date || null)
    return daysSince >= followUpIntervalDays
  })
}

/**
 * Send follow-up reminder for a specific contact
 */
export async function sendFollowUpReminder(contact: Contact): Promise<void> {
  const daysSince = daysSinceLastContact(contact.last_contact_date || null)

  let body = ''
  if (daysSince === Infinity) {
    body = 'Você nunca contatou este contato'
  } else if (daysSince === 1) {
    body = 'Contatado há 1 dia atrás'
  } else {
    body = `Contatado há ${daysSince} dias atrás`
  }

  const options: NotificationOptions = {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: `followup-${contact.id}`,
    requireInteraction: true,
    data: {
      contactId: contact.id,
      contactName: contact.name,
      action: 'view_contact',
      url: `/dashboard?contact=${contact.id}`
    }
  }

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title: `Lembrete: Contatar ${contact.name}`,
      options
    })
  } else {
    new Notification(`Lembrete: Contatar ${contact.name}`, options)
  }
}

/**
 * Schedule periodic follow-up checks
 * Call this from your dashboard to set up a check interval
 */
export function scheduleFollowUpChecks(
  contacts: Contact[],
  checkIntervalMinutes: number = 60,
  followUpIntervalDays: number = 7
): NodeJS.Timeout | null {
  if (typeof window === 'undefined') return null

  // Check immediately
  checkFollowUps(contacts, followUpIntervalDays)

  // Then check periodically
  const interval = setInterval(() => {
    checkFollowUps(contacts, followUpIntervalDays)
  }, checkIntervalMinutes * 60 * 1000)

  return interval
}

/**
 * Check for contacts needing follow-up and send reminders
 */
function checkFollowUps(contacts: Contact[], followUpIntervalDays: number): void {
  if (!areNotificationsEnabled()) return

  const needsFollowUp = getContactsNeedingFollowUp(contacts, followUpIntervalDays)

  // Send notification for the first contact that needs follow-up
  // (to avoid notification spam)
  if (needsFollowUp.length > 0) {
    const contact = needsFollowUp[0]
    sendFollowUpReminder(contact).catch(console.error)
  }
}

/**
 * Save notification preferences to localStorage
 */
export function saveNotificationPreferences(preferences: {
  enabled: boolean
  followUpIntervalDays: number
  checkIntervalMinutes: number
}): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences))
}

/**
 * Load notification preferences from localStorage
 */
export function loadNotificationPreferences(): {
  enabled: boolean
  followUpIntervalDays: number
  checkIntervalMinutes: number
} {
  if (typeof window === 'undefined') {
    return {
      enabled: false,
      followUpIntervalDays: 7,
      checkIntervalMinutes: 60
    }
  }

  const stored = localStorage.getItem('notificationPreferences')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // If parsing fails, use defaults
    }
  }

  return {
    enabled: false,
    followUpIntervalDays: 7,
    checkIntervalMinutes: 60
  }
}

/**
 * Device Contact Picker API Integration
 * Allows users to select and import contacts from their device's native contacts
 */

// TypeScript types for Contact Picker API
interface ContactPickerContact {
  name?: string[]
  tel?: string[]
  email?: string[]
  address?: string[]
  icon?: string[]
}

export interface DeviceContact {
  name?: string
  phone?: string
  email?: string
}

// Extend Navigator interface to include contacts API
declare global {
  interface Navigator {
    contacts: {
      select(
        properties: string[],
        options?: { multiple?: boolean }
      ): Promise<ContactPickerContact[]>
    }
  }
  interface Window {
    ContactsManager: any
  }
}

/**
 * Check if Contact Picker API is supported
 */
export function isContactPickerSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'contacts' in navigator && 'ContactsManager' in window
}

/**
 * Request permission to access device contacts
 * Note: Contact Picker API doesn't require explicit permission request;
 * it shows a native picker when the API is called
 */
export async function requestContactsPermission(): Promise<boolean> {
  if (!isContactPickerSupported()) {
    console.warn('Contact Picker API not supported on this device')
    return false
  }

  // Contact Picker API doesn't require permission request
  // The browser shows the native contact picker when API is called
  return true
}

/**
 * Pick a single contact from device
 */
export async function pickSingleContact(): Promise<DeviceContact | null> {
  if (!isContactPickerSupported()) {
    throw new Error('Contact Picker API not supported on this device')
  }

  try {
    const contacts = await navigator.contacts.select(['name', 'tel', 'email'], { multiple: false })

    if (contacts.length === 0) {
      return null
    }

    const contact = contacts[0]
    return {
      name: contact.name?.[0] || '',
      phone: contact.tel?.[0] || '',
      email: contact.email?.[0] || ''
    }
  } catch (error) {
    console.error('Error picking contact:', error)
    throw error
  }
}

/**
 * Pick multiple contacts from device
 */
export async function pickMultipleContacts(): Promise<DeviceContact[]> {
  if (!isContactPickerSupported()) {
    throw new Error('Contact Picker API not supported on this device')
  }

  try {
    const contacts = await navigator.contacts.select(['name', 'tel', 'email'], { multiple: true })

    return contacts.map((contact) => ({
      name: contact.name?.[0] || '',
      phone: contact.tel?.[0] || '',
      email: contact.email?.[0] || ''
    }))
  } catch (error) {
    console.error('Error picking contacts:', error)
    throw error
  }
}

/**
 * Normalize phone number for matching
 */
function normalizePhone(phone?: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

/**
 * Check if contact already exists
 */
export function contactExists(
  deviceContact: DeviceContact,
  existingContacts: Array<{ phone?: string; email?: string }>
): boolean {
  if (!deviceContact.name) return false

  // Check by phone
  if (deviceContact.phone) {
    const normalizedPhone = normalizePhone(deviceContact.phone)
    if (
      existingContacts.some(
        (c) => c.phone && normalizePhone(c.phone) === normalizedPhone
      )
    ) {
      return true
    }
  }

  // Check by email
  if (deviceContact.email) {
    if (
      existingContacts.some(
        (c) => c.email && c.email.toLowerCase() === deviceContact.email?.toLowerCase()
      )
    ) {
      return true
    }
  }

  return false
}

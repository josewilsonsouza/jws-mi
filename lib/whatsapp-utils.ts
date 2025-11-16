/**
 * WhatsApp Deep Linking Utilities
 * Handles opening WhatsApp conversations with contacts
 */

export function openWhatsAppChat(phone: string): void {
  if (!phone) return

  // Remove non-numeric characters except leading +
  const cleanPhone = phone.replace(/[^\d+]/g, '')

  // WhatsApp Web URL format
  const url = `https://wa.me/${cleanPhone}`

  // Try to open WhatsApp app (mobile) or web
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile: try app first, then web
    window.location.href = `whatsapp://send?phone=${cleanPhone}`
    setTimeout(() => {
      window.open(url, '_blank')
    }, 2000)
  } else {
    // Desktop: open WhatsApp Web
    window.open(url, '_blank')
  }
}

export function sendWhatsAppMessage(
  phone: string,
  message: string
): void {
  if (!phone || !message) return

  const cleanPhone = phone.replace(/[^\d+]/g, '')
  const encodedMessage = encodeURIComponent(message)

  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`
    setTimeout(() => {
      window.open(url, '_blank')
    }, 2000)
  } else {
    window.open(url, '_blank')
  }
}

export function formatPhoneNumber(phone: string): string {
  // Format Brazilian phone numbers (11 99999-9999)
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }

  return phone
}

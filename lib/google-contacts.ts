/**
 * Google Contacts API Integration
 * Fetches contacts and profile photos from Google Contacts
 */

export interface GoogleContact {
  id: string
  name: string
  phone?: string
  email?: string
  photoUrl?: string
}

export interface GoogleContactsConfig {
  clientId: string
  redirectUri: string
  scope: string[]
}

/**
 * Initialize Google OAuth flow
 */
export function getGoogleAuthUrl(clientId: string): string {
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/google/callback`
  const scope = [
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope.join(' '),
    access_type: 'offline',
    prompt: 'consent'
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Exchange Google auth code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<{ accessToken: string; refreshToken?: string }> {
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/google/callback`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }).toString()
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  const data = await response.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token
  }
}

/**
 * Fetch contacts from Google People API
 */
export async function fetchGoogleContacts(accessToken: string): Promise<GoogleContact[]> {
  const response = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers,emailAddresses,photos&pageSize=1000',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch Google contacts')
  }

  const data = await response.json()
  const contacts: GoogleContact[] = []

  if (data.connections && Array.isArray(data.connections)) {
    for (const connection of data.connections) {
      const name = connection.names?.[0]?.displayName
      if (!name) continue

      const phoneNumber = connection.phoneNumbers?.[0]?.value
      const email = connection.emailAddresses?.[0]?.value
      const photoUrl = connection.photos?.[0]?.url

      contacts.push({
        id: connection.resourceName || '',
        name,
        phone: phoneNumber,
        email,
        photoUrl
      })
    }
  }

  return contacts
}

/**
 * Download and convert image to base64
 */
export async function downloadPhotoAsBase64(photoUrl: string): Promise<string | null> {
  try {
    const response = await fetch(photoUrl)
    if (!response.ok) return null

    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error downloading photo:', error)
    return null
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
 * Normalize email for matching
 */
function normalizeEmail(email?: string): string {
  if (!email) return ''
  return email.toLowerCase().trim()
}

/**
 * Match Google contact with existing contact
 */
export function matchGoogleContact(
  googleContact: GoogleContact,
  existingContact: { phone?: string; email?: string }
): boolean {
  // Match by phone number (more reliable for WhatsApp users)
  if (googleContact.phone && existingContact.phone) {
    if (normalizePhone(googleContact.phone) === normalizePhone(existingContact.phone)) {
      return true
    }
  }

  // Match by email
  if (googleContact.email && existingContact.email) {
    if (normalizeEmail(googleContact.email) === normalizeEmail(existingContact.email)) {
      return true
    }
  }

  return false
}

/**
 * Save access token to localStorage
 */
export function saveGoogleAccessToken(
  token: string,
  refreshToken?: string,
  expiresIn?: number
): void {
  if (typeof window === 'undefined') return

  const tokenData = {
    accessToken: token,
    refreshToken: refreshToken || null,
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : null
  }

  localStorage.setItem('googleAccessToken', JSON.stringify(tokenData))
}

/**
 * Get stored Google access token
 */
export function getGoogleAccessToken(): string | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem('googleAccessToken')
  if (!stored) return null

  try {
    const tokenData = JSON.parse(stored)

    // Check if token has expired
    if (tokenData.expiresAt && tokenData.expiresAt < Date.now()) {
      localStorage.removeItem('googleAccessToken')
      return null
    }

    return tokenData.accessToken
  } catch {
    return null
  }
}

/**
 * Clear Google access token
 */
export function clearGoogleAccessToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('googleAccessToken')
}

/**
 * Check if user has Google auth
 */
export function hasGoogleAuth(): boolean {
  return getGoogleAccessToken() !== null
}

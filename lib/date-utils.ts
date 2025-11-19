'use client'

export function formatLastContact(lastContactDate: string | null | undefined): string {
  if (!lastContactDate) return 'Nunca'

  const last = new Date(lastContactDate)
  const now = new Date()
  const diffMs = now.getTime() - last.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return 'Agora mesmo'
  if (diffMinutes < 60) return `${diffMinutes}m atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`
  return `${Math.floor(diffDays / 365)} anos`
}

export function getLastContactColor(lastContactDate: string | null | undefined): string {
  if (!lastContactDate) return 'text-gray-500' // Never contacted

  const last = new Date(lastContactDate)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'text-green-600' // Today
  if (diffDays <= 7) return 'text-blue-600' // This week
  if (diffDays <= 30) return 'text-amber-600' // This month
  return 'text-red-600' // More than a month
}

'use client'

import { useState } from 'react'
import { Download, X, AlertCircle, CheckCircle } from 'lucide-react'
import {
  getGoogleAuthUrl,
  fetchGoogleContacts,
  downloadPhotoAsBase64,
  matchGoogleContact,
  hasGoogleAuth,
  clearGoogleAccessToken,
  getGoogleAccessToken
} from '@/lib/google-contacts'
import { supabase, Contact } from '@/lib/supabase'

interface GoogleContactsSyncProps {
  contacts: Contact[]
  onSyncComplete: () => void
}

interface SyncResult {
  matched: number
  new: number
  failed: number
}

export default function GoogleContactsSync({
  contacts,
  onSyncComplete
}: GoogleContactsSyncProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SyncResult | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(hasGoogleAuth())

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!googleClientId) {
    return null
  }

  const handleStartAuth = () => {
    const authUrl = getGoogleAuthUrl(googleClientId)
    window.open(authUrl, 'google-auth', 'width=500,height=600')
  }

  const handleSync = async () => {
    setIsSyncing(true)
    setError(null)
    setResult(null)

    try {
      const accessToken = getGoogleAccessToken()
      if (!accessToken) {
        setError('Token not found. Please authorize again.')
        setIsSyncing(false)
        return
      }

      // Fetch Google contacts
      const googleContacts = await fetchGoogleContacts(accessToken)

      if (googleContacts.length === 0) {
        setError('No contacts found in your Google account.')
        setIsSyncing(false)
        return
      }

      // Get current user
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) {
        setError('User not authenticated')
        setIsSyncing(false)
        return
      }

      const userId = userData.session.user.id
      let matchedCount = 0
      let newCount = 0
      let failedCount = 0

      for (const googleContact of googleContacts) {
        try {
          // Find matching contact
          const matchedContact = contacts.find((c) =>
            matchGoogleContact(googleContact, { phone: c.phone, email: c.email })
          )

          if (matchedContact && googleContact.photoUrl) {
            // Download and update photo for existing contact
            const photoBase64 = await downloadPhotoAsBase64(googleContact.photoUrl)
            if (photoBase64) {
              await supabase
                .from('contacts')
                .update({ avatar_url: photoBase64 })
                .eq('id', matchedContact.id)

              matchedCount++
            }
          } else if (!matchedContact && googleContact.phone) {
            // Create new contact with photo
            const photoBase64 = googleContact.photoUrl
              ? await downloadPhotoAsBase64(googleContact.photoUrl)
              : null

            const { error: insertError } = await supabase
              .from('contacts')
              .insert({
                user_id: userId,
                name: googleContact.name,
                phone: googleContact.phone,
                email: googleContact.email || null,
                avatar_url: photoBase64 || null
              })

            if (!insertError) {
              newCount++
            } else {
              failedCount++
            }
          }
        } catch (err) {
          console.error('Error syncing contact:', err)
          failedCount++
        }
      }

      setResult({
        matched: matchedCount,
        new: newCount,
        failed: failedCount
      })

      // Refresh contacts
      onSyncComplete()
    } catch (err) {
      console.error('Sync error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during sync')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDisconnect = () => {
    clearGoogleAccessToken()
    setIsAuthorized(false)
    setResult(null)
    setError(null)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" />
        Sincronizar Google Contacts
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Sincronizar Google Contacts</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600">
          Sincronize seus contatos do Google para enriquecer seus contatos com fotos de perfil e
          outras informações.
        </p>

        {/* Authorization Status */}
        {!isAuthorized && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 mb-3">
              Você precisa autorizar acesso à sua conta Google Contacts para continuar.
            </p>
            <button
              onClick={handleStartAuth}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Conectar com Google
            </button>
          </div>
        )}

        {isAuthorized && !result && !error && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">✓ Conectado com sucesso à sua conta Google</p>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Contatos'}
            </button>

            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
            >
              Desconectar
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Erro na sincronização</p>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Result State */}
        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Sincronização concluída!</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-green-800">
                <p>✓ Contatos enriquecidos: {result.matched}</p>
                <p>✓ Novos contatos criados: {result.new}</p>
                {result.failed > 0 && <p>✗ Falhas: {result.failed}</p>}
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false)
                setResult(null)
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

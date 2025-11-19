'use client'

import { useState } from 'react'
import { Smartphone, X, AlertCircle, CheckCircle } from 'lucide-react'
import {
  isContactPickerSupported,
  pickMultipleContacts,
  contactExists,
  DeviceContact
} from '@/lib/device-contacts'
import { supabase, Contact } from '@/lib/supabase'

interface DeviceContactsPickerProps {
  contacts: Contact[]
  onImportComplete: () => void
}

interface ImportResult {
  imported: number
  skipped: number
  total: number
}

export default function DeviceContactsPicker({ contacts, onImportComplete }: DeviceContactsPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedContacts, setSelectedContacts] = useState<DeviceContact[]>([])
  const [isSupported] = useState(isContactPickerSupported())

  const handlePickContacts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const pickedContacts = await pickMultipleContacts()

      if (pickedContacts.length === 0) {
        setError('Nenhum contato foi selecionado')
        setIsLoading(false)
        return
      }

      setSelectedContacts(pickedContacts)
    } catch (err) {
      console.error('Error picking contacts:', err)
      if (err instanceof Error && err.message.includes('NotAllowedError')) {
        setError('Você negou o acesso aos contatos do dispositivo.')
      } else if (err instanceof Error && err.message.includes('AbortError')) {
        setError('Seleção de contatos foi cancelada.')
      } else {
        setError('Erro ao acessar contatos do dispositivo. Este recurso pode não estar disponível em seu navegador.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) {
        setError('Você precisa estar autenticado para importar contatos.')
        setIsLoading(false)
        return
      }

      const userId = userData.session.user.id
      let imported = 0
      let skipped = 0

      for (const deviceContact of selectedContacts) {
        // Skip if no name
        if (!deviceContact.name || !deviceContact.name.trim()) {
          skipped++
          continue
        }

        // Skip if contact already exists
        if (contactExists(deviceContact, contacts)) {
          skipped++
          continue
        }

        // Import contact
        if (deviceContact.phone) {
          try {
            const { error: insertError } = await supabase.from('contacts').insert({
              user_id: userId,
              name: deviceContact.name,
              phone: deviceContact.phone,
              email: deviceContact.email || null
            })

            if (!insertError) {
              imported++
            } else {
              skipped++
            }
          } catch {
            skipped++
          }
        } else {
          skipped++
        }
      }

      setResult({
        imported,
        skipped,
        total: selectedContacts.length
      })

      // Refresh contacts
      onImportComplete()
    } catch (err) {
      console.error('Import error:', err)
      setError('Erro ao importar contatos. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedContacts([])
    setResult(null)
    setError(null)
  }

  const handleClose = () => {
    handleReset()
    setIsOpen(false)
  }

  if (!isSupported) {
    return (
      <button
        disabled
        className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
        title="Seu navegador não suporta importação de contatos do dispositivo"
      >
        <Smartphone className="h-4 w-4" />
        Importar do Dispositivo (Não suportado)
      </button>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2"
      >
        <Smartphone className="h-4 w-4" />
        Importar do Dispositivo
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Importar do Dispositivo</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600">
          Selecione contatos do seu dispositivo para importá-los para sua lista.
        </p>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Erro</p>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Initial State */}
        {selectedContacts.length === 0 && !result && (
          <button
            onClick={handlePickContacts}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Acessando contatos...' : 'Selecionar Contatos'}
          </button>
        )}

        {/* Selected Contacts List */}
        {selectedContacts.length > 0 && !result && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {selectedContacts.length} contato(s) selecionado(s)
              </p>
              <div className="space-y-2">
                {selectedContacts.map((contact, idx) => (
                  <div key={idx} className="text-sm bg-white p-2 rounded border border-gray-200">
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    {contact.phone && <p className="text-xs text-gray-600">{contact.phone}</p>}
                    {contact.email && <p className="text-xs text-gray-600">{contact.email}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {isLoading ? 'Importando...' : 'Importar'}
              </button>
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
                  <p className="font-semibold text-green-900">Importação concluída!</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-green-800">
                <p>✓ Importados: {result.imported}</p>
                {result.skipped > 0 && <p>ℹ Ignorados: {result.skipped} (já existem ou inválidos)</p>}
                <p>Total: {result.total}</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Info */}
        {!selectedContacts.length && !result && !error && (
          <p className="text-xs text-gray-500">
            💡 Dica: Selecione múltiplos contatos para importar vários de uma vez.
          </p>
        )}
      </div>
    </div>
  )
}

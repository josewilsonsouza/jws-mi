'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ContactNotesModalProps {
  contactId: string
  contactName: string
  onClose: () => void
  onSuccess: () => void
}

export default function ContactNotesModal({
  contactId,
  contactName,
  onClose,
  onSuccess,
}: ContactNotesModalProps) {
  const [notes, setNotes] = useState('')
  const [lastMessage, setLastMessage] = useState('')
  const [lastContactDate, setLastContactDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    loadInteraction()
  }, [contactId])

  const loadInteraction = async () => {
    try {
      const { data } = await supabase
        .from('interactions')
        .select('*')
        .eq('contact_id', contactId)
        .single()

      if (data) {
        setNotes(data.notes || '')
        setLastMessage(data.last_message || '')
        setLastContactDate(data.last_contact_date || '')
      }
    } catch (err) {
      // No interaction found yet
      console.log('Nenhuma nota encontrada para este contato')
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')

    try {
      const { data: existingData } = await supabase
        .from('interactions')
        .select('id')
        .eq('contact_id', contactId)
        .single()

      const payload = {
        contact_id: contactId,
        notes,
        last_message: lastMessage,
        last_contact_date: lastContactDate || null,
        updated_at: new Date().toISOString(),
      }

      if (existingData) {
        // Update
        const { error: updateError } = await supabase
          .from('interactions')
          .update(payload)
          .eq('contact_id', contactId)

        if (updateError) throw updateError
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('interactions')
          .insert(payload)

        if (insertError) throw insertError
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar notas')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notas para {contactName}
        </h3>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Última mensagem/interação
            </label>
            <textarea
              value={lastMessage}
              onChange={(e) => setLastMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              placeholder="Última conversa, assunto de discussão..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data do último contato
            </label>
            <input
              type="datetime-local"
              value={lastContactDate}
              onChange={(e) => setLastContactDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas gerais
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              placeholder="Informações importantes sobre este contato..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

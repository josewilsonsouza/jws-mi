'use client'

import { useState, useEffect } from 'react'
import { supabase, Tag } from '@/lib/supabase'

interface ContactTagsModalProps {
  contactId: string
  contactName: string
  tags: Tag[]
  onClose: () => void
  onSuccess: () => void
}

export default function ContactTagsModal({
  contactId,
  contactName,
  tags,
  onClose,
  onSuccess,
}: ContactTagsModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadContactTags()
  }, [contactId])

  const loadContactTags = async () => {
    try {
      const { data } = await supabase
        .from('contact_tags')
        .select('tag_id')
        .eq('contact_id', contactId)

      if (data) {
        setSelectedTags(data.map((ct) => ct.tag_id))
      }
    } catch (err) {
      console.error('Erro ao carregar tags:', err)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Remove all existing tags
      await supabase
        .from('contact_tags')
        .delete()
        .eq('contact_id', contactId)

      // Add selected tags
      if (selectedTags.length > 0) {
        const { error: insertError } = await supabase
          .from('contact_tags')
          .insert(
            selectedTags.map((tagId) => ({
              contact_id: contactId,
              tag_id: tagId,
            }))
          )

        if (insertError) throw insertError
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar tags')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tags para {contactName}
        </h3>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
          {tags.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma tag disponível</p>
          ) : (
            tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag.id])
                    } else {
                      setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                    }
                  }}
                  className="w-4 h-4 rounded accent-green-600"
                />
                <div
                  className="ml-3 w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <span className="ml-2 text-gray-700">{tag.name}</span>
              </label>
            ))
          )}
        </div>

        <div className="flex gap-2">
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
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

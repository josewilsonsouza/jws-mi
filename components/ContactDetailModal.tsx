'use client'

import { useState, useEffect } from 'react'
import { Contact, Tag, supabase } from '@/lib/supabase'
import { MessageCircle, Edit2, Trash2, X, Share2 } from 'lucide-react'
import { openWhatsAppChat } from '@/lib/whatsapp-utils'
import ShareContactModal from './ShareContactModal'

interface ContactDetailModalProps {
  contact: Contact | null
  tags: Tag[]
  contactTags: Tag[]
  onClose: () => void
  onEdit: (contact: Contact) => void
  onDelete: (contactId: string) => void
  onTagsChange: () => void
}

export default function ContactDetailModal({
  contact,
  tags,
  contactTags,
  onClose,
  onEdit,
  onDelete,
  onTagsChange,
}: ContactDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (contact && contactTags) {
      setSelectedTags(contactTags.map((t) => t.id))
    }
  }, [contact, contactTags])

  if (!contact) return null

  const handleDeleteContact = async () => {
    if (confirm('Deseja deletar este contato?')) {
      setIsDeleting(true)
      try {
        await supabase.from('contacts').delete().eq('id', contact.id)
        onDelete(contact.id)
        onClose()
      } catch (error) {
        console.error('Erro ao deletar:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleTagToggle = async (tagId: string) => {
    try {
      const isSelected = selectedTags.includes(tagId)

      if (isSelected) {
        // Remove tag
        await supabase
          .from('contact_tags')
          .delete()
          .eq('contact_id', contact.id)
          .eq('tag_id', tagId)
        setSelectedTags((prev) => prev.filter((id) => id !== tagId))
      } else {
        // Add tag
        await supabase.from('contact_tags').insert({
          contact_id: contact.id,
          tag_id: tagId,
        })
        setSelectedTags((prev) => [...prev, tagId])
      }

      onTagsChange()
    } catch (error) {
      console.error('Erro ao atualizar tags:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          {contact.phone && (
            <p className="text-gray-700 mb-2">
              <strong>Telefone:</strong> {contact.phone}
            </p>
          )}
          {contact.email && (
            <p className="text-gray-700">
              <strong>Email:</strong> {contact.email}
            </p>
          )}
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={() => openWhatsAppChat(contact.phone)}
          className="w-full mb-4 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          Abrir no WhatsApp
        </button>

        {/* Tags Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="space-y-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="rounded"
                  />
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color || '#16a34a' }}
                  ></span>
                  <span className="text-gray-700">{tag.name}</span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma tag disponível</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </button>
          <button
            onClick={() => {
              onEdit(contact)
              onClose()
            }}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Editar Contato
          </button>
          <button
            onClick={handleDeleteContact}
            disabled={isDeleting}
            className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deletando...' : 'Deletar Contato'}
          </button>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <ShareContactModal
            contact={contact}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>
    </div>
  )
}

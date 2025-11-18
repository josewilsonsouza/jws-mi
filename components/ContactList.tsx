'use client'

import { Contact, Tag } from '@/lib/supabase'
import { formatPhoneNumber } from '@/lib/whatsapp-utils'
import Avatar from './Avatar'

interface ContactListProps {
  contacts: Contact[]
  contactTags: Map<string, Tag[]>
  onOpenWhatsApp: (phone: string) => void
  onEdit: (contact: Contact) => void
  onEditTags: (contact: Contact) => void
  onEditNotes: (contact: Contact) => void
  onDelete: (contactId: string) => void
}

export default function ContactList({
  contacts,
  contactTags,
  onOpenWhatsApp,
  onEdit,
  onEditTags,
  onEditNotes,
  onDelete,
}: ContactListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => {
        const cTags = contactTags.get(contact.id) || []

        return (
          <div
            key={contact.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
          >
            {/* Card Header with Avatar */}
            <div className="p-4 flex gap-3 items-start">
              <Avatar name={contact.name} size="md" avatarUrl={contact.avatar_url} />
              <div className="flex-1 min-w-0">
                <h3 className="h3 text-lg font-semibold text-gray-900 truncate">{contact.name}</h3>
                <p className="body-small text-gray-500 truncate">{contact.email || 'Sem email'}</p>
              </div>
              <button
                onClick={() => onOpenWhatsApp(contact.phone)}
                className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 active:scale-95 transition-all"
                title="Abrir no WhatsApp"
                aria-label={`Abrir WhatsApp com ${contact.name}`}
              >
                💬
              </button>
            </div>

            {/* Phone Number */}
            <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
              <p className="body-small text-gray-600">
                <span className="font-medium">📱</span> {formatPhoneNumber(contact.phone)}
              </p>
            </div>

            {/* Tags */}
            {cTags.length > 0 && (
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {cTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
                {cTags.length > 3 && (
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                    +{cTags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="px-4 py-3 flex gap-2 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => onEdit(contact)}
                className="flex-1 px-3 py-2 text-xs font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-white active:bg-gray-100 transition"
                aria-label={`Editar ${contact.name}`}
              >
                Editar
              </button>
              <button
                onClick={() => onEditTags(contact)}
                className="flex-1 px-3 py-2 text-xs font-medium bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 active:bg-green-200 transition"
                aria-label={`Gerenciar tags de ${contact.name}`}
              >
                🏷️ Tags
              </button>
              <button
                onClick={() => onEditNotes(contact)}
                className="flex-1 px-3 py-2 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition"
                aria-label={`Editar notas de ${contact.name}`}
              >
                📝
              </button>
              <button
                onClick={() => onDelete(contact.id)}
                className="px-3 py-2 text-xs font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50 active:bg-red-100 transition"
                aria-label={`Deletar ${contact.name}`}
              >
                ✕
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

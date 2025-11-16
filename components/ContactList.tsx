'use client'

import { Contact, Tag } from '@/lib/supabase'
import { formatPhoneNumber } from '@/lib/whatsapp-utils'

interface ContactListProps {
  contacts: Contact[]
  tags: Tag[]
  contactTags: Map<string, Tag[]>
  onOpenWhatsApp: (phone: string) => void
  onEdit: (contact: Contact) => void
  onEditTags: (contact: Contact) => void
  onDelete: (contactId: string) => void
}

export default function ContactList({
  contacts,
  tags,
  contactTags,
  onOpenWhatsApp,
  onEdit,
  onEditTags,
  onDelete,
}: ContactListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => {
        const cTags = contactTags.get(contact.id) || []

        return (
          <div
            key={contact.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
              <button
                onClick={() => onOpenWhatsApp(contact.phone)}
                className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition"
                title="Abrir no WhatsApp"
              >
                💬
              </button>
            </div>

            {/* Phone */}
            <div className="mb-3 p-2 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tel:</span> {formatPhoneNumber(contact.phone)}
              </p>
            </div>

            {/* Tags */}
            {cTags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {cTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => onEdit(contact)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Editar
              </button>
              <button
                onClick={() => onEditTags(contact)}
                className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition"
              >
                Tags
              </button>
              <button
                onClick={() => onDelete(contact.id)}
                className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition"
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

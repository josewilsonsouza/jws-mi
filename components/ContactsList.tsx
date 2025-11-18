'use client'

import { Contact, Tag } from '@/lib/supabase'

interface ContactsListProps {
  contacts: Contact[]
  contactTags: Map<string, Tag[]>
  onSelectContact: (contact: Contact) => void
  loading: boolean
}

export default function ContactsList({
  contacts,
  contactTags,
  onSelectContact,
  loading,
}: ContactsListProps) {
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">👥</p>
          <p className="text-gray-600 text-lg">Nenhum contato ainda</p>
          <p className="text-gray-500 text-sm">Clique em "Novo Contato" para começar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact) => {
        const tags = contactTags.get(contact.id) || []
        const displayTags = tags.slice(0, 2)
        const remainingTags = tags.length - displayTags.length

        return (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{contact.name}</h3>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {displayTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {remainingTags > 0 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        +{remainingTags}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-gray-400 ml-2">→</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact, Tag } from '@/lib/supabase'
import ContactList from '@/components/ContactList'
import SearchBar from '@/components/SearchBar'
import TagManager from '@/components/TagManager'
import ContactForm from '@/components/ContactForm'
import ContactTagsModal from '@/components/ContactTagsModal'
import ContactNotesModal from '@/components/ContactNotesModal'
import EmptyState from '@/components/EmptyState'
import PremiumPaywall from '@/components/PremiumPaywall'
import DashboardStats from '@/components/DashboardStats'
import { openWhatsAppChat } from '@/lib/whatsapp-utils'

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [contactTags, setContactTags] = useState<Map<string, Tag[]>>(new Map())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showTagManager, setShowTagManager] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showTagsModal, setShowTagsModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showPremiumPaywall, setShowPremiumPaywall] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactCount, setContactCount] = useState(0)
  const [maxContacts] = useState(50) // Free tier limit

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) return

      const userId = userData.session.user.id

      // Load tags
      const { data: tagsData } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (tagsData) {
        setTags(tagsData)
      }

      // Load contacts from database
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (contactsData) {
        setContacts(contactsData)
        setContactCount(contactsData.length)
        await loadContactTags(contactsData, tagsData || [])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadContactTags = async (
    contactsList: Contact[],
    tagsList: Tag[]
  ) => {
    try {
      const { data: contactTagsData } = await supabase
        .from('contact_tags')
        .select('contact_id, tag_id')

      const tagsMap = new Map<string, Tag[]>()

      if (contactTagsData) {
        contactsList.forEach((contact) => {
          const contactTagIds = contactTagsData
            .filter((ct) => ct.contact_id === contact.id)
            .map((ct) => ct.tag_id)

          const cTags = tagsList.filter((tag) =>
            contactTagIds.includes(tag.id)
          )
          tagsMap.set(contact.id, cTags)
        })
      }

      setContactTags(tagsMap)
    } catch (error) {
      console.error('Erro ao carregar tags dos contatos:', error)
    }
  }

  const handleAddContact = async () => {
    if (contactCount >= maxContacts) {
      setShowPremiumPaywall(true)
      return
    }
    setEditingContact(null)
    setShowContactForm(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setShowContactForm(true)
  }

  const handleDeleteContact = async (contactId: string) => {
    if (confirm('Deseja deletar este contato?')) {
      try {
        await supabase.from('contacts').delete().eq('id', contactId)
        await loadData()
      } catch (error) {
        console.error('Erro ao deletar contato:', error)
      }
    }
  }

  const handleEditTags = (contact: Contact) => {
    setSelectedContact(contact)
    setShowTagsModal(true)
  }

  const handleEditNotes = (contact: Contact) => {
    setSelectedContact(contact)
    setShowNotesModal(true)
  }

  const handleFormSuccess = async () => {
    setShowContactForm(false)
    await loadData()
  }

  const handleTagsSuccess = async () => {
    await loadData()
  }

  const handleNotesSuccess = async () => {
    await loadData()
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const isFreeTierMaxed = contactCount >= maxContacts && !editingContact

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Bem-vindo! Aqui você gerencia seus contatos, tags e preferências.
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats
        contactCount={contactCount}
        tagCount={tags.length}
        pinnedCount={0}
        maxContacts={maxContacts}
      />

      {/* Action Bar */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Meus Contatos</h3>
        </div>
        {!isFreeTierMaxed && (
          <button
            onClick={handleAddContact}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            + Novo Contato
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <button
          onClick={() => setShowTagManager(!showTagManager)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
        >
          {showTagManager ? 'Fechar Tags' : 'Gerenciar Tags'}
        </button>
      </div>

      {/* Tag Manager */}
      {showTagManager && (
        <TagManager tags={tags} onTagsChange={(newTags) => {
          setTags(newTags)
          loadData()
        }} />
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingContact ? 'Editar Contato' : 'Novo Contato'}
            </h3>
            <ContactForm
              contact={editingContact || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowContactForm(false)}
            />
          </div>
        </div>
      )}

      {/* Tags Modal */}
      {showTagsModal && selectedContact && (
        <ContactTagsModal
          contactId={selectedContact.id}
          contactName={selectedContact.name}
          tags={tags}
          onClose={() => setShowTagsModal(false)}
          onSuccess={handleTagsSuccess}
        />
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedContact && (
        <ContactNotesModal
          contactId={selectedContact.id}
          contactName={selectedContact.name}
          onClose={() => setShowNotesModal(false)}
          onSuccess={handleNotesSuccess}
        />
      )}

      {/* Premium Paywall */}
      <PremiumPaywall
        isOpen={showPremiumPaywall}
        onClose={() => setShowPremiumPaywall(false)}
        contactCount={contactCount}
        maxFreeContacts={maxContacts}
      />

      {/* Contact List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm">
          {contacts.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Nenhum contato ainda"
              description="Comece adicionando seus primeiros contatos para organizar com tags e lembretes"
              action={
                !isFreeTierMaxed
                  ? {
                      label: '+ Adicionar Primeiro Contato',
                      onClick: handleAddContact,
                    }
                  : undefined
              }
            />
          ) : (
            <EmptyState
              icon="🔍"
              title="Nenhum resultado"
              description="Tente ajustar sua busca ou filtros"
              action={{
                label: 'Limpar Busca',
                onClick: () => setSearchQuery(''),
              }}
            />
          )}
        </div>
      ) : (
        <ContactList
          contacts={filteredContacts}
          tags={tags}
          contactTags={contactTags}
          onOpenWhatsApp={openWhatsAppChat}
          onEdit={handleEditContact}
          onEditTags={handleEditTags}
          onEditNotes={handleEditNotes}
          onDelete={handleDeleteContact}
        />
      )}
    </div>
  )
}

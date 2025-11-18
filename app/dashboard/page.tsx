'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact, Tag } from '@/lib/supabase'
import TopBar from '@/components/TopBar'
import BottomTabBar from '@/components/BottomTabBar'
import ContactsList from '@/components/ContactsList'
import ContactDetailModal from '@/components/ContactDetailModal'
import TagsMenu from '@/components/TagsMenu'
import ProfilePage from '@/components/ProfilePage'
import ContactForm from '@/components/ContactForm'
import SearchBar from '@/components/SearchBar'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'tags' | 'profile'>('contacts')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [contactTags, setContactTags] = useState<Map<string, Tag[]>>(new Map())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showContactForm, setShowContactForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [selectedContactDetail, setSelectedContactDetail] = useState<Contact | null>(null)
  const [contactCount, setContactCount] = useState(0)
  const [maxContacts] = useState(50)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) return

      const userId = userData.session.user.id
      if (userData.session.user.email) {
        setUserEmail(userData.session.user.email)
      }

      // Load tags
      const { data: tagsData } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (tagsData) {
        setTags(tagsData)
      }

      // Load contacts
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

  const loadContactTags = async (contactsList: Contact[], tagsList: Tag[]) => {
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

  const handleAddContact = () => {
    if (contactCount >= maxContacts) {
      alert('Você atingiu o limite de 50 contatos no plano gratuito. Faça upgrade para Premium!')
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
    try {
      await supabase.from('contacts').delete().eq('id', contactId)
      await loadData()
      setSelectedContactDetail(null)
    } catch (error) {
      console.error('Erro ao deletar contato:', error)
    }
  }

  const handleFormSuccess = async () => {
    setShowContactForm(false)
    await loadData()
  }

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <div className="max-w-4xl mx-auto p-4">
          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Meus Contatos</h2>
                {contactCount < maxContacts && (
                  <button
                    onClick={handleAddContact}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Novo
                  </button>
                )}
              </div>

              {contactCount >= maxContacts && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Você atingiu o limite de 50 contatos. Faça upgrade para Premium para adicionar mais.
                  </p>
                </div>
              )}

              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              <ContactsList
                contacts={filteredContacts}
                contactTags={contactTags}
                onSelectContact={setSelectedContactDetail}
                loading={loading}
              />
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Minhas Tags</h2>
              <TagsMenu tags={tags} onTagsChange={loadData} />
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <ProfilePage
              userEmail={userEmail}
              contactCount={contactCount}
              tagCount={tags.length}
            />
          )}
        </div>
      </main>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
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

      {/* Contact Detail Modal */}
      {selectedContactDetail && (
        <ContactDetailModal
          contact={selectedContactDetail}
          tags={tags}
          contactTags={contactTags.get(selectedContactDetail.id) || []}
          onClose={() => setSelectedContactDetail(null)}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onTagsChange={loadData}
        />
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

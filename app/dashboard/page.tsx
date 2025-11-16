'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact, Tag } from '@/lib/supabase'
import ContactList from '@/components/ContactList'
import SearchBar from '@/components/SearchBar'
import TagManager from '@/components/TagManager'
import { openWhatsAppChat } from '@/lib/whatsapp-utils'

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showTagManager, setShowTagManager] = useState(false)
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

      if (tagsData) {
        setTags(tagsData)
      }

      // Load contacts (mock for now)
      const mockContacts: Contact[] = [
        {
          id: '1',
          user_id: userId,
          name: 'João Silva',
          phone: '11 99999-0001',
          email: 'joao@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: userId,
          name: 'Maria Santos',
          phone: '21 98888-0002',
          email: 'maria@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          user_id: userId,
          name: 'Carlos Oliveira',
          phone: '85 97777-0003',
          email: 'carlos@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      setContacts(mockContacts)
      setContactCount(mockContacts.length)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const isFreeTierMaxed = contactCount >= maxContacts

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meus Contatos</h2>
        <p className="text-gray-600">
          {contactCount} / {maxContacts} contatos enriquecidos
          {isFreeTierMaxed && ' (limite da versão gratuita atingido)'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Uso do plano gratuito
          </span>
          <span className="text-sm text-gray-600">
            {Math.round((contactCount / maxContacts) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${(contactCount / maxContacts) * 100}%` }}
          ></div>
        </div>
        {isFreeTierMaxed && (
          <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            Fazer Upgrade para Premium
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
        <TagManager tags={tags} onTagsChange={setTags} />
      )}

      {/* Contact List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">Nenhum contato encontrado</p>
        </div>
      ) : (
        <ContactList
          contacts={filteredContacts}
          tags={tags}
          onOpenWhatsApp={openWhatsAppChat}
        />
      )}
    </div>
  )
}

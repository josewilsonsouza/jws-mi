'use client'

import { useState, useEffect } from 'react'
import { supabase, Contact, Tag } from '@/lib/supabase'

interface ContactFormProps {
  contact?: Contact
  onSuccess: () => void
  onCancel: () => void
}

export default function ContactForm({
  contact,
  onSuccess,
  onCancel,
}: ContactFormProps) {
  const [name, setName] = useState(contact?.name || '')
  const [phone, setPhone] = useState(contact?.phone || '')
  const [email, setEmail] = useState(contact?.email || '')
  const [context, setContext] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#16a34a')

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) return

      const { data: tagsData } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userData.session.user.id)
        .order('created_at', { ascending: false })

      if (tagsData) {
        setTags(tagsData)
      }
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleCreateNewTag = async () => {
    if (!newTagName.trim()) return

    try {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) return

      const { data: createdTag } = await supabase
        .from('tags')
        .insert({
          user_id: userData.session.user.id,
          name: newTagName,
          color: newTagColor,
        })
        .select()

      if (createdTag && createdTag[0]) {
        const newTag = createdTag[0]
        setTags((prev) => [newTag, ...prev])
        setSelectedTagIds((prev) => [...prev, newTag.id])
        setNewTagName('')
        setNewTagColor('#16a34a')
        setShowCreateTag(false)
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) {
        setError('Usuário não autenticado')
        return
      }

      const userId = userData.session.user.id
      let contactId = contact?.id

      if (contact) {
        // Update
        const { error: updateError } = await supabase
          .from('contacts')
          .update({
            name,
            phone,
            email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contact.id)
          .eq('user_id', userId)

        if (updateError) throw updateError
      } else {
        // Create
        const { data: insertedContact, error: insertError } = await supabase
          .from('contacts')
          .insert({
            user_id: userId,
            name,
            phone,
            email,
          })
          .select()

        if (insertError) throw insertError
        if (insertedContact && insertedContact[0]) {
          contactId = insertedContact[0].id
        }
      }

      // Add tags if any selected
      if (contactId && selectedTagIds.length > 0) {
        // Remove existing tags
        await supabase
          .from('contact_tags')
          .delete()
          .eq('contact_id', contactId)

        // Add new tags
        const contactTagsData = selectedTagIds.map((tagId) => ({
          contact_id: contactId,
          tag_id: tagId,
        }))

        const { error: tagError } = await supabase
          .from('contact_tags')
          .insert(contactTagsData)

        if (tagError) throw tagError
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar contato')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="João Silva"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefone *
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="11 99999-9999"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="joao@example.com"
        />
      </div>

      {/* Context */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contexto / Notas
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ex: Conheci na conferência de tech, trabalha com IA..."
          rows={3}
        />
      </div>

      {/* Create New Tag */}
      {!showCreateTag && (
        <button
          type="button"
          onClick={() => setShowCreateTag(true)}
          className="w-full px-3 py-2 border border-green-300 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition"
        >
          + Criar Nova Tag
        </button>
      )}

      {showCreateTag && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Nome da tag..."
              className="flex-1 px-3 py-1 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              type="button"
              onClick={handleCreateNewTag}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateTag(false)
                setNewTagName('')
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400 transition"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-1">
            {['#16a34a', '#2563eb', '#dc2626', '#ea580c', '#9333ea'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewTagColor(color)}
                className={`w-6 h-6 rounded-full transition ${
                  newTagColor === color ? 'ring-2 ring-offset-1 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tags Selection */}
      {tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (contexto)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex-shrink-0">
                  {selectedTagIds.includes(tag.id) ? '✓' : ''}
                </span>
                {tag.name}
              </button>
            ))}
          </div>
          {selectedTagIds.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {selectedTagIds.length} tag(s) selecionada(s)
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
        >
          {isLoading ? 'Salvando...' : contact ? 'Atualizar' : 'Adicionar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

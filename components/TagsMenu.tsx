'use client'

import { useState } from 'react'
import { Tag, supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface TagsMenuProps {
  tags: Tag[]
  onTagsChange: () => void
}

export default function TagsMenu({ tags, onTagsChange }: TagsMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#16a34a')
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    setIsLoading(true)
    try {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) return

      await supabase.from('tags').insert({
        user_id: userData.session.user.id,
        name: newTagName,
        color: newTagColor,
      })

      setNewTagName('')
      setNewTagColor('#16a34a')
      setShowCreateForm(false)
      onTagsChange()
    } catch (error) {
      console.error('Erro ao criar tag:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTag = async (tagId: string) => {
    if (!editName.trim()) return

    setIsLoading(true)
    try {
      await supabase
        .from('tags')
        .update({ name: editName })
        .eq('id', tagId)

      setEditingTagId(null)
      setEditName('')
      onTagsChange()
    } catch (error) {
      console.error('Erro ao atualizar tag:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    if (confirm('Deseja deletar esta tag?')) {
      setIsLoading(true)
      try {
        await supabase.from('tags').delete().eq('id', tagId)
        onTagsChange()
      } catch (error) {
        console.error('Erro ao deletar tag:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Pesquisar tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Create Form Toggle */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        <Plus className="h-5 w-5" />
        {showCreateForm ? 'Cancelar' : 'Nova Tag'}
      </button>

      {/* Create Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateTag} className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Tag
            </label>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Ex: Projeto X, Cliente A"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor
            </label>
            <div className="flex gap-2">
              {['#16a34a', '#2563eb', '#dc2626', '#ea580c', '#9333ea', '#6366f1'].map(
                (color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewTagColor(color)}
                    className={`w-8 h-8 rounded-full transition ${
                      newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                )
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Criando...' : 'Criar Tag'}
          </button>
        </form>
      )}

      {/* Tags List */}
      <div className="space-y-2">
        {filteredTags.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma tag encontrada</p>
          </div>
        ) : (
          filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color || '#16a34a' }}
                ></span>

                {editingTagId === tag.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium text-gray-900">{tag.name}</span>
                )}
              </div>

              <div className="flex gap-2">
                {editingTagId === tag.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateTag(tag.id)}
                      disabled={isLoading}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingTagId(null)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingTagId(tag.id)
                        setEditName(tag.name)
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

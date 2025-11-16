'use client'

import { useState } from 'react'
import { Tag } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface TagManagerProps {
  tags: Tag[]
  onTagsChange: (tags: Tag[]) => void
}

const COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
]

export default function TagManager({ tags, onTagsChange }: TagManagerProps) {
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    setIsLoading(true)
    try {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData?.session?.user?.id) return

      const { data, error } = await supabase
        .from('tags')
        .insert({
          user_id: userData.session.user.id,
          name: newTagName,
          color: selectedColor,
        })
        .select()

      if (error) throw error

      if (data) {
        onTagsChange([...tags, data[0]])
        setNewTagName('')
        setSelectedColor(COLORS[0])
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase.from('tags').delete().eq('id', tagId)

      if (error) throw error

      onTagsChange(tags.filter((t) => t.id !== tagId))
    } catch (error) {
      console.error('Erro ao deletar tag:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerenciador de Tags</h3>

      {/* Existing Tags */}
      {tags.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tags Ativas</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="ml-1 hover:opacity-70 transition"
                  title="Deletar tag"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Tag Form */}
      <form onSubmit={handleAddTag} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Tag
          </label>
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="ex: UFRJ, Projeto X, Empresa Y"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full transition ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !newTagName.trim()}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
        >
          {isLoading ? 'Criando...' : 'Adicionar Tag'}
        </button>
      </form>
    </div>
  )
}

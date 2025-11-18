'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'

interface Note {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export default function PersonalNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Load notes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('personalNotes')
      if (stored) {
        setNotes(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error)
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('personalNotes', JSON.stringify(notes))
  }, [notes])

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      text: newNote,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setNotes((prev) => [note, ...prev])
    setNewNote('')
  }

  const toggleNote = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    )
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const filteredNotes = notes.filter((note) => {
    if (filter === 'active') return !note.completed
    if (filter === 'completed') return note.completed
    return true
  })

  const activeCount = notes.filter((n) => !n.completed).length
  const completedCount = notes.filter((n) => n.completed).length

  return (
    <div className="space-y-4">
      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Adicionar uma tarefa ou anotação..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'all'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Todas ({notes.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'active'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Ativas ({activeCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'completed'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Completas ({completedCount})
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {filter === 'all'
                ? 'Nenhuma anotação ainda'
                : filter === 'active'
                  ? 'Todas as tarefas concluídas! 🎉'
                  : 'Nenhuma tarefa completa'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-3 hover:shadow-md transition"
            >
              <button
                onClick={() => toggleNote(note.id)}
                className="text-gray-400 hover:text-green-600 transition flex-shrink-0"
              >
                {note.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              <span
                className={`flex-1 ${
                  note.completed
                    ? 'text-gray-400 line-through'
                    : 'text-gray-900'
                }`}
              >
                {note.text}
              </span>

              <button
                onClick={() => deleteNote(note.id)}
                className="text-gray-400 hover:text-red-600 transition flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {notes.length > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-700">
          <p>
            {activeCount === 0
              ? 'Todas as tarefas concluídas! 🎉'
              : `${activeCount} tarefa${activeCount !== 1 ? 's' : ''} pendente${activeCount !== 1 ? 's' : ''}`}
          </p>
        </div>
      )}
    </div>
  )
}

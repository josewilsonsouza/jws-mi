'use client'

import { useState, useEffect } from 'react'
import { Contact, Tag } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { GripVertical, MessageCircle, Trash2 } from 'lucide-react'
import ContactDetailModal from './ContactDetailModal'

type PipelineStage = 'lead' | 'prospect' | 'negotiation' | 'won' | 'lost'

const STAGES: { id: PipelineStage; label: string; color: string; bgColor: string }[] = [
  { id: 'lead', label: '👥 Leads', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 'prospect', label: '🔍 Prospects', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  {
    id: 'negotiation',
    label: '💬 Negociação',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  { id: 'won', label: '✅ Ganho', color: 'text-green-600', bgColor: 'bg-green-50' },
  { id: 'lost', label: '❌ Perdido', color: 'text-red-600', bgColor: 'bg-red-50' }
]

interface PipelineKanbanProps {
  contacts: Contact[]
  tags: Tag[]
  contactTags: Map<string, Tag[]>
  onUpdateContact?: () => void
}

interface DragData {
  contactId: string
  fromStage: PipelineStage
}

export default function PipelineKanban({
  contacts,
  tags,
  contactTags,
  onUpdateContact
}: PipelineKanbanProps) {
  const [contactsByStage, setContactsByStage] = useState<Record<PipelineStage, Contact[]>>({
    lead: [],
    prospect: [],
    negotiation: [],
    won: [],
    lost: []
  })
  const [draggedContact, setDraggedContact] = useState<DragData | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    organizeContactsByStage()
    setIsLoading(false)
  }, [contacts])

  const organizeContactsByStage = () => {
    const organized: Record<PipelineStage, Contact[]> = {
      lead: [],
      prospect: [],
      negotiation: [],
      won: [],
      lost: []
    }

    contacts.forEach((contact) => {
      const stage = (contact.pipeline_stage || 'lead') as PipelineStage
      if (stage in organized) {
        organized[stage].push(contact)
      } else {
        organized.lead.push(contact)
      }
    })

    setContactsByStage(organized)
  }

  const handleDragStart = (e: React.DragEvent, contactId: string, stage: PipelineStage) => {
    setDraggedContact({ contactId, fromStage: stage })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, toStage: PipelineStage) => {
    e.preventDefault()

    if (!draggedContact) return

    try {
      const contact = contacts.find((c) => c.id === draggedContact.contactId)
      if (!contact) return

      // Update contact stage in database
      await supabase
        .from('contacts')
        .update({ pipeline_stage: toStage })
        .eq('id', draggedContact.contactId)

      // Update local state
      organizeContactsByStage()
      if (onUpdateContact) {
        onUpdateContact()
      }
    } catch (error) {
      console.error('Error updating contact stage:', error)
    } finally {
      setDraggedContact(null)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    try {
      await supabase.from('contacts').delete().eq('id', contactId)
      if (onUpdateContact) {
        onUpdateContact()
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const getStageStats = () => {
    const total = contacts.length
    const won = contactsByStage.won.length
    const lost = contactsByStage.lost.length
    const active = total - won - lost

    return {
      total,
      active,
      won,
      lost,
      winRate: total > 0 ? ((won / (won + lost)) * 100).toFixed(1) : '0'
    }
  }

  const stats = getStageStats()

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Carregando pipeline...</div>
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-xs text-gray-600">Ativos</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.won}</div>
          <div className="text-xs text-gray-600">Ganhos</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.winRate}%</div>
          <div className="text-xs text-gray-600">Taxa Ganho</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-h-96">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            className={`${stage.bgColor} rounded-lg p-3 space-y-2`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column Header */}
            <div className={`font-semibold ${stage.color} text-sm`}>
              {stage.label}
              <span className="ml-2 text-xs text-gray-600">
                ({contactsByStage[stage.id].length})
              </span>
            </div>

            {/* Contacts */}
            <div className="space-y-2">
              {contactsByStage[stage.id].map((contact) => (
                <div
                  key={contact.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, contact.id, stage.id)}
                  className="bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition group"
                >
                  {/* Drag Handle */}
                  <div className="flex items-start gap-2 mb-2">
                    <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {contact.name}
                      </h4>
                    </div>
                  </div>

                  {/* Phone */}
                  {contact.phone && (
                    <p className="text-xs text-gray-600 truncate mb-2">{contact.phone}</p>
                  )}

                  {/* Tags */}
                  {contactTags.get(contact.id)?.length ? (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {contactTags.get(contact.id)?.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                      {contactTags.get(contact.id)!.length > 2 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-300 text-gray-700">
                          +{contactTags.get(contact.id)!.length - 2}
                        </span>
                      )}
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="flex-1 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Ver
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {contactsByStage[stage.id].length === 0 && (
                <div className="text-center py-4 text-gray-400 text-xs">
                  Arraste contatos para cá
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          tags={tags}
          contactTags={contactTags.get(selectedContact.id) || []}
          onClose={() => setSelectedContact(null)}
          onEdit={() => {}}
          onDelete={() => {
            setSelectedContact(null)
            if (onUpdateContact) onUpdateContact()
          }}
          onTagsChange={() => {}}
        />
      )}
    </div>
  )
}

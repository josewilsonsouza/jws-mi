'use client'

import { Users, Tag, User, Kanban } from 'lucide-react'

interface BottomTabBarProps {
  activeTab: 'contacts' | 'tags' | 'pipeline' | 'profile'
  onTabChange: (tab: 'contacts' | 'tags' | 'pipeline' | 'profile') => void
}

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const tabs = [
    {
      id: 'contacts' as const,
      label: 'Contatos',
      icon: Users,
    },
    {
      id: 'tags' as const,
      label: 'Tags',
      icon: Tag,
    },
    {
      id: 'pipeline' as const,
      label: 'Pipeline',
      icon: Kanban,
    },
    {
      id: 'profile' as const,
      label: 'Perfil',
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 gap-1 transition-colors ${
                isActive
                  ? 'text-green-600 border-t-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

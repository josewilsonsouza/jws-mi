'use client'

interface BottomNavProps {
  activeTab: 'contacts' | 'tags' | 'profile'
  onTabChange: (tab: 'contacts' | 'tags' | 'profile') => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    {
      id: 'contacts' as const,
      label: 'Contatos',
      icon: '👥',
    },
    {
      id: 'tags' as const,
      label: 'Tags',
      icon: '🏷️',
    },
    {
      id: 'profile' as const,
      label: 'Perfil',
      icon: '⚙️',
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 gap-1 transition-colors ${
              activeTab === tab.id
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

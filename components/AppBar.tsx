'use client'

import { useState } from 'react'

interface AppBarProps {
  title?: string
  showSearch?: boolean
  onSearchChange?: (query: string) => void
  isPremium?: boolean
  contactCount?: number
  maxContacts?: number
}

export default function AppBar({
  title = 'WA Manager',
  showSearch = false,
  onSearchChange,
  isPremium = false,
  contactCount = 0,
  maxContacts = 50,
}: AppBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const isFreeTierMaxed = contactCount >= maxContacts

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearchChange?.(value)
  }

  const handleSearchClear = () => {
    setSearchQuery('')
    onSearchChange?.('')
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              W
            </div>
            <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
              {title}
            </h1>
          </div>

          {/* Search (center on desktop, hidden on mobile) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-xs">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Buscar..."
                  className="w-full px-3 py-1.5 pl-8 bg-gray-100 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                />
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={handleSearchClear}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Premium Badge */}
            {!isPremium && isFreeTierMaxed && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full text-xs font-medium text-blue-600">
                <span>⭐</span>
                <span>Premium</span>
              </div>
            )}

            {isPremium && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-full text-xs font-medium text-yellow-600">
                <span>✓</span>
                <span>Premium</span>
              </div>
            )}

            {/* Search icon mobile */}
            {showSearch && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
                aria-label="Abrir busca"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && searchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar contatos ou tags..."
                autoFocus
                className="w-full px-3 py-2 pl-8 bg-gray-100 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

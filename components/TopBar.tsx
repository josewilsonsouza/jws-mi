'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'

interface TopBarProps {
  title?: string
}

export default function TopBar({ title = 'WhatsApp Manager' }: TopBarProps) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <h1 className="font-semibold text-gray-900">{title}</h1>
        </Link>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          <Search className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  )
}

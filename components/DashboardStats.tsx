'use client'

import { Users, Tag, Star, Crown } from 'lucide-react'

interface DashboardStatsProps {
  contactCount: number
  tagCount: number
  pinnedCount: number
  maxContacts: number
}

export default function DashboardStats({
  contactCount,
  tagCount,
  pinnedCount,
  maxContacts,
}: DashboardStatsProps) {
  const isPremium = false // This will be determined by subscription status
  const isNearLimit = contactCount >= maxContacts - 5

  return (
    <div className="space-y-6 mb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Contacts Stat */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Contatos</h3>
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{contactCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {maxContacts - contactCount} espaços restantes
          </p>
          {isNearLimit && !isPremium && (
            <p className="text-xs text-red-600 mt-2 font-medium">
              ⚠️ Limite próximo
            </p>
          )}
        </div>

        {/* Tags Stat */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Tags</h3>
            <Tag className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{tagCount}</p>
          <p className="text-xs text-gray-500 mt-1">Categories</p>
        </div>

        {/* Pinned Stat */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Fixados</h3>
            <Star className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{pinnedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Important</p>
        </div>

        {/* Premium Stat */}
        <div className={`rounded-lg shadow-sm p-6 border-l-4 ${
          isPremium
            ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-600'
            : 'bg-white border-purple-600'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Status</h3>
            <Crown className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {isPremium ? 'Premium' : 'Free'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isPremium ? 'Sem limites' : 'Até 50 contatos'}
          </p>
        </div>
      </div>

      {/* Premium CTA */}
      {!isPremium && isNearLimit && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 md:p-6">
          <div className="flex items-start gap-4">
            <Crown className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Você está próximo do limite de contatos!
              </h3>
              <p className="text-gray-700 mb-4">
                Faça upgrade para Premium e tenha contatos ilimitados, além de outras features incríveis.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Fazer Upgrade
                </button>
                <button className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition">
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

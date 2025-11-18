'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Crown, LogOut, MessageCircle, Tag, Users } from 'lucide-react'

interface ProfilePageProps {
  userEmail?: string
  contactCount: number
  tagCount: number
}

export default function ProfilePage({
  userEmail,
  contactCount,
  tagCount,
}: ProfilePageProps) {
  const [profileData, setProfileData] = useState({
    displayName: '',
    status: '',
    institution: '',
    avatarUrl: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = () => {
    try {
      const stored = localStorage.getItem('userProfile')
      if (stored) {
        const data = JSON.parse(stored)
        setProfileData(data)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error) {
      console.error('Erro ao desconectar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitial = () => {
    return (profileData.displayName || userEmail)?.[0]?.toUpperCase() || 'U'
  }

  const isPremium = false // TODO: Implementar lógica de premium

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
            {profileData.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-3xl">
                {getInitial()}
              </span>
            )}
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {profileData.displayName || 'Usuário'}
        </h2>
        <p className="text-gray-600 mb-4">{userEmail}</p>

        {/* Status & Institution */}
        {profileData.status && (
          <p className="text-sm text-gray-700 mb-1">
            <strong>Status:</strong> {profileData.status}
          </p>
        )}
        {profileData.institution && (
          <p className="text-sm text-gray-700 mb-4">
            <strong>Instituição:</strong> {profileData.institution}
          </p>
        )}

        {/* Premium Badge */}
        {isPremium ? (
          <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <Crown className="h-4 w-4 inline mr-1" />
            Premium
          </div>
        ) : (
          <button className="inline-block px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition mb-4">
            <Crown className="h-4 w-4 inline mr-1" />
            Upgrade para Premium
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Estatísticas</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Contacts Stat */}
          <div className="flex flex-col items-center p-4 rounded-lg bg-green-50 border border-green-200">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{contactCount}</div>
            <div className="text-sm text-gray-600">Contatos</div>
            {!isPremium && (
              <div className="text-xs text-gray-500 mt-1">
                {contactCount}/50
              </div>
            )}
          </div>

          {/* Tags Stat */}
          <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-200">
            <Tag className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{tagCount}</div>
            <div className="text-sm text-gray-600">Tags</div>
          </div>
        </div>
      </div>

      {/* Premium Section */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-600 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Crown className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Desbloqueie Recursos Premium</h3>
              <p className="text-gray-700 text-sm">Por apenas $4.99/mês</p>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            {[
              'Contatos ilimitados',
              'Tags customizadas ilimitadas',
              'Lembretes de follow-up',
              'Busca avançada',
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
            <Crown className="h-5 w-5" />
            Assinar Premium
          </button>
        </div>
      )}

      {/* About App */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Sobre o App</h3>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Integração WhatsApp
          </h4>
          <p className="text-sm text-gray-600">
            Abra conversas diretamente no WhatsApp com um clique em qualquer contato.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Tag className="h-5 w-5 text-green-600" />
            Organização por Tags
          </h4>
          <p className="text-sm text-gray-600">
            Categorize seus contatos por contexto, projeto, empresa ou qualquer critério que faça sentido para você.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            {isLoading ? 'Desconectando...' : 'Sair'}
          </button>
        </div>
      </div>
    </div>
  )
}

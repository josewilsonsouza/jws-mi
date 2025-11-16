'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface ProfileSectionProps {
  userEmail?: string
}

export default function ProfileSection({ userEmail }: ProfileSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState('')

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setLogoutMessage('Desconectando...')
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (error) {
      console.error('Erro ao desconectar:', error)
      setLogoutMessage('Erro ao desconectar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Meu Perfil</h2>

        {/* User Info */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {userEmail?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">{userEmail || 'Usuário'}</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações da Conta</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
              <span className="text-gray-900">Alterar senha</span>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
              <span className="text-gray-900">Notificações</span>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
              <span className="text-gray-900">Privacidade</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre o App</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>WhatsApp Contact Manager v1.0</p>
            <p className="mt-4">
              Organize seus contatos do WhatsApp com inteligência. Adicione tags, notas e lembretes.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sair</h3>
          <div className="space-y-3">
            {logoutMessage && (
              <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
                {logoutMessage}
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
            >
              {isLoading ? 'Desconectando...' : 'Deslogar'}
            </button>
            <button className="w-full px-4 py-3 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition">
              Deletar Conta
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© 2024 WhatsApp Contact Manager</p>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <a href="#" className="hover:text-green-600">Privacidade</a>
            <a href="#" className="hover:text-green-600">Termos</a>
            <a href="#" className="hover:text-green-600">Contato</a>
          </div>
        </div>
      </div>
    </div>
  )
}

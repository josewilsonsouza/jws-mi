'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Crown } from 'lucide-react'
import PersonalNotes from './PersonalNotes'

interface ProfileSectionProps {
  userEmail?: string
}

export default function ProfileSection({ userEmail }: ProfileSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [profileData, setProfileData] = useState({
    displayName: '',
    status: '',
    institution: '',
    website: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [_showPremiumModal, setShowPremiumModal] = useState(false)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      const stored = localStorage.getItem('userProfile')
      if (stored) {
        const data = JSON.parse(stored)
        setProfileData(data)
        setAvatarUrl(data.avatarUrl || '')
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const dataToSave = {
        ...profileData,
        avatarUrl,
      }
      localStorage.setItem('userProfile', JSON.stringify(dataToSave))
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
    } finally {
      setIsSaving(false)
    }
  }

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

  const getInitial = () => {
    return (profileData.displayName || userEmail)?.[0]?.toUpperCase() || 'U'
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-4">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Meu Perfil</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Avatar
                </label>
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-3xl">
                        {getInitial()}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4 file:rounded-lg
                      file:border-0 file:text-sm file:font-medium
                      file:bg-green-50 file:text-green-600
                      hover:file:bg-green-100 transition"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => handleProfileChange('displayName', e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={profileData.status}
                  onChange={(e) => handleProfileChange('status', e.target.value)}
                  placeholder="Ex: Desenvolvedor, Empreendedor, Estudante"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instituição/Empresa
                </label>
                <input
                  type="text"
                  value={profileData.institution}
                  onChange={(e) => handleProfileChange('institution', e.target.value)}
                  placeholder="Ex: UFRJ, Startup XYZ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website/Portfólio
                </label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                  placeholder="https://seu-site.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Display Profile */}
              <div className="flex items-start gap-6 mb-8">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-3xl">
                      {getInitial()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {profileData.displayName || 'Usuário'}
                  </h3>
                  <p className="text-gray-600 mb-3">{userEmail}</p>
                  {profileData.status && (
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Status:</strong> {profileData.status}
                    </p>
                  )}
                  {profileData.institution && (
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Instituição:</strong> {profileData.institution}
                    </p>
                  )}
                  {profileData.website && (
                    <p className="text-sm text-gray-700">
                      <strong>Website:</strong>{' '}
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        {profileData.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Premium Section */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-600 rounded-lg p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Desbloqueie contatos ilimitados, lembretes avançados e muito mais!
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Contatos ilimitados (atualmente 50)
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Tags customizadas com cores
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Lembretes e notificações avançadas
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Busca avançada e filtros
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Suporte prioritário
                </li>
              </ul>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
              >
                <Crown className="h-5 w-5" />
                Fazer Upgrade - $4.99/mês
              </button>
            </div>
            <div className="hidden md:flex h-40 w-40 rounded-lg bg-green-600 items-center justify-center flex-shrink-0">
              <Crown className="h-20 w-20 text-white" />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm p-8">
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

        {/* Personal Notes */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Minhas Tarefas & Anotações</h3>
          <PersonalNotes />
        </div>

        {/* Logout */}
        <div className="bg-white rounded-lg shadow-sm p-8">
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
        <div className="text-center text-sm text-gray-600 py-4">
          <p>© 2024 WhatsApp Contact Manager</p>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <a href="#" className="hover:text-green-600">
              Privacidade
            </a>
            <a href="#" className="hover:text-green-600">
              Termos
            </a>
            <a href="#" className="hover:text-green-600">
              Contato
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

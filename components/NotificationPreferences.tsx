'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import {
  registerServiceWorker,
  requestNotificationPermission,
  loadNotificationPreferences,
  saveNotificationPreferences,
  scheduleFollowUpChecks
} from '@/lib/push-notifications'
import { Contact } from '@/lib/supabase'

interface NotificationPreferencesProps {
  contacts: Contact[]
  showInline?: boolean
}

export default function NotificationPreferences({
  contacts,
  showInline = true
}: NotificationPreferencesProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [followUpDays, setFollowUpDays] = useState(7)
  const [checkIntervalMinutes, setCheckIntervalMinutes] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationAttempted, setRegistrationAttempted] = useState(false)

  useEffect(() => {
    // Load saved preferences
    const preferences = loadNotificationPreferences()
    setNotificationsEnabled(preferences.enabled)
    setFollowUpDays(preferences.followUpIntervalDays)
    setCheckIntervalMinutes(preferences.checkIntervalMinutes)

    // Try to register service worker on mount
    if (!registrationAttempted) {
      registerServiceWorker()
      setRegistrationAttempted(true)
    }
  }, [registrationAttempted])

  const handleEnableNotifications = async () => {
    setIsLoading(true)
    try {
      const permitted = await requestNotificationPermission()
      if (permitted) {
        setNotificationsEnabled(true)
        saveNotificationPreferences({
          enabled: true,
          followUpIntervalDays: followUpDays,
          checkIntervalMinutes: checkIntervalMinutes
        })

        // Start scheduling follow-up checks
        scheduleFollowUpChecks(contacts, checkIntervalMinutes, followUpDays)
      }
    } catch (error) {
      console.error('Error enabling notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisableNotifications = () => {
    setNotificationsEnabled(false)
    saveNotificationPreferences({
      enabled: false,
      followUpIntervalDays: followUpDays,
      checkIntervalMinutes: checkIntervalMinutes
    })
  }

  const handleFollowUpDaysChange = (days: number) => {
    setFollowUpDays(days)
    saveNotificationPreferences({
      enabled: notificationsEnabled,
      followUpIntervalDays: days,
      checkIntervalMinutes: checkIntervalMinutes
    })
  }

  const handleCheckIntervalChange = (minutes: number) => {
    setCheckIntervalMinutes(minutes)
    saveNotificationPreferences({
      enabled: notificationsEnabled,
      followUpIntervalDays: followUpDays,
      checkIntervalMinutes: minutes
    })
  }

  if (!showInline) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Notification Status */}
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {notificationsEnabled ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <h3 className="font-semibold text-gray-900">Notificações de Lembretes</h3>
          </div>
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${
              notificationsEnabled
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {notificationsEnabled ? 'Ativado' : 'Desativado'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {notificationsEnabled
            ? 'Você receberá notificações para lembretes de contatos que precisam de follow-up.'
            : 'Ative notificações para receber lembretes de contatos que você não contactou há algum tempo.'}
        </p>

        {notificationsEnabled ? (
          <button
            onClick={handleDisableNotifications}
            className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
          >
            Desativar Notificações
          </button>
        ) : (
          <button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Habilitando...' : 'Ativar Notificações'}
          </button>
        )}
      </div>

      {/* Notification Settings */}
      {notificationsEnabled && (
        <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Lembrete após quantos dias sem contato?
            </label>
            <select
              value={followUpDays}
              onChange={(e) => handleFollowUpDaysChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
            >
              <option value={1}>1 dia</option>
              <option value={3}>3 dias</option>
              <option value={7}>1 semana</option>
              <option value={14}>2 semanas</option>
              <option value={30}>1 mês</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Frequência de verificação
            </label>
            <select
              value={checkIntervalMinutes}
              onChange={(e) => handleCheckIntervalChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
            >
              <option value={15}>A cada 15 minutos</option>
              <option value={30}>A cada 30 minutos</option>
              <option value={60}>A cada 1 hora</option>
              <option value={120}>A cada 2 horas</option>
              <option value={240}>A cada 4 horas</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Quanto maior o intervalo, menos bateria você consome
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

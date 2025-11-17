'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AppBar from '@/components/AppBar'
import BottomNav from '@/components/BottomNav'
import ProfileSection from '@/components/ProfileSection'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'contacts' | 'tags' | 'profile'>('contacts')
  const [contactCount, setContactCount] = useState(0)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        setUser(data.session.user)
        // Load contact count
        const { count } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', data.session.user.id)
        setContactCount(count || 0)
      } else {
        window.location.href = '/'
      }
      setLoading(false)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          window.location.href = '/'
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const handleTabChange = (tab: 'contacts' | 'tags' | 'profile') => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:pt-0 pt-14">
      {/* Desktop AppBar */}
      <div className="hidden md:block">
        <AppBar
          title="WA Manager"
          showSearch={activeTab === 'contacts'}
          isPremium={false}
          contactCount={contactCount}
          maxContacts={50}
        />
      </div>

      {/* Mobile AppBar */}
      <div className="md:hidden">
        <AppBar
          title="WA"
          showSearch={activeTab === 'contacts'}
          isPremium={false}
          contactCount={contactCount}
          maxContacts={50}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {activeTab === 'profile' ? (
          <ProfileSection userEmail={user?.email} />
        ) : (
          children
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}

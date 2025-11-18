'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data?.session?.user) {
        window.location.href = '/'
      }
    }

    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          window.location.href = '/'
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return children
}


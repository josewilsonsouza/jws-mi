'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Disable static generation for dashboard routes
export const dynamic = 'force-dynamic'

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
      (_event, session) => {
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


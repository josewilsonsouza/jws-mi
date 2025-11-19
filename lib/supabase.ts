import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a dummy client if credentials are missing (for build time)
// This prevents build failures when environment variables aren't set
const supabase: SupabaseClient = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Only throw error in browser/client context, not during build
    if (typeof window !== 'undefined') {
      throw new Error(
        'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
      )
    }
    // Create a dummy client for server-side builds
    return createClient('https://dummy.supabase.co', 'dummy-key')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
})()

export { supabase }

// Type definitions
export interface Contact {
  id: string
  user_id: string
  name: string
  phone: string
  email?: string
  avatar_url?: string
  last_contact_date?: string
  pipeline_stage?: 'lead' | 'prospect' | 'negotiation' | 'won' | 'lost'
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface ContactTag {
  contact_id: string
  tag_id: string
}

export interface Interaction {
  id: string
  contact_id: string
  last_message?: string
  notes?: string
  last_contact_date?: string
  updated_at: string
}

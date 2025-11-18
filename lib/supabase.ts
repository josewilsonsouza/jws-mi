import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export interface Contact {
  id: string
  user_id: string
  name: string
  phone: string
  email?: string
  avatar_url?: string
  last_contact_date?: string
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

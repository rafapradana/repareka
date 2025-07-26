import { createClient } from '@supabase/supabase-js'

// Konfigurasi Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types untuk database
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  province: string
  city: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Mitra {
  id: string
  email: string
  business_name: string
  phone: string
  address: string
  province: string
  city: string
  business_type: 'individual' | 'small_business' | 'company'
  verification_status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
  created_at: string
  updated_at: string
}

export type UserRole = 'customer' | 'mitra'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile: User | Mitra
}
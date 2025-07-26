// Types untuk authentication system
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

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CustomerRegisterData {
  email: string
  fullName: string
  password: string
  province: string
  city: string
  phone?: string
}

export interface MitraRegisterData {
  email: string
  businessName: string
  phone: string
  password: string
  address: string
  province: string
  city: string
  businessType: 'individual' | 'small_business' | 'company'
}
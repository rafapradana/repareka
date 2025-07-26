import { supabase } from '../supabase'
import type { AuthUser, User, Mitra, UserRole, LoginCredentials, CustomerRegisterData, MitraRegisterData } from './types'

/**
 * Utility functions untuk session management dan token handling
 */

// Mendapatkan session saat ini
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting current session:', error)
    return null
  }
}

// Mendapatkan user profile berdasarkan role
export async function getUserProfile(userId: string, role: UserRole): Promise<User | Mitra | null> {
  try {
    if (role === 'customer') {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data as User
    } else {
      const { data, error } = await supabase
        .from('mitra')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data as Mitra
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Menentukan role user berdasarkan metadata atau tabel
export async function determineUserRole(userId: string): Promise<UserRole | null> {
  try {
    // Cek di tabel users terlebih dahulu
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (userData && !userError) {
      return 'customer'
    }
    
    // Jika tidak ada di users, cek di tabel mitra
    const { data: mitraData, error: mitraError } = await supabase
      .from('mitra')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (mitraData && !mitraError) {
      return 'mitra'
    }
    
    return null
  } catch (error) {
    console.error('Error determining user role:', error)
    return null
  }
}

// Login function
export async function loginUser(credentials: LoginCredentials): Promise<AuthUser | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })
    
    if (error) throw error
    if (!data.user) return null
    
    const role = await determineUserRole(data.user.id)
    if (!role) throw new Error('User role tidak ditemukan')
    
    const profile = await getUserProfile(data.user.id, role)
    if (!profile) throw new Error('User profile tidak ditemukan')
    
    return {
      id: data.user.id,
      email: data.user.email!,
      role,
      profile
    }
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

// Register customer function
export async function registerCustomer(data: CustomerRegisterData): Promise<AuthUser | null> {
  try {
    // Buat auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })
    
    if (authError) throw authError
    if (!authData.user) throw new Error('Gagal membuat user')
    
    // Buat profile di tabel users
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        province: data.province,
        city: data.city
      })
      .select()
      .single()
    
    if (profileError) throw profileError
    
    return {
      id: authData.user.id,
      email: authData.user.email!,
      role: 'customer',
      profile: profileData as User
    }
  } catch (error) {
    console.error('Error registering customer:', error)
    throw error
  }
}

// Register mitra function
export async function registerMitra(data: MitraRegisterData): Promise<AuthUser | null> {
  try {
    // Buat auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })
    
    if (authError) throw authError
    if (!authData.user) throw new Error('Gagal membuat user')
    
    // Buat profile di tabel mitra
    const { data: profileData, error: profileError } = await supabase
      .from('mitra')
      .insert({
        id: authData.user.id,
        email: data.email,
        business_name: data.businessName,
        phone: data.phone,
        address: data.address,
        province: data.province,
        city: data.city,
        business_type: data.businessType,
        verification_status: 'pending',
        is_active: false
      })
      .select()
      .single()
    
    if (profileError) throw profileError
    
    // Kirim notifikasi ke admin (async, tidak mengganggu proses registrasi)
    const mitraProfile = profileData as Mitra
    try {
      const { sendAllAdminNotifications } = await import('@/lib/notifications/admin')
      // Jalankan di background tanpa menunggu
      sendAllAdminNotifications(mitraProfile).catch(error => {
        console.error('Error sending admin notifications:', error)
      })
    } catch (error) {
      console.error('Error importing admin notifications:', error)
    }
    
    return {
      id: authData.user.id,
      email: authData.user.email!,
      role: 'mitra',
      profile: mitraProfile
    }
  } catch (error) {
    console.error('Error registering mitra:', error)
    throw error
  }
}

// Logout function
export async function logoutUser(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error logging out:', error)
    throw error
  }
}

// Refresh session
export async function refreshSession(): Promise<AuthUser | null> {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) throw error
    if (!data.user) return null
    
    const role = await determineUserRole(data.user.id)
    if (!role) return null
    
    const profile = await getUserProfile(data.user.id, role)
    if (!profile) return null
    
    return {
      id: data.user.id,
      email: data.user.email!,
      role,
      profile
    }
  } catch (error) {
    console.error('Error refreshing session:', error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return !!session
}

// Get current authenticated user
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await getCurrentSession()
    if (!session?.user) return null
    
    const role = await determineUserRole(session.user.id)
    if (!role) return null
    
    const profile = await getUserProfile(session.user.id, role)
    if (!profile) return null
    
    return {
      id: session.user.id,
      email: session.user.email!,
      role,
      profile
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
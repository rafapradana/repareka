'use client'

import { useAuth } from './useAuth'
import type { User } from '@/lib/auth/types'

/**
 * Custom hook khusus untuk customer user
 * Hanya mengembalikan data jika user adalah customer
 */
export function useUser() {
  const { user, isCustomer, loading, error } = useAuth()
  
  // Type guard untuk memastikan user adalah customer
  const customerProfile = isCustomer && user ? (user.profile as User) : null
  
  return {
    // User data (hanya jika customer)
    user: customerProfile,
    
    // Status
    loading,
    error,
    isCustomer,
    
    // Helper functions
    getFullName: () => customerProfile?.full_name || null,
    getPhone: () => customerProfile?.phone || null,
    getLocation: () => customerProfile ? {
      province: customerProfile.province,
      city: customerProfile.city,
      address: customerProfile.address
    } : null,
    getAvatarUrl: () => customerProfile?.avatar_url || null,
    
    // Check if user data is available
    hasProfile: !!customerProfile,
  }
}
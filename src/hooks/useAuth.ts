'use client'

import { useAuthContext } from '@/contexts/AuthContext'
// Import types hanya untuk type annotations, tidak untuk runtime

/**
 * Custom hook untuk authentication
 * Menyediakan akses ke auth state dan functions
 */
export function useAuth() {
  const context = useAuthContext()
  
  return {
    // Auth state
    user: context.user,
    loading: context.loading,
    error: context.error,
    
    // Auth status checks
    isAuthenticated: !!context.user,
    isCustomer: context.user?.role === 'customer',
    isMitra: context.user?.role === 'mitra',
    
    // Auth actions
    login: context.login,
    registerAsCustomer: context.registerAsCustomer,
    registerAsMitra: context.registerAsMitra,
    logout: context.logout,
    refreshUser: context.refreshUser,
    
    // Helper functions
    getUserRole: () => context.user?.role || null,
    getUserId: () => context.user?.id || null,
    getUserEmail: () => context.user?.email || null,
  }
}
'use client'

import { useAuth } from './useAuth'
import type { Mitra } from '@/lib/auth/types'

/**
 * Custom hook khusus untuk mitra user
 * Hanya mengembalikan data jika user adalah mitra
 */
export function useMitra() {
  const { user, isMitra, loading, error } = useAuth()
  
  // Type guard untuk memastikan user adalah mitra
  const mitraProfile = isMitra && user ? (user.profile as Mitra) : null
  
  return {
    // Mitra data (hanya jika mitra)
    mitra: mitraProfile,
    
    // Status
    loading,
    error,
    isMitra,
    
    // Verification status checks
    isPending: mitraProfile?.verification_status === 'pending',
    isApproved: mitraProfile?.verification_status === 'approved',
    isRejected: mitraProfile?.verification_status === 'rejected',
    isActive: mitraProfile?.is_active || false,
    
    // Helper functions
    getBusinessName: () => mitraProfile?.business_name || null,
    getPhone: () => mitraProfile?.phone || null,
    getBusinessType: () => mitraProfile?.business_type || null,
    getLocation: () => mitraProfile ? {
      province: mitraProfile.province,
      city: mitraProfile.city,
      address: mitraProfile.address
    } : null,
    getVerificationStatus: () => mitraProfile?.verification_status || null,
    
    // Status helper functions
    canAccessDashboard: () => mitraProfile?.verification_status === 'approved' && mitraProfile?.is_active,
    needsVerification: () => mitraProfile?.verification_status === 'pending',
    isVerificationRejected: () => mitraProfile?.verification_status === 'rejected',
    
    // Check if mitra data is available
    hasProfile: !!mitraProfile,
  }
}
'use client'

import { useCallback } from 'react'
import { useAuth } from './useAuth'
import { useGuestAccess } from './useGuestAccess'

/**
 * Hook untuk mengelola akses fitur berdasarkan authentication status
 * Requirement 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
export function useFeatureAccess() {
  const { isAuthenticated, user } = useAuth()
  const guestAccess = useGuestAccess()

  /**
   * Check apakah user dapat mengakses fitur booking
   */
  const canBook = useCallback(() => {
    return isAuthenticated && user?.role === 'customer'
  }, [isAuthenticated, user])

  /**
   * Check apakah user dapat mengakses fitur chat
   */
  const canChat = useCallback(() => {
    return isAuthenticated
  }, [isAuthenticated])

  /**
   * Check apakah user dapat memberikan review
   */
  const canReview = useCallback(() => {
    return isAuthenticated && user?.role === 'customer'
  }, [isAuthenticated, user])

  /**
   * Check apakah user dapat menyimpan favorit
   */
  const canFavorite = useCallback(() => {
    return isAuthenticated && user?.role === 'customer'
  }, [isAuthenticated, user])

  /**
   * Check apakah user dapat mengakses dashboard mitra
   */
  const canAccessMitraDashboard = useCallback(() => {
    return isAuthenticated && user?.role === 'mitra'
  }, [isAuthenticated, user])

  /**
   * Check apakah user dapat mengedit profil UMKM
   */
  const canEditMitraProfile = useCallback(() => {
    return isAuthenticated && user?.role === 'mitra'
  }, [isAuthenticated, user])

  /**
   * Attempt to access booking feature dengan guest handling
   */
  const attemptBooking = useCallback(() => {
    if (canBook()) {
      return true
    }
    return guestAccess.requireAuthForBooking()
  }, [canBook, guestAccess])

  /**
   * Attempt to access chat feature dengan guest handling
   */
  const attemptChat = useCallback(() => {
    if (canChat()) {
      return true
    }
    return guestAccess.requireAuthForChat()
  }, [canChat, guestAccess])

  /**
   * Attempt to access review feature dengan guest handling
   */
  const attemptReview = useCallback(() => {
    if (canReview()) {
      return true
    }
    return guestAccess.requireAuthForReview()
  }, [canReview, guestAccess])

  /**
   * Attempt to access favorite feature dengan guest handling
   */
  const attemptFavorite = useCallback(() => {
    if (canFavorite()) {
      return true
    }
    return guestAccess.requireAuthForFavorite()
  }, [canFavorite, guestAccess])

  /**
   * Attempt to access mitra dashboard dengan guest handling
   */
  const attemptMitraDashboard = useCallback(() => {
    if (canAccessMitraDashboard()) {
      return true
    }
    return guestAccess.requireAuthForDashboard()
  }, [canAccessMitraDashboard, guestAccess])

  /**
   * Get feature restrictions untuk UI display
   */
  const getFeatureRestrictions = useCallback(() => {
    if (isAuthenticated) {
      return {
        canBrowse: true,
        canViewProfile: true,
        canBook: canBook(),
        canChat: canChat(),
        canReview: canReview(),
        canFavorite: canFavorite(),
        canAccessDashboard: canAccessMitraDashboard(),
        canEditProfile: canEditMitraProfile(),
        restrictionReason: null
      }
    }

    return {
      canBrowse: true, // Guest selalu bisa browse
      canViewProfile: true, // Guest bisa view profile read-only
      canBook: false,
      canChat: false,
      canReview: false,
      canFavorite: false,
      canAccessDashboard: false,
      canEditProfile: false,
      restrictionReason: 'Silakan login untuk mengakses fitur ini'
    }
  }, [isAuthenticated, canBook, canChat, canReview, canFavorite, canAccessMitraDashboard, canEditMitraProfile])

  return {
    // Auth status
    userRole: user?.role || null,
    
    // Permission checks
    canBook,
    canChat,
    canReview,
    canFavorite,
    canAccessMitraDashboard,
    canEditMitraProfile,
    
    // Attempt actions (dengan guest handling)
    attemptBooking,
    attemptChat,
    attemptReview,
    attemptFavorite,
    attemptMitraDashboard,
    
    // Guest access utilities
    ...guestAccess,
    
    // Feature restrictions summary
    getFeatureRestrictions
  }
}
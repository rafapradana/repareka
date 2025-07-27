'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './useAuth'
import { 
  initGuestSession, 
  trackLoginPromptShown, 
  trackLoginPromptDismissed,
  clearGuestSession
} from '@/lib/guest/session'

interface GuestAccessOptions {
  feature: string
  title?: string
  message?: string
  preferredUserType?: 'customer' | 'mitra'
}

/**
 * Hook untuk mengelola akses guest dan menampilkan login prompt
 * Requirement 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
export function useGuestAccess() {
  const { isAuthenticated } = useAuth()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [promptConfig, setPromptConfig] = useState<{
    title: string
    message: string
    returnUrl?: string
    preferredUserType: 'customer' | 'mitra'
  }>({
    title: '',
    message: '',
    preferredUserType: 'customer'
  })

  /**
   * Check apakah user dapat mengakses fitur tertentu
   * Jika guest, akan menampilkan login prompt
   */
  const checkAccess = useCallback((options: GuestAccessOptions): boolean => {
    if (isAuthenticated) {
      return true
    }

    // Konfigurasi default untuk berbagai fitur
    const featureConfig = {
      booking: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk melakukan booking layanan reparasi.',
        preferredUserType: 'customer' as const
      },
      chat: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk mengirim pesan kepada penyedia jasa.',
        preferredUserType: 'customer' as const
      },
      review: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk memberikan ulasan dan rating.',
        preferredUserType: 'customer' as const
      },
      favorite: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk menyimpan layanan ke favorit Anda.',
        preferredUserType: 'customer' as const
      },
      profile_edit: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk mengedit profil UMKM.',
        preferredUserType: 'mitra' as const
      },
      dashboard: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk mengakses dashboard mitra.',
        preferredUserType: 'mitra' as const
      }
    }

    const config = featureConfig[options.feature as keyof typeof featureConfig] || {
      title: options.title || 'Login Diperlukan',
      message: options.message || 'Silakan login untuk mengakses fitur ini.',
      preferredUserType: options.preferredUserType || 'customer'
    }

    // Set konfigurasi prompt dan tampilkan
    setPromptConfig({
      ...config,
      returnUrl: window.location.pathname + window.location.search
    })
    setShowLoginPrompt(true)

    return false
  }, [isAuthenticated])

  // Initialize guest session saat hook pertama kali digunakan
  useEffect(() => {
    if (!isAuthenticated) {
      initGuestSession()
    } else {
      // Clear guest session saat user login
      clearGuestSession()
    }
  }, [isAuthenticated])

  const closeLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false)
    trackLoginPromptDismissed()
  }, [])

  // Enhanced checkAccess dengan tracking
  const checkAccessWithTracking = useCallback((options: GuestAccessOptions): boolean => {
    if (isAuthenticated) {
      return true
    }

    // Track login prompt shown
    trackLoginPromptShown()

    // Konfigurasi default untuk berbagai fitur
    const featureConfig = {
      booking: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk melakukan booking layanan reparasi.',
        preferredUserType: 'customer' as const
      },
      chat: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk mengirim pesan kepada penyedia jasa.',
        preferredUserType: 'customer' as const
      },
      review: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk memberikan ulasan dan rating.',
        preferredUserType: 'customer' as const
      },
      favorite: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk menyimpan layanan ke favorit Anda.',
        preferredUserType: 'customer' as const
      },
      profile_edit: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk mengedit profil UMKM.',
        preferredUserType: 'mitra' as const
      },
      dashboard: {
        title: 'Login Diperlukan',
        message: 'Silakan login untuk mengakses dashboard mitra.',
        preferredUserType: 'mitra' as const
      }
    }

    const config = featureConfig[options.feature as keyof typeof featureConfig] || {
      title: options.title || 'Login Diperlukan',
      message: options.message || 'Silakan login untuk mengakses fitur ini.',
      preferredUserType: options.preferredUserType || 'customer'
    }

    // Set konfigurasi prompt dan tampilkan
    setPromptConfig({
      ...config,
      returnUrl: window.location.pathname + window.location.search
    })
    setShowLoginPrompt(true)

    return false
  }, [isAuthenticated])

  /**
   * Shortcut methods untuk fitur-fitur umum dengan tracking
   */
  const requireAuthForBooking = useCallback(() => {
    return checkAccessWithTracking({ feature: 'booking' })
  }, [checkAccessWithTracking])

  const requireAuthForChat = useCallback(() => {
    return checkAccessWithTracking({ feature: 'chat' })
  }, [checkAccessWithTracking])

  const requireAuthForReview = useCallback(() => {
    return checkAccessWithTracking({ feature: 'review' })
  }, [checkAccessWithTracking])

  const requireAuthForFavorite = useCallback(() => {
    return checkAccessWithTracking({ feature: 'favorite' })
  }, [checkAccessWithTracking])

  const requireAuthForDashboard = useCallback(() => {
    return checkAccessWithTracking({ feature: 'dashboard', preferredUserType: 'mitra' })
  }, [checkAccessWithTracking])

  return {
    // State
    isAuthenticated,
    showLoginPrompt,
    promptConfig,
    
    // Methods
    checkAccess,
    requireAuthForBooking,
    requireAuthForChat,
    requireAuthForReview,
    requireAuthForFavorite,
    requireAuthForDashboard,
    closeLoginPrompt,
    
    // Helper untuk guest browsing
    canBrowseServices: true, // Guest selalu bisa browse services (Requirement 6.1)
    canViewProfile: true,    // Guest bisa view profile dalam read-only mode (Requirement 6.2)
  }
}
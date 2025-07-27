'use client'

import { useEffect, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { GuestBanner } from './GuestBanner'
import { checkAuthRedirect } from '@/lib/auth/redirect'

interface GuestModeWrapperProps {
  children: ReactNode
  showGuestBanner?: boolean
}

/**
 * Wrapper component untuk menangani guest mode functionality
 * Requirement 6.1 - Setup guest browsing functionality untuk homepage
 */
export function GuestModeWrapper({ children, showGuestBanner = true }: GuestModeWrapperProps) {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Check jika ada redirect parameter dari URL
    const { shouldShowLogin, redirectUrl } = checkAuthRedirect()
    
    if (shouldShowLogin && !isAuthenticated) {
      // Trigger login modal jika diperlukan
      // Ini akan ditangani oleh komponen parent (homepage)
      console.log('Should show login modal with redirect:', redirectUrl)
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-background">
      {/* Guest Banner - hanya tampil untuk guest users */}
      {showGuestBanner && <GuestBanner />}
      
      {/* Main Content */}
      <div className="relative">
        {children}
      </div>
      
      {/* Guest Mode Indicator (untuk development) */}
      {!isAuthenticated && process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-lg shadow-lg">
          🔓 Guest Mode Active
        </div>
      )}
    </div>
  )
}
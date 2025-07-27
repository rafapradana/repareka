'use client'

import { ReactNode } from 'react'
import { User, Building2, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface GuestEmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  showAuthPrompt?: boolean
  authPromptText?: string
  onAuthClick?: (userType: 'customer' | 'mitra') => void
  children?: ReactNode
}

/**
 * Empty state component yang guest-friendly
 * Menampilkan pesan yang berbeda untuk guest vs authenticated users
 */
export function GuestEmptyState({
  icon = <Search className="w-12 h-12" />,
  title,
  description,
  showAuthPrompt = true,
  authPromptText = "Daftar sekarang untuk mengakses lebih banyak fitur!",
  onAuthClick,
  children
}: GuestEmptyStateProps) {
  const { isAuthenticated } = useAuth()

  const handleAuthClick = (userType: 'customer' | 'mitra') => {
    if (onAuthClick) {
      onAuthClick(userType)
    } else {
      const currentUrl = window.location.pathname + window.location.search
      
      if (userType === 'mitra') {
        window.location.href = `/mitra?redirect=${encodeURIComponent(currentUrl)}`
      } else {
        window.location.href = `/?login=true&redirect=${encodeURIComponent(currentUrl)}`
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="text-base-400 dark:text-base-600 mb-4">
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-base-800 dark:text-base-200 mb-2">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-base-600 dark:text-base-400 mb-6 max-w-md">
        {description}
      </p>
      
      {/* Auth Prompt untuk Guest */}
      {!isAuthenticated && showAuthPrompt && (
        <div className="bg-base-50 dark:bg-base-800 rounded-lg p-6 max-w-md w-full">
          <p className="text-sm text-base-700 dark:text-base-300 mb-4">
            {authPromptText}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleAuthClick('customer')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <User className="w-4 h-4" />
              Daftar sebagai Customer
            </button>
            
            <button
              onClick={() => handleAuthClick('mitra')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Daftar sebagai Mitra
            </button>
          </div>
        </div>
      )}
      
      {/* Custom children */}
      {children}
    </div>
  )
}
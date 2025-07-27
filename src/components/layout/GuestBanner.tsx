'use client'

import { useState } from 'react'
import { X, User, Building2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * Banner untuk guest users yang mendorong mereka untuk mendaftar
 * Requirement 6.1 - Guest dapat browse homepage tanpa batasan
 */
export function GuestBanner() {
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(true)

  // Jangan tampilkan banner jika user sudah authenticated atau banner di-dismiss
  if (isAuthenticated || !isVisible) {
    return null
  }

  const handleLoginRedirect = (userType: 'customer' | 'mitra') => {
    const currentUrl = window.location.pathname + window.location.search
    
    if (userType === 'mitra') {
      window.location.href = `/mitra?redirect=${encodeURIComponent(currentUrl)}`
    } else {
      window.location.href = `/?login=true&redirect=${encodeURIComponent(currentUrl)}`
    }
  }

  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 border-b border-primary-200 dark:border-primary-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-primary-800 dark:text-primary-200">
                <span className="font-medium">Selamat datang di Repareka!</span>
                {' '}Daftar sekarang untuk mengakses fitur booking, chat, dan ulasan.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLoginRedirect('customer')}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
              >
                <User className="w-4 h-4" />
                Daftar Customer
              </button>
              
              <button
                onClick={() => handleLoginRedirect('mitra')}
                className="flex items-center gap-1 px-3 py-1.5 border border-primary-500 text-primary-600 dark:text-primary-400 text-sm rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
              >
                <Building2 className="w-4 h-4" />
                Daftar Mitra
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-full transition-colors ml-4"
          >
            <X className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
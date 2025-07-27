'use client'

import { useState } from 'react'
import { X, User, Building2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface LoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  returnUrl?: string
  preferredUserType?: 'customer' | 'mitra'
}

/**
 * Modal untuk prompting login saat guest user mencoba akses fitur terbatas
 * Requirement 6.3, 6.4, 6.5
 */
export function LoginPromptModal({
  isOpen,
  onClose,
  title,
  message,
  returnUrl,
  preferredUserType = 'customer'
}: LoginPromptModalProps) {
  const [selectedUserType, setSelectedUserType] = useState<'customer' | 'mitra'>(preferredUserType)


  if (!isOpen) return null

  const handleLoginRedirect = () => {
    const currentUrl = returnUrl || window.location.pathname + window.location.search
    
    if (selectedUserType === 'mitra') {
      window.location.href = `/mitra?redirect=${encodeURIComponent(currentUrl)}`
    } else {
      window.location.href = `/?login=true&redirect=${encodeURIComponent(currentUrl)}`
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-base-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-base-800 dark:text-base-200">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-base-100 dark:hover:bg-base-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-base-600 dark:text-base-400" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-base-600 dark:text-base-400 mb-4">
            {message}
          </p>

          {/* User Type Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-base-700 dark:text-base-300">
              Masuk sebagai:
            </p>
            
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-base-200 dark:border-base-700 rounded-lg cursor-pointer hover:bg-base-50 dark:hover:bg-base-800 transition-colors">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={selectedUserType === 'customer'}
                  onChange={(e) => setSelectedUserType(e.target.value as 'customer')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedUserType === 'customer' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-base-300 dark:border-base-600'
                }`}>
                  {selectedUserType === 'customer' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <User className="w-5 h-5 text-base-600 dark:text-base-400 mr-3" />
                <div>
                  <div className="font-medium text-base-800 dark:text-base-200">
                    Customer
                  </div>
                  <div className="text-sm text-base-600 dark:text-base-400">
                    Saya ingin mencari jasa reparasi
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-base-200 dark:border-base-700 rounded-lg cursor-pointer hover:bg-base-50 dark:hover:bg-base-800 transition-colors">
                <input
                  type="radio"
                  name="userType"
                  value="mitra"
                  checked={selectedUserType === 'mitra'}
                  onChange={(e) => setSelectedUserType(e.target.value as 'mitra')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedUserType === 'mitra' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-base-300 dark:border-base-600'
                }`}>
                  {selectedUserType === 'mitra' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <Building2 className="w-5 h-5 text-base-600 dark:text-base-400 mr-3" />
                <div>
                  <div className="font-medium text-base-800 dark:text-base-200">
                    Mitra UMKM
                  </div>
                  <div className="text-sm text-base-600 dark:text-base-400">
                    Saya penyedia jasa reparasi
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-base-600 dark:text-base-400 border border-base-200 dark:border-base-700 rounded-lg hover:bg-base-50 dark:hover:bg-base-800 transition-colors"
          >
            Nanti Saja
          </button>
          <button
            onClick={handleLoginRedirect}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Masuk untuk Melanjutkan
          </button>
        </div>
      </div>
    </div>
  )
}
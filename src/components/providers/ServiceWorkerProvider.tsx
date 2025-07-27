'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useServiceWorker } from '@/hooks/useServiceWorker'

interface ServiceWorkerContextType {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  updateAvailable: boolean
  updateServiceWorker: () => void
  unregisterServiceWorker: () => Promise<boolean>
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(null)

export function useServiceWorkerContext() {
  const context = useContext(ServiceWorkerContext)
  if (!context) {
    throw new Error('useServiceWorkerContext must be used within ServiceWorkerProvider')
  }
  return context
}

interface ServiceWorkerProviderProps {
  children: React.ReactNode
}

/**
 * Provider untuk mengelola service worker di seluruh aplikasi
 * Menyediakan context untuk status dan kontrol service worker
 */
export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const serviceWorker = useServiceWorker()
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  // Show update prompt ketika ada update tersedia
  useEffect(() => {
    if (serviceWorker.updateAvailable) {
      setShowUpdatePrompt(true)
    }
  }, [serviceWorker.updateAvailable])

  const handleUpdate = () => {
    serviceWorker.updateServiceWorker()
    setShowUpdatePrompt(false)
  }

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false)
  }

  return (
    <ServiceWorkerContext.Provider value={serviceWorker}>
      {children}
      
      {/* Update Prompt */}
      {showUpdatePrompt && (
        <UpdatePrompt
          onUpdate={handleUpdate}
          onDismiss={handleDismissUpdate}
        />
      )}
      
      {/* Offline Indicator */}
      {!serviceWorker.isOnline && <OfflineIndicator />}
    </ServiceWorkerContext.Provider>
  )
}

/**
 * Komponen untuk menampilkan prompt update aplikasi
 */
interface UpdatePromptProps {
  onUpdate: () => void
  onDismiss: () => void
}

function UpdatePrompt({ onUpdate, onDismiss }: UpdatePromptProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-primary-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground">
              Update Tersedia
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Versi baru aplikasi telah tersedia. Update sekarang untuk mendapatkan fitur terbaru.
            </p>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={onUpdate}
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Update
              </button>
              <button
                onClick={onDismiss}
                className="bg-accent text-foreground px-3 py-1.5 rounded text-sm font-medium hover:bg-accent/80 transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>
          
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
          >
            <svg 
              className="w-4 h-4 text-muted-foreground" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Komponen untuk menampilkan indikator offline
 */
function OfflineIndicator() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay untuk menghindari flash saat loading
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
        <div className="flex items-center justify-center space-x-2">
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
          <span>Anda sedang offline. Beberapa fitur mungkin tidak tersedia.</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook untuk menggunakan service worker context dengan error handling
 */
export function useServiceWorkerSafe() {
  try {
    return useServiceWorkerContext()
  } catch {
    // Fallback jika tidak dalam provider
    return {
      isSupported: false,
      isRegistered: false,
      isOnline: true,
      updateAvailable: false,
      updateServiceWorker: () => {},
      unregisterServiceWorker: async () => false
    }
  }
}
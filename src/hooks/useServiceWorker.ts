'use client'

import { useEffect, useState } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  updateAvailable: boolean
  registration: ServiceWorkerRegistration | null
}

/**
 * Hook untuk mengelola service worker registration dan status
 */
export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: true,
    updateAvailable: false,
    registration: null
  })

  useEffect(() => {
    // Cek support untuk service worker
    const isSupported = 'serviceWorker' in navigator

    if (!isSupported) {
      setState(prev => ({ ...prev, isSupported: false }))
      return
    }

    setState(prev => ({ ...prev, isSupported: true }))

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        console.log('Service Worker registered successfully:', registration)

        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration
        }))

        // Listen untuk updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Update tersedia
                setState(prev => ({ ...prev, updateAvailable: true }))
              }
            })
          }
        })

        // Listen untuk controller change (setelah update)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })

      } catch (error) {
        console.error('Service Worker registration failed:', error)
        setState(prev => ({ ...prev, isRegistered: false }))
      }
    }

    registerServiceWorker()

    // Listen untuk online/offline status
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set initial online status
    setState(prev => ({ ...prev, isOnline: navigator.onLine }))

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Function untuk update service worker
  const updateServiceWorker = () => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  // Function untuk unregister service worker
  const unregisterServiceWorker = async () => {
    if (state.registration) {
      const success = await state.registration.unregister()
      if (success) {
        setState(prev => ({ ...prev, isRegistered: false, registration: null }))
      }
      return success
    }
    return false
  }

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker
  }
}

/**
 * Hook untuk mengelola offline storage dan sync
 */
export function useOfflineStorage() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Function untuk menyimpan data offline
  const storeOfflineData = async (key: string, data: unknown) => {
    try {
      const serializedData = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: 1
      })
      
      localStorage.setItem(`offline_${key}`, serializedData)
      return true
    } catch (error) {
      console.error('Failed to store offline data:', error)
      return false
    }
  }

  // Function untuk mengambil data offline
  const getOfflineData = (key: string) => {
    try {
      const stored = localStorage.getItem(`offline_${key}`)
      if (!stored) return null

      const parsed = JSON.parse(stored)
      
      // Cek apakah data masih valid (24 jam)
      const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000
      if (isExpired) {
        localStorage.removeItem(`offline_${key}`)
        return null
      }

      return parsed.data
    } catch (error) {
      console.error('Failed to get offline data:', error)
      return null
    }
  }

  // Function untuk menghapus data offline
  const clearOfflineData = (key?: string) => {
    if (key) {
      localStorage.removeItem(`offline_${key}`)
    } else {
      // Hapus semua offline data
      const keys = Object.keys(localStorage).filter(k => k.startsWith('offline_'))
      keys.forEach(k => localStorage.removeItem(k))
    }
  }

  // Function untuk queue offline actions
  const queueOfflineAction = async (action: Record<string, unknown>) => {
    try {
      const existingQueue = getOfflineData('action_queue') || []
      const newQueue = [...existingQueue, {
        ...action,
        id: Date.now().toString(),
        timestamp: Date.now()
      }]
      
      await storeOfflineData('action_queue', newQueue)
      
      // Trigger background sync jika tersedia
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register('background-sync')
      }
      
      return true
    } catch (error) {
      console.error('Failed to queue offline action:', error)
      return false
    }
  }

  return {
    isOffline,
    storeOfflineData,
    getOfflineData,
    clearOfflineData,
    queueOfflineAction
  }
}
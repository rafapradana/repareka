'use client'

import { useState, useEffect } from 'react'

interface MobileDetection {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  screenWidth: number
  screenHeight: number
}

/**
 * Hook untuk mendeteksi device mobile dan touch capabilities
 * Menggunakan responsive breakpoints dan touch detection
 */
export function useMobile(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenWidth: 1024,
    screenHeight: 768
  })

  useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Breakpoints sesuai dengan Tailwind CSS
      const isMobile = width < 768 // sm breakpoint
      const isTablet = width >= 768 && width < 1024 // md breakpoint
      const isDesktop = width >= 1024 // lg breakpoint
      
      // Deteksi touch device
      const isTouchDevice = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        // @ts-expect-error - untuk compatibility dengan browser lama
        navigator.msMaxTouchPoints > 0

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        screenWidth: width,
        screenHeight: height
      })
    }

    // Initial detection
    updateDetection()

    // Listen untuk resize events
    window.addEventListener('resize', updateDetection)
    window.addEventListener('orientationchange', updateDetection)

    return () => {
      window.removeEventListener('resize', updateDetection)
      window.removeEventListener('orientationchange', updateDetection)
    }
  }, [])

  return detection
}

/**
 * Hook untuk mendeteksi orientation changes
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}

/**
 * Hook untuk mendeteksi safe area insets (untuk notch devices)
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  })

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0')
      })
    }

    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)

    return () => {
      window.removeEventListener('resize', updateSafeArea)
    }
  }, [])

  return safeArea
}
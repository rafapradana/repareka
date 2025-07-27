'use client'

import React, { useEffect } from 'react'
import { PerformanceMonitor, PerformanceBadge } from '@/components/performance/PerformanceMonitor'
import { preloadCriticalComponents } from '@/components/performance/LazyRoutes'
import { addResourceHints, optimizeServiceWorkerCache, MemoryManager } from '@/utils/bundleOptimization'
import { useMobile } from '@/hooks/useMobile'
import { useServiceWorkerSafe } from '@/components/providers/ServiceWorkerProvider'

interface MobileOptimizedAppProps {
  children: React.ReactNode
}

/**
 * Wrapper komponen yang mengoptimalkan aplikasi untuk mobile
 * Menggabungkan semua optimasi performance dan mobile responsiveness
 */
export function MobileOptimizedApp({ children }: MobileOptimizedAppProps) {
  const { isMobile, isTouchDevice } = useMobile()
  const { isOnline } = useServiceWorkerSafe()

  useEffect(() => {
    // Initialize optimizations
    const initializeOptimizations = async () => {
      try {
        // Add resource hints untuk better loading
        addResourceHints()

        // Optimize service worker cache
        optimizeServiceWorkerCache()

        // Preload critical components setelah initial load
        preloadCriticalComponents()

        // Setup viewport optimizations untuk mobile
        if (isMobile) {
          setupMobileViewport()
        }

        // Setup touch optimizations
        if (isTouchDevice) {
          setupTouchOptimizations()
        }

        // Setup performance monitoring
        setupPerformanceMonitoring()

      } catch (error) {
        console.warn('Failed to initialize optimizations:', error)
      }
    }

    initializeOptimizations()

    // Cleanup on unmount
    return () => {
      MemoryManager.cleanup()
    }
  }, [isMobile, isTouchDevice])

  return (
    <>
      {/* Performance monitoring */}
      <PerformanceMonitor 
        enableReporting={process.env.NODE_ENV === 'development'}
        onMetricsUpdate={(metrics) => {
          // Log performance metrics untuk debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('Performance metrics updated:', metrics)
          }
        }}
      />

      {/* Performance badge untuk development */}
      <PerformanceBadge />

      {/* Main app content */}
      <div 
        className={`
          min-h-screen bg-background
          ${isMobile ? 'mobile-viewport' : ''}
          ${isTouchDevice ? 'touch-action-manipulation' : ''}
          ${!isOnline ? 'offline-mode' : ''}
        `}
      >
        {children}
      </div>

      {/* Offline indicator styles */}
      <style jsx>{`
        .offline-mode {
          filter: grayscale(0.3);
        }
        
        .offline-mode::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          z-index: 9999;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}

/**
 * Setup viewport optimizations untuk mobile
 */
function setupMobileViewport() {
  if (typeof document === 'undefined') return

  // Prevent zoom on input focus (iOS)
  const viewport = document.querySelector('meta[name="viewport"]')
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    )
  }

  // Add mobile-specific CSS classes
  document.documentElement.classList.add('mobile-optimized')

  // Setup safe area handling untuk notch devices
  const style = document.createElement('style')
  style.textContent = `
    .mobile-optimized {
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    .mobile-optimized input,
    .mobile-optimized textarea,
    .mobile-optimized [contenteditable] {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
    
    /* Prevent overscroll bounce */
    .mobile-optimized body {
      overscroll-behavior: none;
    }
    
    /* Optimize scrolling */
    .mobile-optimized * {
      -webkit-overflow-scrolling: touch;
    }
  `
  document.head.appendChild(style)
}

/**
 * Setup touch optimizations
 */
function setupTouchOptimizations() {
  if (typeof document === 'undefined') return

  // Add touch-specific optimizations
  const style = document.createElement('style')
  style.textContent = `
    /* Touch-friendly button sizes */
    .touch-optimized button,
    .touch-optimized a,
    .touch-optimized [role="button"] {
      min-height: 44px;
      min-width: 44px;
      padding: 12px 16px;
    }
    
    /* Improve touch feedback */
    .touch-optimized button:active,
    .touch-optimized [role="button"]:active {
      transform: scale(0.98);
      transition: transform 0.1s ease;
    }
    
    /* Optimize form inputs untuk touch */
    .touch-optimized input,
    .touch-optimized select,
    .touch-optimized textarea {
      min-height: 44px;
      font-size: 16px; /* Prevent zoom on iOS */
    }
    
    /* Better focus indicators untuk keyboard navigation */
    .touch-optimized *:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  `
  document.head.appendChild(style)
  
  document.documentElement.classList.add('touch-optimized')
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Monitor memory usage
  const monitorMemory = () => {
    const usage = MemoryManager.getMemoryUsage()
    if (usage && usage.used > usage.limit * 0.8) {
      console.warn('High memory usage detected:', usage)
      
      // Trigger garbage collection jika tersedia
      if ('gc' in window) {
        (window as any).gc()
      }
    }
  }

  // Monitor setiap 30 detik
  const memoryInterval = setInterval(monitorMemory, 30000)
  MemoryManager.addTimer(memoryInterval)

  // Monitor network status
  const handleNetworkChange = () => {
    const connection = (navigator as any).connection
    if (connection) {
      console.log('Network changed:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      })
    }
  }

  if ('connection' in navigator) {
    MemoryManager.addListener('change', handleNetworkChange)
  }

  // Monitor visibility changes untuk pause/resume optimizations
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Pause non-critical operations
      console.log('App hidden, pausing non-critical operations')
    } else {
      // Resume operations
      console.log('App visible, resuming operations')
    }
  }

  MemoryManager.addListener('visibilitychange', handleVisibilityChange)
}

/**
 * Hook untuk menggunakan mobile optimizations
 */
export function useMobileOptimizations() {
  const { isMobile, isTouchDevice, screenWidth } = useMobile()
  const { isOnline } = useServiceWorkerSafe()

  const getOptimalImageSize = (baseWidth: number) => {
    if (screenWidth <= 640) return Math.min(baseWidth, 640)
    if (screenWidth <= 1024) return Math.min(baseWidth, 1024)
    return baseWidth
  }

  const getOptimalGridColumns = () => {
    if (screenWidth <= 640) return 1
    if (screenWidth <= 1024) return 2
    return 3
  }

  const shouldUseReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const getOptimalLoadingStrategy = () => {
    if (!isOnline) return 'cache-first'
    if (isMobile) return 'network-first'
    return 'stale-while-revalidate'
  }

  return {
    isMobile,
    isTouchDevice,
    isOnline,
    screenWidth,
    getOptimalImageSize,
    getOptimalGridColumns,
    shouldUseReducedMotion,
    getOptimalLoadingStrategy
  }
}
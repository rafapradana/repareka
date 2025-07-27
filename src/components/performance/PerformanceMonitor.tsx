'use client'

import React, { useEffect, useState } from 'react'
import { useMobile } from '@/hooks/useMobile'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
  loadTime: number | null
  domContentLoaded: number | null
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  enableReporting?: boolean
}

/**
 * Komponen untuk monitoring performance metrics
 * Mengukur Core Web Vitals dan metrics lainnya
 */
export function PerformanceMonitor({ 
  onMetricsUpdate, 
  enableReporting = false 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null,
    domContentLoaded: null
  })
  const { isMobile } = useMobile()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
      setMetrics(prev => {
        const updated = { ...prev, ...newMetrics }
        onMetricsUpdate?.(updated)
        return updated
      })
    }

    // Measure Navigation Timing
    const measureNavigationTiming = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        updateMetrics({
          ttfb: navigation.responseStart - navigation.requestStart,
          loadTime: navigation.loadEventEnd - navigation.navigationStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart
        })
      }
    }

    // Measure Core Web Vitals
    const measureWebVitals = () => {
      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          updateMetrics({ fcp: fcpEntry.startTime })
        }
      })

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          updateMetrics({ lcp: lastEntry.startTime })
        }
      })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: PerformanceEntry & { processingStart?: number }) => {
          if (entry.processingStart && entry.startTime) {
            updateMetrics({ fid: entry.processingStart - entry.startTime })
          }
        })
      })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0
            updateMetrics({ cls: clsValue })
          }
        })
      })

      try {
        fcpObserver.observe({ entryTypes: ['paint'] })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        fidObserver.observe({ entryTypes: ['first-input'] })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }

      return () => {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
    }

    // Initial measurements
    measureNavigationTiming()
    const cleanup = measureWebVitals()

    // Measure on load complete
    window.addEventListener('load', measureNavigationTiming)

    return () => {
      window.removeEventListener('load', measureNavigationTiming)
      cleanup?.()
    }
  }, [onMetricsUpdate])

  // Report metrics untuk debugging (development only)
  useEffect(() => {
    if (enableReporting && process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics')
      console.log('Device Type:', isMobile ? 'Mobile' : 'Desktop')
      console.log('First Contentful Paint (FCP):', metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A')
      console.log('Largest Contentful Paint (LCP):', metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A')
      console.log('First Input Delay (FID):', metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A')
      console.log('Cumulative Layout Shift (CLS):', metrics.cls ? metrics.cls.toFixed(4) : 'N/A')
      console.log('Time to First Byte (TTFB):', metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A')
      console.log('Load Time:', metrics.loadTime ? `${metrics.loadTime.toFixed(2)}ms` : 'N/A')
      console.log('DOM Content Loaded:', metrics.domContentLoaded ? `${metrics.domContentLoaded.toFixed(2)}ms` : 'N/A')
      console.groupEnd()
    }
  }, [metrics, enableReporting, isMobile])

  // Tidak render UI, hanya monitoring
  return null
}

/**
 * Hook untuk menggunakan performance metrics
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null,
    domContentLoaded: null
  })

  const updateMetrics = (newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics)
  }

  const getPerformanceScore = () => {
    const { fcp, lcp, fid, cls } = metrics
    
    if (!fcp || !lcp || !fid || cls === null) {
      return null
    }

    // Scoring berdasarkan Core Web Vitals thresholds
    let score = 0
    
    // FCP scoring (good: <1.8s, needs improvement: 1.8s-3s, poor: >3s)
    if (fcp < 1800) score += 25
    else if (fcp < 3000) score += 15
    else score += 5

    // LCP scoring (good: <2.5s, needs improvement: 2.5s-4s, poor: >4s)
    if (lcp < 2500) score += 25
    else if (lcp < 4000) score += 15
    else score += 5

    // FID scoring (good: <100ms, needs improvement: 100ms-300ms, poor: >300ms)
    if (fid < 100) score += 25
    else if (fid < 300) score += 15
    else score += 5

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (cls < 0.1) score += 25
    else if (cls < 0.25) score += 15
    else score += 5

    return score
  }

  const getPerformanceGrade = () => {
    const score = getPerformanceScore()
    if (!score) return 'N/A'
    
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  return {
    metrics,
    updateMetrics,
    getPerformanceScore,
    getPerformanceGrade
  }
}

/**
 * Komponen untuk menampilkan performance badge (development only)
 */
export function PerformanceBadge() {
  const { metrics, getPerformanceGrade } = usePerformanceMetrics()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hanya tampilkan di development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  const grade = getPerformanceGrade()
  const gradeColor = {
    'A': 'bg-green-500',
    'B': 'bg-blue-500',
    'C': 'bg-yellow-500',
    'D': 'bg-orange-500',
    'F': 'bg-red-500',
    'N/A': 'bg-gray-500'
  }[grade] || 'bg-gray-500'

  return (
    <div className="fixed bottom-4 right-4 z-50 md:block hidden">
      <div className={`${gradeColor} text-white px-3 py-2 rounded-lg text-sm font-mono shadow-lg`}>
        <div className="flex items-center space-x-2">
          <span>Perf: {grade}</span>
          {metrics.lcp && (
            <span className="text-xs opacity-75">
              LCP: {metrics.lcp.toFixed(0)}ms
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Utility untuk mengukur custom performance metrics
 */
export class PerformanceTracker {
  private static marks: Map<string, number> = new Map()

  static mark(name: string) {
    const timestamp = performance.now()
    this.marks.set(name, timestamp)
    
    if (typeof performance.mark === 'function') {
      performance.mark(name)
    }
  }

  static measure(name: string, startMark: string, endMark?: string) {
    const startTime = this.marks.get(startMark)
    const endTime = endMark ? this.marks.get(endMark) : performance.now()

    if (startTime && endTime) {
      const duration = endTime - startTime
      
      if (typeof performance.measure === 'function') {
        try {
          performance.measure(name, startMark, endMark)
        } catch (error) {
          console.warn('Performance measure failed:', error)
        }
      }

      return duration
    }

    return null
  }

  static getMarks() {
    return Array.from(this.marks.entries())
  }

  static clearMarks() {
    this.marks.clear()
    
    if (typeof performance.clearMarks === 'function') {
      performance.clearMarks()
    }
  }
}
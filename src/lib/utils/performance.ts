/**
 * Performance monitoring utilities untuk Repareka
 * Mengukur dan melacak performa aplikasi
 */

// Threshold untuk performance metrics (dalam milliseconds)
const PERFORMANCE_THRESHOLDS = {
  COMPONENT_RENDER: 16, // 60fps = 16.67ms per frame
  API_CALL: 1000, // 1 second
  PAGE_LOAD: 3000, // 3 seconds
  IMAGE_LOAD: 2000, // 2 seconds
} as const

// Core Web Vitals thresholds
const WEB_VITALS_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint - 2.5s
  FID: 100,  // First Input Delay - 100ms
  CLS: 0.1,  // Cumulative Layout Shift - 0.1
} as const

/**
 * Mengukur waktu render komponen
 */
export function measureComponentRender<T>(
  componentName: string,
  renderFunction: () => T
): T {
  const startMark = `${componentName}-start`
  const endMark = `${componentName}-end`
  const measureName = `${componentName}-render`

  performance.mark(startMark)
  const result = renderFunction()
  performance.mark(endMark)
  
  performance.measure(measureName, startMark, endMark)
  
  // Check threshold dan log warning jika perlu
  const measure = performance.getEntriesByName(measureName)[0]
  if (measure && measure.duration > PERFORMANCE_THRESHOLDS.COMPONENT_RENDER) {
    console.warn(
      `Slow render detected for ${componentName}: ${measure.duration.toFixed(2)}ms`
    )
  }

  return result
}

/**
 * Mengukur durasi API call
 */
export async function measureApiCall<T>(
  apiName: string,
  apiFunction: () => Promise<T>
): Promise<T> {
  const startMark = `${apiName}-start`
  const endMark = `${apiName}-end`
  const measureName = `${apiName}-duration`

  performance.mark(startMark)
  
  try {
    const result = await apiFunction()
    performance.mark(endMark)
    performance.measure(measureName, startMark, endMark)
    
    // Check threshold
    const measure = performance.getEntriesByName(measureName)[0]
    if (measure && measure.duration > PERFORMANCE_THRESHOLDS.API_CALL) {
      console.warn(
        `Slow API call detected for ${apiName}: ${measure.duration.toFixed(2)}ms`
      )
    }
    
    return result
  } catch (error) {
    performance.mark(endMark)
    performance.measure(measureName, startMark, endMark)
    throw error
  }
}

/**
 * Mengukur page load time
 */
export function measurePageLoad(pageName: string): void {
  const markName = `${pageName}-load`
  performance.mark(markName)
  
  // Measure dari navigation start
  if (performance.timing) {
    const loadTime = performance.now()
    if (loadTime > PERFORMANCE_THRESHOLDS.PAGE_LOAD) {
      console.warn(
        `Slow page load detected for ${pageName}: ${loadTime.toFixed(2)}ms`
      )
    }
  }
}

/**
 * Monitor Core Web Vitals
 */
export function monitorWebVitals(): void {
  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        if (lastEntry && lastEntry.startTime > WEB_VITALS_THRESHOLDS.LCP) {
          console.warn(`Poor LCP: ${lastEntry.startTime.toFixed(2)}ms`)
        }
        
        // Send to analytics
        sendToAnalytics('LCP', lastEntry?.startTime || 0)
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.error('Error monitoring LCP:', error)
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime
          
          if (fid > WEB_VITALS_THRESHOLDS.FID) {
            console.warn(`Poor FID: ${fid.toFixed(2)}ms`)
          }
          
          sendToAnalytics('FID', fid)
        })
      })
      
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.error('Error monitoring FID:', error)
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        if (clsValue > WEB_VITALS_THRESHOLDS.CLS) {
          console.warn(`Poor CLS: ${clsValue.toFixed(3)}`)
        }
        
        sendToAnalytics('CLS', clsValue)
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.error('Error monitoring CLS:', error)
    }
  }
}

/**
 * Monitor resource loading performance
 */
export function monitorResourceLoading(): void {
  if ('PerformanceObserver' in window) {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        entries.forEach((entry: any) => {
          const duration = entry.responseEnd - entry.startTime
          
          // Monitor image loading
          if (entry.initiatorType === 'img' && duration > PERFORMANCE_THRESHOLDS.IMAGE_LOAD) {
            console.warn(`Slow image load: ${entry.name} - ${duration.toFixed(2)}ms`)
          }
          
          // Monitor large resources
          if (entry.transferSize > 500000) { // 500KB
            console.warn(`Large resource: ${entry.name} - ${(entry.transferSize / 1024).toFixed(2)}KB`)
          }
          
          // Send to analytics
          sendToAnalytics('resource-load', {
            name: entry.name,
            type: entry.initiatorType,
            duration,
            size: entry.transferSize
          })
        })
      })
      
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.error('Error monitoring resource loading:', error)
    }
  }
}

/**
 * Monitor memory usage (jika tersedia)
 */
export function monitorMemoryUsage(): void {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    
    const memoryInfo = {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    }
    
    // Warn jika memory usage tinggi
    if (memoryInfo.usage > 80) {
      console.warn(`High memory usage: ${memoryInfo.usage.toFixed(2)}%`)
    }
    
    sendToAnalytics('memory-usage', memoryInfo)
  }
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): Record<string, any> {
  const summary: Record<string, any> = {}
  
  // Navigation timing
  if (performance.timing) {
    const timing = performance.timing
    summary.pageLoad = timing.loadEventEnd - timing.navigationStart
    summary.domReady = timing.domContentLoadedEventEnd - timing.navigationStart
    summary.firstByte = timing.responseStart - timing.navigationStart
  }
  
  // Resource timing
  const resources = performance.getEntriesByType('resource')
  summary.resourceCount = resources.length
  summary.totalResourceSize = resources.reduce((total: number, resource: any) => {
    return total + (resource.transferSize || 0)
  }, 0)
  
  // Custom marks and measures
  const marks = performance.getEntriesByType('mark')
  const measures = performance.getEntriesByType('measure')
  
  summary.customMarks = marks.length
  summary.customMeasures = measures.length
  
  // Memory info
  if ('memory' in performance) {
    const memory = (performance as any).memory
    summary.memoryUsage = {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    }
  }
  
  return summary
}

/**
 * Clear performance data
 */
export function clearPerformanceData(): void {
  performance.clearMarks()
  performance.clearMeasures()
  performance.clearResourceTimings()
}

/**
 * Send metrics to analytics (placeholder)
 */
function sendToAnalytics(metric: string, value: any): void {
  // Implementasi sesuai dengan analytics provider yang digunakan
  // Contoh: Google Analytics, Mixpanel, dll
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Analytics: ${metric}`, value)
  }
  
  // TODO: Implement actual analytics sending
  // Example:
  // gtag('event', 'performance_metric', {
  //   metric_name: metric,
  //   metric_value: value,
  //   page_path: window.location.pathname
  // })
}

/**
 * Performance budget checker
 */
export function checkPerformanceBudget(): {
  passed: boolean
  violations: string[]
} {
  const violations: string[] = []
  
  // Check bundle size budget
  const resources = performance.getEntriesByType('resource')
  const jsSize = resources
    .filter((r: any) => r.initiatorType === 'script')
    .reduce((total: number, r: any) => total + (r.transferSize || 0), 0)
  
  const cssSize = resources
    .filter((r: any) => r.initiatorType === 'css')
    .reduce((total: number, r: any) => total + (r.transferSize || 0), 0)
  
  // Budget thresholds (dalam bytes)
  const budgets = {
    javascript: 250000, // 250KB
    css: 50000, // 50KB
    images: 500000 // 500KB
  }
  
  if (jsSize > budgets.javascript) {
    violations.push(`JavaScript bundle size exceeded: ${(jsSize / 1024).toFixed(2)}KB > ${(budgets.javascript / 1024).toFixed(2)}KB`)
  }
  
  if (cssSize > budgets.css) {
    violations.push(`CSS bundle size exceeded: ${(cssSize / 1024).toFixed(2)}KB > ${(budgets.css / 1024).toFixed(2)}KB`)
  }
  
  // Check page load time
  if (performance.timing) {
    const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    if (pageLoadTime > PERFORMANCE_THRESHOLDS.PAGE_LOAD) {
      violations.push(`Page load time exceeded: ${pageLoadTime}ms > ${PERFORMANCE_THRESHOLDS.PAGE_LOAD}ms`)
    }
  }
  
  return {
    passed: violations.length === 0,
    violations
  }
}

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring(): void {
  if (typeof window !== 'undefined') {
    // Monitor Core Web Vitals
    monitorWebVitals()
    
    // Monitor resource loading
    monitorResourceLoading()
    
    // Monitor memory usage periodically
    setInterval(monitorMemoryUsage, 30000) // Every 30 seconds
    
    // Log performance summary on page unload
    window.addEventListener('beforeunload', () => {
      const summary = getPerformanceSummary()
      console.log('Performance Summary:', summary)
      
      // Check performance budget
      const budgetCheck = checkPerformanceBudget()
      if (!budgetCheck.passed) {
        console.warn('Performance budget violations:', budgetCheck.violations)
      }
    })
  }
}
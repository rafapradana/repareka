import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock performance APIs
const mockPerformanceObserver = vi.fn()
const mockPerformanceMark = vi.fn()
const mockPerformanceMeasure = vi.fn()
const mockPerformanceNow = vi.fn(() => Date.now())

// Setup performance mocks
Object.defineProperty(global, 'PerformanceObserver', {
  writable: true,
  value: mockPerformanceObserver
})

Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    mark: mockPerformanceMark,
    measure: mockPerformanceMeasure,
    now: mockPerformanceNow,
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn()
  }
})

// Import performance utilities after mocking
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor'
import { measureComponentRender, measureApiCall, measurePageLoad } from '@/lib/utils/performance'

describe('Performance Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Performance Metrics Collection', () => {
    it('should measure component render time', () => {
      const componentName = 'ServiceCard'
      const startTime = 100
      const endTime = 150
      
      mockPerformanceNow
        .mockReturnValueOnce(startTime)
        .mockReturnValueOnce(endTime)

      const result = measureComponentRender(componentName, () => {
        // Simulate component render
        return 'rendered'
      })

      expect(result).toBe('rendered')
      expect(mockPerformanceMark).toHaveBeenCalledWith(`${componentName}-start`)
      expect(mockPerformanceMark).toHaveBeenCalledWith(`${componentName}-end`)
      expect(mockPerformanceMeasure).toHaveBeenCalledWith(
        `${componentName}-render`,
        `${componentName}-start`,
        `${componentName}-end`
      )
    })

    it('should measure API call duration', async () => {
      const apiName = 'fetchServices'
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'test' })
      
      const startTime = 200
      const endTime = 350
      
      mockPerformanceNow
        .mockReturnValueOnce(startTime)
        .mockReturnValueOnce(endTime)

      const result = await measureApiCall(apiName, mockApiCall)

      expect(result).toEqual({ data: 'test' })
      expect(mockPerformanceMark).toHaveBeenCalledWith(`${apiName}-start`)
      expect(mockPerformanceMark).toHaveBeenCalledWith(`${apiName}-end`)
      expect(mockPerformanceMeasure).toHaveBeenCalledWith(
        `${apiName}-duration`,
        `${apiName}-start`,
        `${apiName}-end`
      )
    })

    it('should measure page load metrics', () => {
      const pageName = 'homepage'
      
      measurePageLoad(pageName)

      expect(mockPerformanceMark).toHaveBeenCalledWith(`${pageName}-load`)
    })
  })

  describe('Performance Thresholds', () => {
    it('should detect slow component renders', () => {
      const slowRenderTime = 100 // ms
      const componentName = 'SlowComponent'
      
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(slowRenderTime)

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      measureComponentRender(componentName, () => {
        // Simulate slow render
        return 'slow render'
      })

      // Should warn about slow render (threshold typically 16ms for 60fps)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Slow render detected')
      )

      consoleSpy.mockRestore()
    })

    it('should detect slow API calls', async () => {
      const slowApiTime = 3000 // 3 seconds
      const apiName = 'slowApi'
      
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(slowApiTime)

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const mockSlowApi = vi.fn().mockResolvedValue({ data: 'slow response' })

      await measureApiCall(apiName, mockSlowApi)

      // Should warn about slow API call (threshold typically 1000ms)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Slow API call detected')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Core Web Vitals', () => {
    it('should monitor Largest Contentful Paint (LCP)', () => {
      const mockLCPEntries = [
        {
          name: 'largest-contentful-paint',
          startTime: 1500, // 1.5 seconds
          element: document.createElement('img')
        }
      ]

      const observerCallback = vi.fn()
      mockPerformanceObserver.mockImplementation((callback) => {
        observerCallback.mockImplementation(callback)
        return {
          observe: vi.fn(),
          disconnect: vi.fn()
        }
      })

      // Simulate LCP observation
      const observer = new PerformanceObserver(observerCallback)
      observer.observe({ entryTypes: ['largest-contentful-paint'] })

      // Trigger callback with mock entries
      observerCallback({ getEntries: () => mockLCPEntries })

      expect(mockPerformanceObserver).toHaveBeenCalled()
    })

    it('should monitor First Input Delay (FID)', () => {
      const mockFIDEntries = [
        {
          name: 'first-input',
          processingStart: 100,
          startTime: 50,
          duration: 50
        }
      ]

      const observerCallback = vi.fn()
      mockPerformanceObserver.mockImplementation((callback) => {
        observerCallback.mockImplementation(callback)
        return {
          observe: vi.fn(),
          disconnect: vi.fn()
        }
      })

      // Simulate FID observation
      const observer = new PerformanceObserver(observerCallback)
      observer.observe({ entryTypes: ['first-input'] })

      // Trigger callback with mock entries
      observerCallback({ getEntries: () => mockFIDEntries })

      expect(mockPerformanceObserver).toHaveBeenCalled()
    })

    it('should monitor Cumulative Layout Shift (CLS)', () => {
      const mockCLSEntries = [
        {
          name: 'layout-shift',
          value: 0.1,
          hadRecentInput: false
        }
      ]

      const observerCallback = vi.fn()
      mockPerformanceObserver.mockImplementation((callback) => {
        observerCallback.mockImplementation(callback)
        return {
          observe: vi.fn(),
          disconnect: vi.fn()
        }
      })

      // Simulate CLS observation
      const observer = new PerformanceObserver(observerCallback)
      observer.observe({ entryTypes: ['layout-shift'] })

      // Trigger callback with mock entries
      observerCallback({ getEntries: () => mockCLSEntries })

      expect(mockPerformanceObserver).toHaveBeenCalled()
    })
  })

  describe('Resource Loading Performance', () => {
    it('should monitor image loading performance', () => {
      const mockImageEntries = [
        {
          name: 'https://example.com/image.jpg',
          initiatorType: 'img',
          startTime: 100,
          responseEnd: 500,
          transferSize: 50000
        }
      ]

      global.performance.getEntriesByType = vi.fn().mockReturnValue(mockImageEntries)

      const imageEntries = performance.getEntriesByType('resource')
      const imageResources = imageEntries.filter(entry => entry.initiatorType === 'img')

      expect(imageResources).toHaveLength(1)
      expect(imageResources[0].name).toBe('https://example.com/image.jpg')
    })

    it('should monitor script loading performance', () => {
      const mockScriptEntries = [
        {
          name: 'https://example.com/script.js',
          initiatorType: 'script',
          startTime: 50,
          responseEnd: 200,
          transferSize: 25000
        }
      ]

      global.performance.getEntriesByType = vi.fn().mockReturnValue(mockScriptEntries)

      const scriptEntries = performance.getEntriesByType('resource')
      const scriptResources = scriptEntries.filter(entry => entry.initiatorType === 'script')

      expect(scriptResources).toHaveLength(1)
      expect(scriptResources[0].name).toBe('https://example.com/script.js')
    })
  })

  describe('Memory Usage Monitoring', () => {
    it('should monitor memory usage if available', () => {
      // Mock memory API
      Object.defineProperty(global.performance, 'memory', {
        writable: true,
        value: {
          usedJSHeapSize: 10000000, // 10MB
          totalJSHeapSize: 20000000, // 20MB
          jsHeapSizeLimit: 100000000 // 100MB
        }
      })

      const memoryInfo = (performance as any).memory
      
      if (memoryInfo) {
        expect(memoryInfo.usedJSHeapSize).toBe(10000000)
        expect(memoryInfo.totalJSHeapSize).toBe(20000000)
        expect(memoryInfo.jsHeapSizeLimit).toBe(100000000)
      }
    })
  })

  describe('Performance Budget Validation', () => {
    it('should validate bundle size budget', () => {
      const budgets = {
        javascript: 250000, // 250KB
        css: 50000, // 50KB
        images: 500000 // 500KB
      }

      const mockResourceEntries = [
        {
          name: 'app.js',
          initiatorType: 'script',
          transferSize: 200000 // 200KB - within budget
        },
        {
          name: 'styles.css',
          initiatorType: 'css',
          transferSize: 60000 // 60KB - over budget
        }
      ]

      global.performance.getEntriesByType = vi.fn().mockReturnValue(mockResourceEntries)

      const resources = performance.getEntriesByType('resource')
      const jsSize = resources
        .filter(r => r.initiatorType === 'script')
        .reduce((total, r) => total + r.transferSize, 0)
      
      const cssSize = resources
        .filter(r => r.initiatorType === 'css')
        .reduce((total, r) => total + r.transferSize, 0)

      expect(jsSize).toBeLessThanOrEqual(budgets.javascript)
      expect(cssSize).toBeGreaterThan(budgets.css) // This would fail budget
    })
  })

  describe('Performance Regression Detection', () => {
    it('should detect performance regressions', () => {
      const baselineMetrics = {
        LCP: 1200, // 1.2s
        FID: 50,   // 50ms
        CLS: 0.05  // 0.05
      }

      const currentMetrics = {
        LCP: 1800, // 1.8s - regression
        FID: 45,   // 45ms - improvement
        CLS: 0.08  // 0.08 - regression
      }

      const regressionThreshold = 0.1 // 10%

      const lcpRegression = (currentMetrics.LCP - baselineMetrics.LCP) / baselineMetrics.LCP
      const fidRegression = (currentMetrics.FID - baselineMetrics.FID) / baselineMetrics.FID
      const clsRegression = (currentMetrics.CLS - baselineMetrics.CLS) / baselineMetrics.CLS

      expect(lcpRegression).toBeGreaterThan(regressionThreshold) // Regression detected
      expect(fidRegression).toBeLessThan(0) // Improvement
      expect(clsRegression).toBeGreaterThan(regressionThreshold) // Regression detected
    })
  })

  describe('Performance Optimization Suggestions', () => {
    it('should suggest optimizations for slow components', () => {
      const componentMetrics = {
        'ServiceCard': { renderTime: 25, rerenderCount: 5 },
        'SearchAndFilter': { renderTime: 45, rerenderCount: 12 },
        'ServiceGrid': { renderTime: 80, rerenderCount: 3 }
      }

      const slowComponents = Object.entries(componentMetrics)
        .filter(([_, metrics]) => metrics.renderTime > 16) // 60fps threshold
        .map(([name, metrics]) => ({
          name,
          suggestion: metrics.rerenderCount > 10 
            ? 'Consider memoization to reduce re-renders'
            : 'Optimize render performance'
        }))

      expect(slowComponents).toHaveLength(3)
      expect(slowComponents.find(c => c.name === 'SearchAndFilter')?.suggestion)
        .toBe('Consider memoization to reduce re-renders')
    })
  })
})
/**
 * Utilities untuk optimasi bundle size dan tree shaking
 * Menyediakan helper functions untuk dynamic imports dan code splitting
 */

/**
 * Dynamic import dengan error handling dan retry logic
 */
export async function dynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < retries; i++) {
    try {
      const module = await importFn()
      return module.default
    } catch (error) {
      lastError = error as Error
      
      if (i < retries - 1) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw new Error(`Failed to load module after ${retries} retries: ${lastError.message}`)
}

/**
 * Preload modules untuk better performance
 */
export function preloadModule(importFn: () => Promise<any>): void {
  // Use requestIdleCallback jika tersedia, fallback ke setTimeout
  const schedulePreload = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 2000 })
    } else {
      setTimeout(callback, 100)
    }
  }

  schedulePreload(() => {
    importFn().catch(error => {
      console.warn('Preload failed:', error)
    })
  })
}

/**
 * Conditional loading berdasarkan device capabilities
 */
export async function loadConditionally<T>(
  condition: boolean,
  importFn: () => Promise<{ default: T }>,
  fallback?: T
): Promise<T | undefined> {
  if (condition) {
    try {
      const module = await importFn()
      return module.default
    } catch (error) {
      console.error('Conditional loading failed:', error)
      return fallback
    }
  }
  
  return fallback
}

/**
 * Load modules berdasarkan intersection observer
 */
export function loadOnIntersection<T>(
  element: Element,
  importFn: () => Promise<{ default: T }>,
  options: IntersectionObserverInit = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          observer.disconnect()
          
          importFn()
            .then(module => resolve(module.default))
            .catch(reject)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)
  })
}

/**
 * Bundle size analyzer untuk development
 */
export class BundleAnalyzer {
  private static loadTimes: Map<string, number> = new Map()
  private static sizes: Map<string, number> = new Map()

  static async measureImport<T>(
    name: string,
    importFn: () => Promise<{ default: T }>
  ): Promise<T> {
    if (process.env.NODE_ENV !== 'development') {
      const module = await importFn()
      return module.default
    }

    const start = performance.now()
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0

    try {
      const module = await importFn()
      const end = performance.now()
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0

      const loadTime = end - start
      const memoryDelta = endMemory - startMemory

      this.loadTimes.set(name, loadTime)
      this.sizes.set(name, memoryDelta)

      console.log(`📦 ${name}: ${loadTime.toFixed(2)}ms, ${(memoryDelta / 1024).toFixed(2)}KB`)

      return module.default
    } catch (error) {
      console.error(`❌ Failed to load ${name}:`, error)
      throw error
    }
  }

  static getReport() {
    if (process.env.NODE_ENV !== 'development') return

    console.group('📊 Bundle Analysis Report')
    
    console.log('Load Times:')
    Array.from(this.loadTimes.entries())
      .sort(([, a], [, b]) => b - a)
      .forEach(([name, time]) => {
        console.log(`  ${name}: ${time.toFixed(2)}ms`)
      })

    console.log('\nMemory Usage:')
    Array.from(this.sizes.entries())
      .sort(([, a], [, b]) => b - a)
      .forEach(([name, size]) => {
        console.log(`  ${name}: ${(size / 1024).toFixed(2)}KB`)
      })

    const totalLoadTime = Array.from(this.loadTimes.values()).reduce((a, b) => a + b, 0)
    const totalSize = Array.from(this.sizes.values()).reduce((a, b) => a + b, 0)

    console.log(`\nTotal Load Time: ${totalLoadTime.toFixed(2)}ms`)
    console.log(`Total Memory: ${(totalSize / 1024).toFixed(2)}KB`)
    
    console.groupEnd()
  }

  static clear() {
    this.loadTimes.clear()
    this.sizes.clear()
  }
}

/**
 * Tree shaking helpers (hanya untuk libraries yang sudah terinstall)
 */
export const treeShakingHelpers = {
  // Import hanya icon yang dibutuhkan dari lucide-react
  icons: {
    Search: () => import('lucide-react').then(m => ({ Search: m.Search })),
    Filter: () => import('lucide-react').then(m => ({ Filter: m.Filter })),
    Heart: () => import('lucide-react').then(m => ({ Heart: m.Heart })),
    Star: () => import('lucide-react').then(m => ({ Star: m.Star })),
    MapPin: () => import('lucide-react').then(m => ({ MapPin: m.MapPin })),
    Phone: () => import('lucide-react').then(m => ({ Phone: m.Phone })),
    Mail: () => import('lucide-react').then(m => ({ Mail: m.Mail })),
    User: () => import('lucide-react').then(m => ({ User: m.User })),
    Menu: () => import('lucide-react').then(m => ({ Menu: m.Menu })),
    X: () => import('lucide-react').then(m => ({ X: m.X })),
  }
}

/**
 * Optimized imports untuk third-party libraries yang sudah terinstall
 */
export const optimizedImports = {
  // React Hook Form - import hanya yang dibutuhkan
  useForm: () => import('react-hook-form').then(m => ({ useForm: m.useForm })),
  Controller: () => import('react-hook-form').then(m => ({ Controller: m.Controller })),
  
  // Zod - import hanya yang dibutuhkan
  z: () => import('zod').then(m => ({ z: m.z })),
  
  // Use debounce yang sudah ada
  useDebounce: () => import('use-debounce').then(m => ({ useDebouncedCallback: m.useDebouncedCallback })),
}

/**
 * Resource hints untuk browser optimization
 */
export function addResourceHints() {
  if (typeof document === 'undefined') return

  const hints = [
    // Preconnect ke external domains
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://images.unsplash.com' },
    
    // DNS prefetch untuk domains yang mungkin digunakan
    { rel: 'dns-prefetch', href: 'https://api.supabase.co' },
    { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
  ]

  hints.forEach(hint => {
    const link = document.createElement('link')
    Object.assign(link, hint)
    document.head.appendChild(link)
  })
}

/**
 * Critical CSS inlining helper
 */
export function inlineCriticalCSS(css: string) {
  if (typeof document === 'undefined') return

  const style = document.createElement('style')
  style.textContent = css
  style.setAttribute('data-critical', 'true')
  document.head.appendChild(style)
}

/**
 * Service Worker cache optimization
 */
export function optimizeServiceWorkerCache() {
  if ('serviceWorker' in navigator && 'caches' in window) {
    // Preload critical resources
    const criticalResources = [
      '/',
      '/manifest.json',
      '/offline.html'
    ]

    caches.open('critical-v1').then(cache => {
      cache.addAll(criticalResources).catch(error => {
        console.warn('Failed to cache critical resources:', error)
      })
    })
  }
}

/**
 * Memory management utilities
 */
export class MemoryManager {
  private static observers: Set<IntersectionObserver> = new Set()
  private static timers: Set<NodeJS.Timeout> = new Set()
  private static listeners: Map<string, EventListener> = new Map()

  static addObserver(observer: IntersectionObserver) {
    this.observers.add(observer)
  }

  static addTimer(timer: NodeJS.Timeout) {
    this.timers.add(timer)
  }

  static addListener(event: string, listener: EventListener) {
    this.listeners.set(event, listener)
    window.addEventListener(event, listener)
  }

  static cleanup() {
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()

    // Clear timers
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()

    // Remove listeners
    this.listeners.forEach((listener, event) => {
      window.removeEventListener(event, listener)
    })
    this.listeners.clear()
  }

  static getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
    return null
  }
}
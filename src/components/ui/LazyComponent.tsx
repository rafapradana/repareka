'use client'

import React, { Suspense, lazy, ComponentType } from 'react'

interface LazyComponentProps {
  fallback?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * Wrapper untuk lazy loading komponen dengan fallback
 */
export function LazyComponent({ 
  fallback = <ComponentSkeleton />, 
  className = '',
  children 
}: LazyComponentProps) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}

/**
 * Default skeleton untuk loading state
 */
export function ComponentSkeleton({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-base-200 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton khusus untuk service card
 */
export function ServiceCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 animate-pulse ${className}`}>
      {/* Image skeleton */}
      <div className="aspect-video bg-base-200 rounded-lg mb-3" />
      
      {/* Title skeleton */}
      <div className="h-5 bg-base-200 rounded mb-2" />
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-base-200 rounded w-full" />
        <div className="h-3 bg-base-200 rounded w-3/4" />
      </div>
      
      {/* Price and rating skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-4 bg-base-200 rounded w-20" />
        <div className="h-4 bg-base-200 rounded w-16" />
      </div>
    </div>
  )
}

/**
 * Skeleton untuk grid layout
 */
export function GridSkeleton({ 
  count = 6, 
  columns = 3,
  className = '' 
}: { 
  count?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Higher-order component untuk lazy loading dengan error boundary
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  const LazyWrappedComponent = lazy(() => Promise.resolve({ default: Component }))
  
  return function LazyLoadedComponent(props: P) {
    return (
      <ErrorBoundary>
        <Suspense fallback={fallback || <ComponentSkeleton />}>
          <LazyWrappedComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

/**
 * Error boundary untuk lazy loaded components
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-muted-foreground mb-2">
            <svg 
              className="w-8 h-8 mx-auto mb-2" 
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
            <p className="text-sm">Terjadi kesalahan saat memuat komponen</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Coba Lagi
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook untuk dynamic import dengan loading state
 */
export function useDynamicImport<T>(
  importFunc: () => Promise<{ default: T }>,
  deps: React.DependencyList = []
) {
  const [component, setComponent] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    importFunc()
      .then((module) => {
        if (!cancelled) {
          setComponent(module.default)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, deps)

  return { component, loading, error }
}

/**
 * Komponen untuk lazy loading dengan intersection observer
 */
interface LazyLoadOnScrollProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyLoadOnScroll({
  children,
  fallback = <ComponentSkeleton />,
  threshold = 0.1,
  rootMargin = '100px',
  className = ''
}: LazyLoadOnScrollProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}
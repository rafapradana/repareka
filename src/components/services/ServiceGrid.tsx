'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { ServiceCard } from './ServiceCard'
import { ServiceGridSkeleton } from './ServiceSkeleton'
import { EmptyState } from './EmptyState'
import { LazyLoadOnScroll } from '@/components/ui/LazyComponent'
import { ErrorState, LoadingWithError } from '@/components/ui/ErrorState'
import { useMobile } from '@/hooks/useMobile'
import { useInfiniteScroll } from '@/hooks/useGestures'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import type { Service, ServiceGridProps } from '@/types/service'

export function ServiceGrid({ services, loading, error, onLoadMore, onRetry, hasMore }: ServiceGridProps) {
  const { isMobile, isTouchDevice } = useMobile()
  const { isOnline } = useNetworkStatus()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Optimized intersection observer untuk mobile
  const lastServiceElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore()
      }
    }, {
      threshold: isMobile ? 0.05 : 0.1, // Lower threshold untuk mobile
      rootMargin: isMobile ? '200px' : '100px' // Larger margin untuk mobile
    })
    
    if (node) observerRef.current.observe(node)
  }, [loading, hasMore, onLoadMore, isMobile])

  // Setup infinite scroll dengan hook yang dioptimalkan
  const infiniteScrollRef = useInfiniteScroll(onLoadMore, {
    threshold: isMobile ? 0.05 : 0.1,
    rootMargin: isMobile ? '200px' : '100px',
    enabled: hasMore && !loading
  })

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const handleServiceClick = (service: Service) => {
    // TODO: Navigate to service detail page
    console.log('Service clicked:', service.id)
  }

  // Show error state jika ada error dan tidak ada services
  if (error && services.length === 0) {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        size={isMobile ? 'sm' : 'md'}
        className="min-h-[400px]"
      />
    )
  }

  // Show skeleton loading for initial load
  if (loading && services.length === 0) {
    return <ServiceGridSkeleton count={isMobile ? 4 : 6} />
  }

  // Show empty state jika tidak ada services dan tidak loading
  if (!services.length && !loading && !error) {
    return (
      <EmptyState
        type="search"
        onReset={() => window.location.href = '/'}
      />
    )
  }

  // Responsive grid classes
  const gridClasses = isMobile 
    ? "mobile-grid" // Custom utility class
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

  return (
    <div className="space-y-6 smooth-scroll">
      {/* Services Grid dengan optimasi mobile */}
      <div className={gridClasses}>
        {services.map((service, index) => {
          const isLast = index === services.length - 1
          
          return (
            <LazyLoadOnScroll
              key={service.id}
              threshold={isMobile ? 0.05 : 0.1}
              rootMargin={isMobile ? '100px' : '50px'}
              className={isLast ? 'last-service-item' : ''}
            >
              <div
                ref={isLast ? lastServiceElementRef : null}
                className={`
                  touch-action-manipulation
                  ${isTouchDevice ? 'touch-target' : ''}
                  transition-transform duration-200 ease-out
                  hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                <ServiceCard 
                  service={service} 
                  onClick={handleServiceClick}
                />
              </div>
            </LazyLoadOnScroll>
          )
        })}
      </div>

      {/* Loading State for pagination dengan optimasi mobile */}
      {loading && services.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-muted-foreground text-sm">
              {isMobile ? 'Memuat...' : 'Memuat layanan...'}
            </span>
          </div>
        </div>
      )}

      {/* Error state untuk load more */}
      {error && services.length > 0 && (
        <div className="text-center py-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-destructive mb-3">
              Gagal memuat layanan tambahan
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm text-destructive hover:text-destructive/80 underline"
              >
                Coba Lagi
              </button>
            )}
          </div>
        </div>
      )}

      {/* Load More Button dengan touch-friendly design */}
      {!loading && !error && hasMore && services.length > 0 && (
        <div className="text-center py-4">
          <button
            onClick={onLoadMore}
            disabled={!isOnline}
            className={`
              bg-accent text-foreground rounded-lg font-medium 
              hover:bg-accent/80 active:bg-accent/90
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isMobile 
                ? 'px-8 py-4 text-base touch-target' 
                : 'px-6 py-3 text-sm'
              }
              no-select
            `}
          >
            {!isOnline 
              ? 'Tidak Ada Koneksi' 
              : isMobile ? 'Muat Lagi' : 'Muat Lebih Banyak'
            }
          </button>
          
          {/* Network status indicator */}
          {!isOnline && (
            <p className="text-xs text-muted-foreground mt-2">
              Periksa koneksi internet Anda
            </p>
          )}
        </div>
      )}

      {/* Infinite scroll trigger element */}
      {hasMore && !loading && (
        <div 
          ref={infiniteScrollRef}
          className="h-4 w-full"
          aria-hidden="true"
        />
      )}

      {/* End of results indicator */}
      {!loading && !hasMore && services.length > 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground text-sm">
            {isMobile 
              ? 'Semua layanan telah ditampilkan'
              : 'Anda telah melihat semua layanan yang tersedia'
            }
          </div>
        </div>
      )}
    </div>
  )
}
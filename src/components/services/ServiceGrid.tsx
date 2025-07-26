'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { ServiceCard } from './ServiceCard'
import { ServiceGridSkeleton } from './ServiceSkeleton'
import { EmptyState } from './EmptyState'
import type { Service, ServiceGridProps } from '@/types/service'

export function ServiceGrid({ services, loading, onLoadMore, hasMore }: ServiceGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Intersection Observer untuk infinite scroll
  const lastServiceElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore()
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    })
    
    if (node) observerRef.current.observe(node)
  }, [loading, hasMore, onLoadMore])

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

  // Show skeleton loading for initial load
  if (loading && services.length === 0) {
    return <ServiceGridSkeleton count={6} />
  }

  if (!services.length && !loading) {
    return (
      <EmptyState
        type="search"
        onReset={() => window.location.href = '/'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={service.id}
            ref={index === services.length - 1 ? lastServiceElementRef : null}
          >
            <ServiceCard 
              service={service} 
              onClick={handleServiceClick}
            />
          </div>
        ))}
      </div>

      {/* Loading State for pagination */}
      {loading && services.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-muted-foreground">Memuat layanan...</span>
          </div>
        </div>
      )}

      {/* Load More Button (fallback jika intersection observer tidak bekerja) */}
      {!loading && hasMore && services.length > 0 && (
        <div className="text-center py-4">
          <button
            onClick={onLoadMore}
            className="bg-accent text-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/80 transition-colors"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}

      {/* End of results indicator */}
      {!loading && !hasMore && services.length > 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground text-sm">
            Anda telah melihat semua layanan yang tersedia
          </div>
        </div>
      )}
    </div>
  )
}
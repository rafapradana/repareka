'use client'

import React, { useState, useCallback } from 'react'
import { ServiceGrid } from '@/components/services/ServiceGrid'
import { SearchAndFilter } from '@/components/services/SearchAndFilter'
import { CategoryNavigation } from '@/components/services/CategoryNavigation'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { LoadingWithError } from '@/components/ui/ErrorState'
import { ServiceGridSkeleton } from '@/components/ui/LoadingSkeleton'
import { useServices } from '@/hooks/useServices'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { useToast } from '@/components/ui/Toast'
import { useMobile } from '@/hooks/useMobile'
import type { FilterState } from '@/types/service'

interface EnhancedHomepageProps {
  className?: string
}

/**
 * Enhanced Homepage component dengan comprehensive error handling dan loading states
 */
export function EnhancedHomepage({ className }: EnhancedHomepageProps) {
  const { isMobile } = useMobile()
  const { isOnline, isSlowConnection } = useNetworkStatus()
  const { addToast } = useToast()
  
  // URL-based filters
  const { filters, updateFilters, clearFilters } = useUrlFilters()
  
  // Services data dengan error handling
  const {
    services,
    categories,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    retry,
    isRetrying
  } = useServices(filters)

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    updateFilters(newFilters)
    
    // Show toast untuk slow connections
    if (isSlowConnection) {
      addToast({
        type: 'info',
        title: 'Koneksi Lambat',
        message: 'Memuat hasil pencarian mungkin membutuhkan waktu lebih lama'
      })
    }
  }, [updateFilters, isSlowConnection, addToast])

  // Handle search
  const handleSearch = useCallback((query: string) => {
    updateFilters({ ...filters, search: query })
  }, [filters, updateFilters])

  // Handle load more dengan error handling
  const handleLoadMore = useCallback(() => {
    if (!isOnline) {
      addToast({
        type: 'warning',
        title: 'Tidak Ada Koneksi',
        message: 'Periksa koneksi internet untuk memuat lebih banyak layanan'
      })
      return
    }
    
    loadMore()
  }, [isOnline, loadMore, addToast])

  // Handle retry
  const handleRetry = useCallback(() => {
    if (!isOnline) {
      addToast({
        type: 'warning',
        title: 'Tidak Ada Koneksi',
        message: 'Periksa koneksi internet Anda'
      })
      return
    }
    
    retry()
  }, [isOnline, retry, addToast])

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (!isOnline) {
      addToast({
        type: 'warning',
        title: 'Tidak Ada Koneksi',
        message: 'Periksa koneksi internet untuk memuat ulang'
      })
      return
    }
    
    refresh()
    addToast({
      type: 'info',
      title: 'Memuat Ulang',
      message: 'Memperbarui daftar layanan...'
    })
  }, [isOnline, refresh, addToast])

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground mb-4">
              Halaman tidak dapat dimuat. Silakan muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      }
    >
      <div className={`min-h-screen bg-background ${className || ''}`}>
        {/* Network Status Indicator */}
        {!isOnline && (
          <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-orange-800">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Anda sedang offline. Beberapa fitur mungkin tidak tersedia.</span>
            </div>
          </div>
        )}

        {/* Slow Connection Warning */}
        {isOnline && isSlowConnection && (
          <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-yellow-800">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Koneksi lambat terdeteksi. Halaman mungkin memuat lebih lama.</span>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Temukan Layanan Reparasi Terpercaya
            </h1>
            <p className="text-muted-foreground">
              Perbaiki, jangan buang! Temukan UMKM reparasi terbaik di sekitar Anda.
            </p>
          </div>

          {/* Category Navigation dengan Error Boundary */}
          <ErrorBoundary
            fallback={
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Kategori tidak dapat dimuat
                </p>
              </div>
            }
          >
            <div className="mb-6">
              <CategoryNavigation
                categories={categories}
                selectedCategory={filters.category}
                onCategorySelect={(category) => 
                  handleFilterChange({ ...filters, category })
                }
                loading={loading && categories.length === 0}
              />
            </div>
          </ErrorBoundary>

          {/* Main Content Area */}
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
            {/* Search and Filter Sidebar */}
            {!isMobile && (
              <div className="lg:col-span-1">
                <ErrorBoundary
                  fallback={
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Filter tidak dapat dimuat
                      </p>
                    </div>
                  }
                >
                  <SearchAndFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    categories={categories}
                    disabled={!isOnline}
                  />
                </ErrorBoundary>
              </div>
            )}

            {/* Services Grid */}
            <div className={isMobile ? 'col-span-1' : 'lg:col-span-3'}>
              {/* Mobile Search Bar */}
              {isMobile && (
                <div className="mb-4">
                  <ErrorBoundary
                    fallback={
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Pencarian tidak dapat dimuat
                        </p>
                      </div>
                    }
                  >
                    <SearchAndFilter
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onSearch={handleSearch}
                      categories={categories}
                      disabled={!isOnline}
                      mobileMode={true}
                    />
                  </ErrorBoundary>
                </div>
              )}

              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {filters.search ? `Hasil untuk "${filters.search}"` : 'Semua Layanan'}
                  </h2>
                  {!loading && !error && (
                    <p className="text-sm text-muted-foreground">
                      {services.length} layanan ditemukan
                    </p>
                  )}
                </div>
                
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={loading || isRetrying || !isOnline}
                  className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading || isRetrying ? 'Memuat...' : 'Perbarui'}
                </button>
              </div>

              {/* Services Grid dengan Error Handling */}
              <ErrorBoundary
                fallback={
                  <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Tidak Dapat Memuat Layanan
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Terjadi kesalahan saat memuat daftar layanan
                      </p>
                      <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  </div>
                }
              >
                <ServiceGrid
                  services={services}
                  loading={loading}
                  error={error}
                  onLoadMore={handleLoadMore}
                  onRetry={handleRetry}
                  hasMore={hasMore}
                />
              </ErrorBoundary>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filters.search || filters.category || filters.province || filters.city || filters.rating) && (
            <div className="mt-8 text-center">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Hapus Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
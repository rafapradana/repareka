'use client'

import { Suspense } from 'react'
import { MainLayout } from '@/components/layout'
import { ServiceGrid, SearchAndFilter, CategoryNavigation, EmptyState } from '@/components/services'
import { useServices } from '@/hooks/useServices'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { getLocationsForFilter } from '@/lib/utils/locations'
import type { FilterState } from '@/types/service'

function HomeContent() {
  const {
    filters,
    updateFilters,
    updateSearch,
    updateFilter,
    clearFilters,
    activeFiltersCount
  } = useUrlFilters()

  const {
    services,
    categories,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  } = useServices(filters)

  const locations = getLocationsForFilter()

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    updateFilter('category', categoryId)
  }

  // Handle search
  const handleSearch = (query: string) => {
    updateSearch(query)
  }

  // Handle filter change
  const handleFilterChange = (newFilters: FilterState) => {
    updateFilters(newFilters)
  }

  // Handle reset filters
  const handleResetFilters = () => {
    clearFilters()
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={refresh}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-background">
        {/* Categories Section */}
        <CategoryNavigation
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={handleCategoryClick}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Promo Banner */}
          <section className="mb-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    🎉 Promo Hari Ini - Diskon hingga 30%!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Dapatkan layanan reparasi terbaik dengan harga spesial. Berlaku sampai 31 Januari 2025.
                  </p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Lihat Promo
                </button>
              </div>
            </div>
          </section>

          {/* Search and Filter */}
          <section className="mb-6">
            <SearchAndFilter
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              categories={categories}
              locations={locations}
              initialFilters={filters}
            />
          </section>

          {/* Services Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {filters.search ? `Hasil pencarian "${filters.search}"` : 'Layanan Terpopuler'}
              </h2>
              <div className="text-sm text-muted-foreground">
                {services.length} layanan ditemukan
              </div>
            </div>

            <ServiceGrid
              services={services}
              loading={loading}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
export default function Home() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-base-600">Memuat...</p>
        </div>
      </MainLayout>
    }>
      <HomeContent />
    </Suspense>
  )
}
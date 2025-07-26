'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { FilterState } from '@/types/service'

/**
 * Hook untuk mengelola filter state dengan URL synchronization
 * Memungkinkan sharing URL dengan filter yang sudah diterapkan
 */
export function useUrlFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>({})

  // Parse filters dari URL saat pertama kali load
  useEffect(() => {
    const urlFilters: FilterState = {}
    
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const province = searchParams.get('province')
    const city = searchParams.get('city')
    const rating = searchParams.get('rating')
    const priceMin = searchParams.get('price_min')
    const priceMax = searchParams.get('price_max')
    const sort = searchParams.get('sort')

    if (search) urlFilters.search = search
    if (category) urlFilters.category = category
    if (province) urlFilters.province = province
    if (city) urlFilters.city = city
    if (rating) urlFilters.rating = parseFloat(rating)
    if (priceMin) urlFilters.price_min = parseInt(priceMin)
    if (priceMax) urlFilters.price_max = parseInt(priceMax)
    if (sort) urlFilters.sort = sort

    setFilters(urlFilters)
  }, [searchParams])

  // Update URL ketika filter berubah
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    
    // Add non-empty filters to URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString())
      }
    })
    
    // Update URL tanpa reload halaman
    const newUrl = params.toString() 
      ? `${pathname}?${params.toString()}`
      : pathname
      
    router.replace(newUrl, { scroll: false })
  }, [router, pathname])

  // Update search query
  const updateSearch = useCallback((query: string) => {
    const newFilters = { ...filters }
    if (query) {
      newFilters.search = query
    } else {
      delete newFilters.search
    }
    updateFilters(newFilters)
  }, [filters, updateFilters])

  // Update single filter
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    const newFilters = { ...filters }
    
    if (value !== undefined && value !== null && value !== '') {
      newFilters[key] = value
    } else {
      delete newFilters[key]
    }
    
    // Reset city jika province berubah
    if (key === 'province' && newFilters.city) {
      delete newFilters.city
    }
    
    updateFilters(newFilters)
  }, [filters, updateFilters])

  // Clear all filters
  const clearFilters = useCallback(() => {
    updateFilters({})
  }, [updateFilters])

  // Clear specific filter
  const clearFilter = useCallback((key: keyof FilterState) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    updateFilters(newFilters)
  }, [filters, updateFilters])

  // Get active filters count
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length

  return {
    filters,
    updateFilters,
    updateSearch,
    updateFilter,
    clearFilters,
    clearFilter,
    activeFiltersCount
  }
}
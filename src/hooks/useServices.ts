'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Service, FilterState, Category } from '@/types/service'

interface UseServicesReturn {
  services: Service[]
  categories: Category[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

interface Location {
  province: string
  cities: string[]
}

const ITEMS_PER_PAGE = 12

export function useServices(currentFilters: FilterState = {}): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }, [])

  // Fetch services dengan filter dan pagination
  const fetchServices = useCallback(async (
    currentPage: number = 1, 
    currentQuery: string = '', 
    currentFilters: FilterState = {},
    append: boolean = false
  ) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      })

      if (currentQuery) params.append('search', currentQuery)
      if (currentFilters.category) params.append('category', currentFilters.category)
      if (currentFilters.province) params.append('province', currentFilters.province)
      if (currentFilters.city) params.append('city', currentFilters.city)
      if (currentFilters.rating) params.append('rating', currentFilters.rating.toString())
      if (currentFilters.price_min) params.append('price_min', currentFilters.price_min.toString())
      if (currentFilters.price_max) params.append('price_max', currentFilters.price_max.toString())

      const response = await fetch(`/api/services?${params}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (append) {
        setServices(prev => [...prev, ...data.services])
      } else {
        setServices(data.services || [])
      }
      
      setHasMore(data.hasMore || false)
      setPage(currentPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat layanan')
      console.error('Error fetching services:', err)
      
      // Jika append gagal, jangan reset services yang sudah ada
      if (!append) {
        setServices([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Load more services (infinite scroll)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchServices(page + 1, currentFilters.search || '', currentFilters, true)
    }
  }, [loading, hasMore, page, currentFilters, fetchServices])

  // Refresh data
  const refresh = useCallback(() => {
    setPage(1)
    fetchServices(1, currentFilters.search || '', currentFilters, false)
  }, [currentFilters, fetchServices])

  // Initial load dan reload ketika filters berubah
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    setPage(1)
    fetchServices(1, currentFilters.search || '', currentFilters, false)
  }, [currentFilters, fetchServices])

  return {
    services,
    categories,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  }
}
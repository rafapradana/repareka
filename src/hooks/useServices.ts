'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Service, FilterState, Category } from '@/types/service'
import { useApiRetry } from '@/hooks/useRetry'
import { useToast } from '@/components/ui/Toast'
import { classifyError, fetchWithErrorHandling } from '@/lib/utils/errorHandler'

interface UseServicesReturn {
  services: Service[]
  categories: Category[]
  loading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  retry: () => void
  isRetrying: boolean
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
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  
  const { addToast } = useToast()

  // Fetch categories dengan retry
  const fetchCategories = useApiRetry(
    async () => {
      const response = await fetchWithErrorHandling('/api/categories')
      const data = await response.json()
      setCategories(data)
      return data
    },
    {
      onRetry: (attempt, error) => {
        console.warn(`Retry fetch categories attempt ${attempt}:`, error.message)
      }
    }
  )

  // Fetch services dengan error handling dan retry
  const fetchServicesWithRetry = useApiRetry(
    async (currentPage: number, currentQuery: string, currentFilters: FilterState, append: boolean) => {
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

      const response = await fetchWithErrorHandling(`/api/services?${params}`)
      const data = await response.json()
      
      if (append) {
        setServices(prev => [...prev, ...data.services])
      } else {
        setServices(data.services || [])
      }
      
      setHasMore(data.hasMore || false)
      setPage(currentPage)
      
      return data
    },
    {
      onRetry: (attempt, error) => {
        const classified = classifyError(error)
        console.warn(`Retry fetch services attempt ${attempt}:`, classified.message)
        
        if (classified.type === 'network') {
          addToast({
            type: 'warning',
            title: 'Koneksi Bermasalah',
            message: `Mencoba lagi... (${attempt}/3)`
          })
        }
      }
    }
  )

  // Fetch services wrapper
  const fetchServices = useCallback(async (
    currentPage: number = 1, 
    currentQuery: string = '', 
    currentFilters: FilterState = {},
    append: boolean = false
  ) => {
    setLoading(true)
    setError(null)

    try {
      await fetchServicesWithRetry.execute(currentPage, currentQuery, currentFilters, append)
    } catch (err) {
      const error = err as Error
      const classified = classifyError(error)
      
      setError(error)
      
      // Show toast notification untuk error
      addToast({
        type: 'error',
        title: 'Gagal Memuat Layanan',
        message: classified.message,
        action: classified.isRetryable ? {
          label: 'Coba Lagi',
          onClick: () => fetchServices(currentPage, currentQuery, currentFilters, append)
        } : undefined
      })
      
      // Jika append gagal, jangan reset services yang sudah ada
      if (!append) {
        setServices([])
      }
    } finally {
      setLoading(false)
    }
  }, [fetchServicesWithRetry, addToast])

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

  // Retry function
  const retry = useCallback(() => {
    if (error) {
      fetchServices(page, currentFilters.search || '', currentFilters, false)
    }
  }, [error, page, currentFilters, fetchServices])

  // Initial load dan reload ketika filters berubah
  useEffect(() => {
    fetchCategories.execute().catch(err => {
      console.error('Failed to fetch categories:', err)
      addToast({
        type: 'error',
        title: 'Gagal Memuat Kategori',
        message: 'Tidak dapat memuat daftar kategori. Beberapa fitur mungkin tidak tersedia.'
      })
    })
  }, [fetchCategories, addToast])

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
    refresh,
    retry,
    isRetrying: fetchServicesWithRetry.isLoading
  }
}
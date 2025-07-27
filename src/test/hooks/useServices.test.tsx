import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useServices } from '@/hooks/useServices'
import { mockService } from '../utils'
import type { FilterState } from '@/types/service'

// Mock dependencies
vi.mock('@/hooks/useRetry', () => ({
  useApiRetry: vi.fn((fn, options) => ({
    execute: fn,
    isLoading: false,
    error: null,
    retry: vi.fn()
  }))
}))

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    addToast: vi.fn()
  })
}))

vi.mock('@/lib/utils/errorHandler', () => ({
  classifyError: vi.fn((error) => ({
    type: 'network',
    message: error.message,
    isRetryable: true
  })),
  fetchWithErrorHandling: vi.fn()
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useServices Hook', () => {
  const mockCategories = [
    {
      id: 'cat-1',
      name: 'Sepatu',
      slug: 'sepatu',
      icon: 'shoe',
      description: 'Kategori sepatu',
      isActive: true
    },
    {
      id: 'cat-2',
      name: 'Pakaian',
      slug: 'pakaian',
      icon: 'shirt',
      description: 'Kategori pakaian',
      isActive: true
    }
  ]

  const mockServicesResponse = {
    services: [mockService],
    hasMore: true,
    total: 1
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default fetch responses
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories)
        })
      }
      if (url.includes('/api/services')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockServicesResponse)
        })
      }
      return Promise.reject(new Error('Unknown endpoint'))
    })
  })

  describe('Initial State', () => {
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useServices())
      
      expect(result.current.services).toEqual([])
      expect(result.current.categories).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.hasMore).toBe(true)
    })
  })

  describe('Data Fetching', () => {
    it('should fetch categories and services on mount', async () => {
      const { result } = renderHook(() => useServices())

      await waitFor(() => {
        expect(result.current.categories).toEqual(mockCategories)
        expect(result.current.services).toEqual([mockService])
      })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/categories'))
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/services'))
    })

    it('should apply filters correctly', async () => {
      const filters: FilterState = {
        search: 'sepatu',
        category: 'cat-1',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan',
        rating: 4,
        price_min: 50000,
        price_max: 150000
      }

      renderHook(() => useServices(filters))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('search=sepatu')
        )
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('category=cat-1')
        )
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('province=DKI%20Jakarta')
        )
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('city=Jakarta%20Selatan')
        )
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('rating=4')
        )
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('price_min=50000')
        )
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('price_max=150000')
        )
      })
    })

    it('should handle pagination correctly', async () => {
      const { result } = renderHook(() => useServices())

      await waitFor(() => {
        expect(result.current.services).toEqual([mockService])
      })

      // Test load more
      result.current.loadMore()

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('page=2')
        )
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state during fetch', async () => {
      let resolvePromise: (value: any) => void
      const pendingPromise = new Promise(resolve => {
        resolvePromise = resolve
      })

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/api/services')) {
          return pendingPromise.then(() => ({
            ok: true,
            json: () => Promise.resolve(mockServicesResponse)
          }))
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories)
        })
      })

      const { result } = renderHook(() => useServices())

      // Should be loading initially
      expect(result.current.loading).toBe(true)

      // Resolve the promise
      resolvePromise!({})

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle fetch error correctly', async () => {
      const errorMessage = 'Network error'
      mockFetch.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useServices())

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error)
        expect(result.current.error?.message).toBe(errorMessage)
      })
    })

    it('should handle categories fetch error gracefully', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/api/categories')) {
          return Promise.reject(new Error('Categories error'))
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockServicesResponse)
        })
      })

      const { result } = renderHook(() => useServices())

      await waitFor(() => {
        // Services should still load even if categories fail
        expect(result.current.services).toEqual([mockService])
        expect(result.current.categories).toEqual([])
      })
    })
  })

  describe('Actions', () => {
    it('should refresh data correctly', async () => {
      const { result } = renderHook(() => useServices())

      await waitFor(() => {
        expect(result.current.services).toEqual([mockService])
      })

      // Clear mock calls
      mockFetch.mockClear()

      // Call refresh
      result.current.refresh()

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('page=1')
        )
      })
    })

    it('should retry on error', async () => {
      const errorMessage = 'Network error'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockServicesResponse)
        })

      const { result } = renderHook(() => useServices())

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error)
      })

      // Call retry
      result.current.retry()

      await waitFor(() => {
        expect(result.current.error).toBe(null)
        expect(result.current.services).toEqual([mockService])
      })
    })

    it('should not load more when already loading', async () => {
      let resolvePromise: (value: any) => void
      const pendingPromise = new Promise(resolve => {
        resolvePromise = resolve
      })

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('page=2')) {
          return pendingPromise.then(() => ({
            ok: true,
            json: () => Promise.resolve(mockServicesResponse)
          }))
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(url.includes('/api/categories') ? mockCategories : mockServicesResponse)
        })
      })

      const { result } = renderHook(() => useServices())

      await waitFor(() => {
        expect(result.current.services).toEqual([mockService])
      })

      // Start loading more
      result.current.loadMore()
      
      // Try to load more again while still loading
      const initialCallCount = mockFetch.mock.calls.length
      result.current.loadMore()

      // Should not make additional calls
      expect(mockFetch.mock.calls.length).toBe(initialCallCount)

      // Resolve the promise
      resolvePromise!({})
    })

    it('should not load more when hasMore is false', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/api/services')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              ...mockServicesResponse,
              hasMore: false
            })
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories)
        })
      })

      const { result } = renderHook(() => useServices())

      await waitFor(() => {
        expect(result.current.hasMore).toBe(false)
      })

      const initialCallCount = mockFetch.mock.calls.length
      result.current.loadMore()

      // Should not make additional calls
      expect(mockFetch.mock.calls.length).toBe(initialCallCount)
    })
  })

  describe('Filter Changes', () => {
    it('should refetch when filters change', async () => {
      const { result, rerender } = renderHook(
        ({ filters }) => useServices(filters),
        { initialProps: { filters: {} as FilterState } }
      )

      await waitFor(() => {
        expect(result.current.services).toEqual([mockService])
      })

      // Clear mock calls
      mockFetch.mockClear()

      // Change filters
      rerender({ filters: { search: 'new search' } })

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('search=new%20search')
        )
      })
    })
  })
})
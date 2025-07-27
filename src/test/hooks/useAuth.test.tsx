import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { AuthProvider } from '@/contexts/AuthContext'
import { mockUser, mockMitra } from '../utils'
import { mockSupabaseClient } from '../mocks'

// Mock auth utilities
vi.mock('@/lib/auth/utils', () => ({
  getCurrentUser: vi.fn(),
  loginUser: vi.fn(),
  registerCustomer: vi.fn(),
  registerMitra: vi.fn(),
  logoutUser: vi.fn(),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should return initial loading state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      
      expect(result.current.loading).toBe(true)
      expect(result.current.user).toBe(null)
      expect(result.current.error).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('Authentication Status', () => {
    it('should return correct authentication status for customer', async () => {
      const mockCustomerUser = { ...mockUser, role: 'customer' }
      
      // Mock getCurrentUser untuk return customer
      const { getCurrentUser } = await import('@/lib/auth/utils')
      vi.mocked(getCurrentUser).mockResolvedValue(mockCustomerUser)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(mockCustomerUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.isCustomer).toBe(true)
      expect(result.current.isMitra).toBe(false)
    })

    it('should return correct authentication status for mitra', async () => {
      const mockMitraUser = { ...mockMitra, role: 'mitra' }
      
      const { getCurrentUser } = await import('@/lib/auth/utils')
      vi.mocked(getCurrentUser).mockResolvedValue(mockMitraUser)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(mockMitraUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.isCustomer).toBe(false)
      expect(result.current.isMitra).toBe(true)
    })
  })

  describe('Helper Functions', () => {
    it('should return correct user information', async () => {
      const mockCustomerUser = { ...mockUser, role: 'customer' }
      
      const { getCurrentUser } = await import('@/lib/auth/utils')
      vi.mocked(getCurrentUser).mockResolvedValue(mockCustomerUser)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.getUserRole()).toBe('customer')
      expect(result.current.getUserId()).toBe(mockCustomerUser.id)
      expect(result.current.getUserEmail()).toBe(mockCustomerUser.email)
    })

    it('should return null for helper functions when not authenticated', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.getUserRole()).toBe(null)
      expect(result.current.getUserId()).toBe(null)
      expect(result.current.getUserEmail()).toBe(null)
    })
  })

  describe('Authentication Actions', () => {
    it('should handle login successfully', async () => {
      const { loginUser } = await import('@/lib/auth/utils')
      const mockCredentials = { email: 'test@example.com', password: 'password123' }
      const mockCustomerUser = { ...mockUser, role: 'customer' }
      
      vi.mocked(loginUser).mockResolvedValue(mockCustomerUser)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await result.current.login(mockCredentials)

      expect(loginUser).toHaveBeenCalledWith(mockCredentials)
    })

    it('should handle customer registration successfully', async () => {
      const { registerCustomer } = await import('@/lib/auth/utils')
      const mockRegisterData = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan'
      }
      const mockCustomerUser = { ...mockUser, role: 'customer' }
      
      vi.mocked(registerCustomer).mockResolvedValue(mockCustomerUser)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await result.current.registerAsCustomer(mockRegisterData)

      expect(registerCustomer).toHaveBeenCalledWith(mockRegisterData)
    })

    it('should handle mitra registration successfully', async () => {
      const { registerMitra } = await import('@/lib/auth/utils')
      const mockRegisterData = {
        email: 'mitra@example.com',
        businessName: 'Test Mitra',
        phone: '081234567890',
        password: 'password123',
        address: 'Jl. Test No. 123',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan',
        businessType: 'individual' as const
      }
      const mockMitraUser = { ...mockMitra, role: 'mitra' }
      
      vi.mocked(registerMitra).mockResolvedValue(mockMitraUser)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await result.current.registerAsMitra(mockRegisterData)

      expect(registerMitra).toHaveBeenCalledWith(mockRegisterData)
    })

    it('should handle logout successfully', async () => {
      const { logoutUser, getCurrentUser } = await import('@/lib/auth/utils')
      const mockCustomerUser = { ...mockUser, role: 'customer' }
      
      // Setup initial authenticated state
      vi.mocked(getCurrentUser).mockResolvedValue(mockCustomerUser)
      vi.mocked(logoutUser).mockResolvedValue()

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await result.current.logout()

      expect(logoutUser).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle login error', async () => {
      const { loginUser } = await import('@/lib/auth/utils')
      const mockCredentials = { email: 'test@example.com', password: 'wrongpassword' }
      const errorMessage = 'Invalid credentials'
      
      vi.mocked(loginUser).mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await expect(result.current.login(mockCredentials)).rejects.toThrow(errorMessage)
    })

    it('should handle registration error', async () => {
      const { registerCustomer } = await import('@/lib/auth/utils')
      const mockRegisterData = {
        email: 'existing@example.com',
        fullName: 'Test User',
        password: 'password123',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan'
      }
      const errorMessage = 'Email already exists'
      
      vi.mocked(registerCustomer).mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await expect(result.current.registerAsCustomer(mockRegisterData)).rejects.toThrow(errorMessage)
    })
  })
})
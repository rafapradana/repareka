import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUser } from '@/hooks/useUser'
import { mockSupabaseClient } from '../mocks'
import { mockUser } from '../utils'

describe('useUser Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('harus mengembalikan initial state yang benar', () => {
    const { result } = renderHook(() => useUser())
    
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('harus berhasil mengambil data user', async () => {
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockUser,
        error: null
      })
    })

    const { result } = renderHook(() => useUser())

    await act(async () => {
      await result.current.fetchUser('123')
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.loading).toBe(false)
  })

  it('harus berhasil mengupdate profil user', async () => {
    const updatedUser = { ...mockUser, fullName: 'Updated User' }
    
    mockSupabaseClient.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: updatedUser,
        error: null
      })
    })

    const { result } = renderHook(() => useUser())

    await act(async () => {
      await result.current.updateProfile('123', { fullName: 'Updated User' })
    })

    expect(result.current.user).toEqual(updatedUser)
  })

  it('harus menangani error saat fetch user gagal', async () => {
    const errorMessage = 'User not found'
    
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { message: errorMessage }
      })
    })

    const { result } = renderHook(() => useUser())

    await act(async () => {
      await result.current.fetchUser('invalid-id')
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.user).toBeNull()
  })

  it('harus menangani error saat update profil gagal', async () => {
    const errorMessage = 'Update failed'
    
    mockSupabaseClient.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { message: errorMessage }
      })
    })

    const { result } = renderHook(() => useUser())

    await act(async () => {
      await result.current.updateProfile('123', { fullName: 'Updated User' })
    })

    expect(result.current.error).toBe(errorMessage)
  })

  it('harus mengupdate loading state dengan benar', async () => {
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          data: mockUser,
          error: null
        }), 100))
      )
    })

    const { result } = renderHook(() => useUser())

    act(() => {
      result.current.fetchUser('123')
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
    })

    expect(result.current.loading).toBe(false)
  })
})
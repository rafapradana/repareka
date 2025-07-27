import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMitra } from '@/hooks/useMitra'
import { mockSupabaseClient } from '../mocks'
import { mockMitra } from '../utils'

describe('useMitra Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('harus mengembalikan initial state yang benar', () => {
    const { result } = renderHook(() => useMitra())
    
    expect(result.current.mitra).toBeNull()
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('harus berhasil register mitra baru', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: { id: '456', email: 'mitra@example.com' } },
      error: null
    })

    mockSupabaseClient.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        data: mockMitra,
        error: null
      })
    })

    const { result } = renderHook(() => useMitra())

    const registerData = {
      email: 'mitra@example.com',
      password: 'password123',
      businessName: 'Test Mitra',
      phone: '081234567890',
      address: 'Jl. Test No. 123',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      businessType: 'individual' as const
    }

    await act(async () => {
      await result.current.registerMitra(registerData)
    })

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalled()
  })

  it('harus berhasil login mitra dengan akun yang sudah diverifikasi', async () => {
    const verifiedMitra = { ...mockMitra, verificationStatus: 'approved' as const }
    
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '456', email: 'mitra@example.com' } },
      error: null
    })

    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: verifiedMitra,
        error: null
      })
    })

    const { result } = renderHook(() => useMitra())

    await act(async () => {
      await result.current.signInMitra('mitra@example.com', 'password123')
    })

    expect(result.current.mitra).toEqual(verifiedMitra)
  })

  it('harus menangani mitra dengan status pending verification', async () => {
    const pendingMitra = { ...mockMitra, verificationStatus: 'pending' as const }
    
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '456', email: 'mitra@example.com' } },
      error: null
    })

    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: pendingMitra,
        error: null
      })
    })

    const { result } = renderHook(() => useMitra())

    await act(async () => {
      await result.current.signInMitra('mitra@example.com', 'password123')
    })

    expect(result.current.error).toContain('verifikasi')
  })

  it('harus berhasil mengupdate profil mitra', async () => {
    const updatedMitra = { ...mockMitra, businessName: 'Updated Mitra' }
    
    mockSupabaseClient.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: updatedMitra,
        error: null
      })
    })

    const { result } = renderHook(() => useMitra())

    await act(async () => {
      await result.current.updateMitraProfile('456', { businessName: 'Updated Mitra' })
    })

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('mitra')
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

    const { result } = renderHook(() => useMitra())

    await act(async () => {
      await result.current.updateMitraProfile('456', { businessName: 'Updated Mitra' })
    })

    expect(result.current.error).toBe(errorMessage)
  })
})
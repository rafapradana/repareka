import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { mockSupabaseClient } from '../mocks'
import { mockUser } from '../utils'

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('harus mengembalikan initial state yang benar', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('harus berhasil login dengan kredensial yang valid', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123')
    })

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('harus menangani error saat login gagal', async () => {
    const errorMessage = 'Invalid credentials'
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: errorMessage }
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn('test@example.com', 'wrongpassword')
    })

    expect(result.current.error).toBe(errorMessage)
  })

  it('harus berhasil register user baru', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null
    })

    const { result } = renderHook(() => useAuth())

    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan'
    }

    await act(async () => {
      await result.current.signUp(registerData)
    })

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          full_name: registerData.fullName,
          province: registerData.province,
          city: registerData.city
        }
      }
    })
  })

  it('harus berhasil logout', async () => {
    mockSupabaseClient.auth.signOut.mockResolvedValue({
      error: null
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
  })

  it('harus mengupdate loading state dengan benar', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        data: { user: mockUser },
        error: null
      }), 100))
    )

    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.signIn('test@example.com', 'password123')
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
    })

    expect(result.current.loading).toBe(false)
  })
})
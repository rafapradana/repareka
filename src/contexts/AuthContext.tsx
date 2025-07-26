'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, loginUser, registerCustomer, registerMitra, logoutUser } from '@/lib/auth/utils'
import type { AuthState, LoginCredentials, CustomerRegisterData, MitraRegisterData } from '@/lib/auth/types'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  registerAsCustomer: (data: CustomerRegisterData) => Promise<void>
  registerAsMitra: (data: MitraRegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  // Listen to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUser()
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({
            ...prev,
            user: null,
            loading: false
          }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const user = await getCurrentUser()
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }))
    } catch (error) {
      console.error('Error initializing auth:', error)
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat inisialisasi'
      }))
    }
  }

  const loadUser = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const user = await getCurrentUser()
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }))
    } catch (error) {
      console.error('Error loading user:', error)
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat user'
      }))
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const user = await loginUser(credentials)
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }))
    } catch (error) {
      console.error('Login error:', error)
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat login'
      }))
      throw error
    }
  }

  const registerAsCustomer = async (data: CustomerRegisterData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const user = await registerCustomer(data)
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }))
    } catch (error) {
      console.error('Customer registration error:', error)
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi'
      }))
      throw error
    }
  }

  const registerAsMitra = async (data: MitraRegisterData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const user = await registerMitra(data)
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }))
    } catch (error) {
      console.error('Mitra registration error:', error)
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi mitra'
      }))
      throw error
    }
  }

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await logoutUser()
      setState(prev => ({
        ...prev,
        user: null,
        loading: false
      }))
    } catch (error) {
      console.error('Logout error:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat logout'
      }))
      throw error
    }
  }

  const refreshUser = async () => {
    await loadUser()
  }

  const value: AuthContextType = {
    ...state,
    login,
    registerAsCustomer,
    registerAsMitra,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
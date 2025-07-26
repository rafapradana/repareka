'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { MitraAuthForm } from '@/components/auth/MitraAuthForm'
import { MitraVerificationStatus } from '@/components/auth/MitraVerificationStatus'
import { useAuthContext } from '@/contexts/AuthContext'
import type { Mitra } from '@/lib/auth/types'

export default function MitraPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user, loading, logout } = useAuthContext()
  const router = useRouter()

  // Redirect jika user adalah customer
  useEffect(() => {
    if (!loading && user?.role === 'customer') {
      router.push('/')
    }
  }, [user, loading, router])

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setError(null)
    if (authMode === 'register') {
      setSuccess('Registrasi berhasil! Akun Anda sedang dalam proses verifikasi.')
    } else {
      setSuccess('Login berhasil!')
    }
  }

  // Handle authentication error
  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage)
    setSuccess(null)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      setError(null)
      setSuccess(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-base-600">Memuat...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Jika user sudah login sebagai mitra
  if (user?.role === 'mitra') {
    const mitra = user.profile as Mitra
    
    // Jika mitra sudah diverifikasi dan aktif, redirect ke dashboard
    if (mitra.verification_status === 'approved' && mitra.is_active) {
      router.push('/mitra/dashboard')
      return null
    }
    
    // Jika belum diverifikasi, tampilkan status verifikasi
    return <MitraVerificationStatus mitra={mitra} onLogout={handleLogout} />
  }

  // Halaman auth untuk mitra
  return (
    <MainLayout>
      <div className="min-h-screen bg-base-50 py-12">
        <div className="container mx-auto px-4">
          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex text-red-400 hover:text-red-600"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setSuccess(null)}
                      className="inline-flex text-green-400 hover:text-green-600"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Auth Form */}
          <MitraAuthForm
            mode={authMode}
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
            onModeChange={setAuthMode}
          />

          {/* Benefits Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-base-900 mb-4">
                Mengapa Bergabung dengan Repareka?
              </h2>
              <p className="text-lg text-base-600">
                Dapatkan lebih banyak pelanggan dan kembangkan bisnis reparasi Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-base-900 mb-2">Jangkauan Lebih Luas</h3>
                <p className="text-base-600">
                  Dapatkan akses ke ribuan pelanggan potensial di seluruh Indonesia
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-base-900 mb-2">Kelola Bisnis Mudah</h3>
                <p className="text-base-600">
                  Dashboard lengkap untuk mengelola pesanan, jadwal, dan keuangan
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-base-900 mb-2">Pembayaran Aman</h3>
                <p className="text-base-600">
                  Sistem pembayaran terintegrasi dengan jaminan keamanan transaksi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
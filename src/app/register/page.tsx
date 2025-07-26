'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { CustomerAuthForm } from '@/components/auth/CustomerAuthForm'
import { useAuthContext } from '@/contexts/AuthContext'

function RegisterPageContent() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')

  // Redirect jika user sudah login
  useEffect(() => {
    if (!loading && user) {
      const destination = redirectTo || (user.role === 'mitra' ? '/mitra/dashboard' : '/')
      router.push(destination)
    }
  }, [user, loading, router, redirectTo])

  // Handle successful registration
  const handleRegisterSuccess = () => {
    setError(null)
    setSuccess('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.')
    
    // Redirect setelah beberapa detik
    setTimeout(() => {
      const destination = redirectTo || '/'
      router.push(destination)
    }, 3000)
  }

  // Handle registration error
  const handleRegisterError = (errorMessage: string) => {
    setError(errorMessage)
    setSuccess(null)
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

  // Jika user sudah login, jangan render form
  if (user) {
    return null
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-base-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="font-display font-semibold text-2xl text-base-900">
                Repareka
              </span>
            </Link>
            <h2 className="text-3xl font-display font-bold text-base-900">
              Daftar Akun Baru
            </h2>
            <p className="mt-2 text-sm text-base-600">
              Sudah punya akun?{' '}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
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
          )}

          {/* Success Message */}
          {success && (
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
              </div>
            </div>
          )}

          {/* Register Form */}
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-base-200">
            <CustomerAuthForm
              mode="register"
              onSuccess={handleRegisterSuccess}
              onError={handleRegisterError}
              redirectUrl={redirectTo || undefined}
            />
          </div>

          {/* Additional Links */}
          <div className="text-center space-y-4">
            <div className="border-t border-base-200 pt-4">
              <p className="text-sm text-base-600">
                Ingin bergabung sebagai mitra?{' '}
                <Link
                  href="/mitra"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Daftar sebagai mitra
                </Link>
              </p>
            </div>
            
            <div className="text-xs text-base-500 max-w-sm mx-auto">
              Dengan mendaftar, Anda menyetujui{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                Syarat dan Ketentuan
              </Link>{' '}
              serta{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                Kebijakan Privasi
              </Link>{' '}
              kami.
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-base-600">Memuat...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <RegisterPageContent />
    </Suspense>
  )
}
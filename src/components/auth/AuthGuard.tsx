'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: 'customer' | 'mitra'
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * AuthGuard component untuk melindungi route yang memerlukan autentikasi
 * Akan redirect ke halaman login jika user belum authenticated
 */
export function AuthGuard({ 
  children, 
  requiredRole, 
  fallback,
  redirectTo 
}: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Simpan current URL untuk redirect setelah login
      const currentUrl = window.location.pathname + window.location.search
      const loginUrl = requiredRole === 'mitra' 
        ? `/mitra?redirect=${encodeURIComponent(currentUrl)}`
        : `/?login=true&redirect=${encodeURIComponent(currentUrl)}`
      
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.push(loginUrl)
      }
    }
  }, [loading, isAuthenticated, router, requiredRole, redirectTo])

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Jika tidak authenticated, tampilkan fallback atau loading
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Check role jika diperlukan
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-base-800 mb-2">
            Akses Ditolak
          </h2>
          <p className="text-base-600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
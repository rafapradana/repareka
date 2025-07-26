'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/lib/auth/types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

/**
 * AuthGuard component untuk protecting routes dan components
 * Mengatur akses berdasarkan authentication status dan role
 */
export function AuthGuard({
  children,
  requiredRole,
  requireAuth = true,
  redirectTo,
  fallback
}: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Tunggu loading selesai
    if (loading) return

    // Jika memerlukan auth tapi user tidak authenticated
    if (requireAuth && !isAuthenticated) {
      const redirect = redirectTo || '/login'
      router.push(redirect)
      return
    }

    // Jika memerlukan role tertentu tapi user tidak memiliki role tersebut
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect berdasarkan role user
      if (user?.role === 'customer') {
        router.push('/')
      } else if (user?.role === 'mitra') {
        router.push('/mitra/dashboard')
      } else {
        router.push('/login')
      }
      return
    }
  }, [loading, isAuthenticated, user, requiredRole, requireAuth, redirectTo, router])

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Jika memerlukan auth tapi tidak authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback || null
  }

  // Jika memerlukan role tertentu tapi tidak sesuai
  if (requiredRole && user?.role !== requiredRole) {
    return fallback || null
  }

  // Jika semua kondisi terpenuhi, render children
  return <>{children}</>
}

// Higher-order component untuk wrapping pages
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

// Specific guards untuk role-based protection
export function CustomerGuard({ children, ...props }: Omit<AuthGuardProps, 'requiredRole'>) {
  return (
    <AuthGuard requiredRole="customer" {...props}>
      {children}
    </AuthGuard>
  )
}

export function MitraGuard({ children, ...props }: Omit<AuthGuardProps, 'requiredRole'>) {
  return (
    <AuthGuard requiredRole="mitra" {...props}>
      {children}
    </AuthGuard>
  )
}
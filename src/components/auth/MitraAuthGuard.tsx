'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import type { Mitra } from '@/lib/auth/types'

interface MitraAuthGuardProps {
  children: React.ReactNode
  requireVerification?: boolean
  fallbackUrl?: string
}

/**
 * Component untuk melindungi halaman yang hanya bisa diakses oleh mitra
 * Akan redirect ke halaman login mitra jika user bukan mitra atau belum login
 */
export function MitraAuthGuard({ 
  children, 
  requireVerification = true,
  fallbackUrl = '/mitra'
}: MitraAuthGuardProps) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Redirect jika user tidak ada atau bukan mitra
      if (!user || user.role !== 'mitra') {
        router.push(fallbackUrl)
        return
      }

      // Jika memerlukan verifikasi, cek status verifikasi
      if (requireVerification) {
        const mitra = user.profile as Mitra
        
        if (mitra.verification_status !== 'approved' || !mitra.is_active) {
          router.push(fallbackUrl)
          return
        }
      }
    }
  }, [user, loading, router, requireVerification, fallbackUrl])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-base-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if user is not authorized (will redirect)
  if (!user || user.role !== 'mitra') {
    return null
  }

  // Check verification status if required
  if (requireVerification) {
    const mitra = user.profile as Mitra
    
    if (mitra.verification_status !== 'approved' || !mitra.is_active) {
      return null
    }
  }

  // Render children if all checks pass
  return <>{children}</>
}
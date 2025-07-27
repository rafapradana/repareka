'use client'

import React from 'react'
import { MitraAuthGuard } from '@/components/auth/MitraAuthGuard'

interface MitraDashboardLayoutWrapperProps {
  children: React.ReactNode
}

/**
 * Layout wrapper untuk semua halaman dashboard mitra
 * Memastikan semua halaman dashboard dilindungi dengan MitraAuthGuard
 */
export default function MitraDashboardLayoutWrapper({ 
  children 
}: MitraDashboardLayoutWrapperProps) {
  return (
    <MitraAuthGuard requireVerification={true}>
      {children}
    </MitraAuthGuard>
  )
}
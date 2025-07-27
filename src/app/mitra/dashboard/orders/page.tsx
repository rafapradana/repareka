'use client'

import React from 'react'
import { MitraAuthGuard } from '@/components/auth/MitraAuthGuard'
import { MitraDashboardLayout } from '@/components/dashboard'

export default function OrdersPage() {
  return (
    <MitraAuthGuard>
      <MitraDashboardLayout 
        title="Pesanan" 
        subtitle="Kelola semua pesanan dari pelanggan"
      >
        <div className="bg-white rounded-lg border border-base-200 p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-base-900">Halaman Pesanan</h3>
            <p className="mt-1 text-sm text-base-500">
              Fitur manajemen pesanan akan segera tersedia
            </p>
          </div>
        </div>
      </MitraDashboardLayout>
    </MitraAuthGuard>
  )
}
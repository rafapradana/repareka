'use client'

import React from 'react'
import { MitraDashboardLayout } from '@/components/dashboard'

export default function ReportsPage() {
  return (
    <MitraDashboardLayout 
      title="Laporan" 
      subtitle="Analisis performa bisnis Anda"
    >
      <div className="bg-white rounded-lg border border-base-200 p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-base-900">Halaman Laporan</h3>
          <p className="mt-1 text-sm text-base-500">
            Fitur laporan dan analisis akan segera tersedia
          </p>
        </div>
      </div>
    </MitraDashboardLayout>
  )
}
'use client'

import React from 'react'
import { MitraAuthGuard } from '@/components/auth/MitraAuthGuard'
import { MitraDashboardLayout } from '@/components/dashboard'

export default function CalendarPage() {
  return (
    <MitraAuthGuard>
      <MitraDashboardLayout 
        title="Kalender" 
        subtitle="Kelola jadwal dan appointment"
      >
        <div className="bg-white rounded-lg border border-base-200 p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2H10a2 2 0 00-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-base-900">Halaman Kalender</h3>
            <p className="mt-1 text-sm text-base-500">
              Fitur kalender dan penjadwalan akan segera tersedia
            </p>
          </div>
        </div>
      </MitraDashboardLayout>
    </MitraAuthGuard>
  )
}
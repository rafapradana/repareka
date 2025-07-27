'use client'

import React from 'react'
import { MitraDashboardLayout } from '@/components/dashboard'

export default function CalendarPage() {
  return (
    <MitraDashboardLayout 
      title="Kalender" 
      subtitle="Kelola jadwal dan appointment"
    >
      <div className="bg-white rounded-lg border border-base-200 p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-base-900">Halaman Kalender</h3>
          <p className="mt-1 text-sm text-base-500">
            Fitur kalender dan penjadwalan akan segera tersedia
          </p>
        </div>
      </div>
    </MitraDashboardLayout>
  )
}
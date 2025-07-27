'use client'

import React from 'react'
import { MitraAuthGuard } from '@/components/auth/MitraAuthGuard'
import { MitraDashboardLayout } from '@/components/dashboard'

export default function MessagesPage() {
  return (
    <MitraAuthGuard>
      <MitraDashboardLayout 
        title="Pesan" 
        subtitle="Komunikasi dengan pelanggan"
      >
        <div className="bg-white rounded-lg border border-base-200 p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-base-900">Halaman Pesan</h3>
            <p className="mt-1 text-sm text-base-500">
              Fitur messaging akan segera tersedia
            </p>
          </div>
        </div>
      </MitraDashboardLayout>
    </MitraAuthGuard>
  )
}
'use client'

import React from 'react'
import { MitraAuthGuard } from '@/components/auth/MitraAuthGuard'
import { MitraDashboardLayout } from '@/components/dashboard'

export default function ProfilePage() {
  return (
    <MitraAuthGuard>
      <MitraDashboardLayout 
        title="Profil" 
        subtitle="Kelola informasi profil bisnis Anda"
      >
        <div className="bg-white rounded-lg border border-base-200 p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-base-900">Halaman Profil</h3>
            <p className="mt-1 text-sm text-base-500">
              Fitur manajemen profil akan segera tersedia
            </p>
          </div>
        </div>
      </MitraDashboardLayout>
    </MitraAuthGuard>
  )
}
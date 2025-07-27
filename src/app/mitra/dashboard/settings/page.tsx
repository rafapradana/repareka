'use client'

import React from 'react'
import { MitraDashboardLayout } from '@/components/dashboard'

export default function SettingsPage() {
  return (
    <MitraDashboardLayout 
      title="Pengaturan" 
      subtitle="Konfigurasi akun dan preferensi"
    >
      <div className="bg-white rounded-lg border border-base-200 p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-base-900">Halaman Pengaturan</h3>
          <p className="mt-1 text-sm text-base-500">
            Fitur pengaturan akan segera tersedia
          </p>
        </div>
      </div>
    </MitraDashboardLayout>
  )
}
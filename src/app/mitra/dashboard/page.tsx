'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import type { Mitra } from '@/lib/auth/types'

export default function MitraDashboardPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Redirect jika bukan mitra
      if (!user || user.role !== 'mitra') {
        router.push('/mitra')
        return
      }

      const mitra = user.profile as Mitra
      
      // Redirect jika belum diverifikasi
      if (mitra.verification_status !== 'approved' || !mitra.is_active) {
        router.push('/mitra')
        return
      }
    }
  }, [user, loading, router])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-base-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  // Jika user tidak ada atau bukan mitra, jangan render apapun (akan redirect)
  if (!user || user.role !== 'mitra') {
    return null
  }

  const mitra = user.profile as Mitra

  return (
    <div className="min-h-screen bg-base-50">
      {/* Header */}
      <div className="bg-white border-b border-base-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-base-900">
                Dashboard Mitra
              </h1>
              <p className="text-base-600 mt-1">
                Selamat datang, {mitra.business_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-base-500">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metrics Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-base-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-base-500">Pesanan Baru</p>
                    <p className="text-2xl font-bold text-base-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-base-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-base-500">Total Pendapatan</p>
                    <p className="text-2xl font-bold text-base-900">Rp 0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-base-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-base-500">Rating Rata-rata</p>
                    <p className="text-2xl font-bold text-base-900">0.0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg border border-base-200">
              <div className="px-6 py-4 border-b border-base-200">
                <h3 className="text-lg font-semibold text-base-900">Pesanan Terbaru</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-base-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-base-900">Belum ada pesanan</h3>
                  <p className="mt-1 text-sm text-base-500">
                    Pesanan dari pelanggan akan muncul di sini
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-base-200 p-6">
              <h3 className="text-lg font-semibold text-base-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tambah Layanan
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-base-50 text-base-700 rounded-lg hover:bg-base-100 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Edit Profil
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-base-50 text-base-700 rounded-lg hover:bg-base-100 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2H10a2 2 0 00-2 2z" />
                    </svg>
                    Pengaturan
                  </div>
                </button>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-lg border border-base-200 p-6">
              <h3 className="text-lg font-semibold text-base-900 mb-4">Info Bisnis</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-base-500">Nama Bisnis</p>
                  <p className="font-medium text-base-900">{mitra.business_name}</p>
                </div>
                <div>
                  <p className="text-sm text-base-500">Jenis Bisnis</p>
                  <p className="font-medium text-base-900">
                    {mitra.business_type === 'individual' ? 'Perorangan' :
                     mitra.business_type === 'small_business' ? 'Usaha Kecil' : 'Perusahaan'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-500">Lokasi</p>
                  <p className="font-medium text-base-900">{mitra.city}, {mitra.province}</p>
                </div>
                <div>
                  <p className="text-sm text-base-500">Bergabung Sejak</p>
                  <p className="font-medium text-base-900">
                    {new Date(mitra.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg border border-base-200 p-6">
              <h3 className="text-lg font-semibold text-base-900 mb-4">Bantuan & Dukungan</h3>
              <div className="space-y-3">
                <a
                  href="/help"
                  className="block text-sm text-primary-600 hover:text-primary-700"
                >
                  📚 Panduan Mitra
                </a>
                <a
                  href="mailto:support@repareka.com"
                  className="block text-sm text-primary-600 hover:text-primary-700"
                >
                  📧 Hubungi Support
                </a>
                <a
                  href="/faq"
                  className="block text-sm text-primary-600 hover:text-primary-700"
                >
                  ❓ FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
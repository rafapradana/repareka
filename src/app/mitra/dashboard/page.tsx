'use client'

import React from 'react'
import { 
  MitraDashboardLayout, 
  MetricsCards, 
  RecentOrders, 
  NotificationPanel 
} from '@/components/dashboard'
import { useDashboard } from '@/hooks/useDashboard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, RefreshCw } from 'lucide-react'

export default function MitraDashboardPage() {
  const { 
    data, 
    loading, 
    error, 
    refreshData, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useDashboard()

  const handleRefresh = async () => {
    await refreshData()
  }

  return (
    <MitraDashboardLayout 
      title="Dashboard" 
      subtitle="Ringkasan aktivitas bisnis Anda"
    >
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRefresh}
                className="text-red-600 hover:text-red-700"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Coba Lagi
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-base-900">Selamat datang kembali!</h2>
              <p className="text-sm text-base-600 mt-1">
                Berikut adalah ringkasan aktivitas bisnis Anda hari ini
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link 
                href="/mitra/dashboard/services"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Layanan
              </Link>
              <Button
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div>
            <h3 className="text-base font-medium text-base-900 mb-4">Statistik Bisnis</h3>
            <MetricsCards 
              metrics={data?.metrics || {
                newOrders: 0,
                totalRevenue: 0,
                averageRating: 0,
                completedOrders: 0,
                pendingOrders: 0,
                monthlyGrowth: 0
              }} 
              loading={loading} 
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <RecentOrders 
                orders={data?.recentOrders || []} 
                loading={loading} 
              />
            </div>

            {/* Notifications */}
            <div>
              <NotificationPanel
                notifications={data?.notifications || []}
                loading={loading}
                onMarkAsRead={markNotificationAsRead}
                onMarkAllAsRead={markAllNotificationsAsRead}
              />
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Tips */}
            <div className="bg-white rounded-lg border border-base-200 p-6">
              <h3 className="text-lg font-semibold text-base-900 mb-4">Tips Meningkatkan Bisnis</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-base-600">
                    Lengkapi profil bisnis Anda dengan foto dan deskripsi yang menarik
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-base-600">
                    Respon pesan pelanggan dengan cepat untuk meningkatkan kepuasan
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-base-600">
                    Tambahkan portfolio hasil kerja untuk membangun kepercayaan
                  </p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg border border-base-200 p-6">
              <h3 className="text-lg font-semibold text-base-900 mb-4">Bantuan & Dukungan</h3>
              <div className="space-y-3">
                <Link
                  href="/help/mitra"
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Panduan Mitra
                </Link>
                <Link
                  href="/help/faq"
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  FAQ
                </Link>
                <Link
                  href="mailto:support@repareka.com"
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Hubungi Support
                </Link>
              </div>
            </div>
          </div>
        </div>
    </MitraDashboardLayout>
  )
}
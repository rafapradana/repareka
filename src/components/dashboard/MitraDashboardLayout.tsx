'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { MitraSidebar } from './MitraSidebar'
import { useAuthContext } from '@/contexts/AuthContext'
import type { Mitra } from '@/lib/auth/types'

interface MitraDashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function MitraDashboardLayout({ 
  children, 
  title = 'Dashboard',
  subtitle 
}: MitraDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthContext()
  const router = useRouter()

  // Pastikan user adalah mitra
  if (!user || user.role !== 'mitra') {
    return null
  }

  const mitra = user.profile as Mitra

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/mitra')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-base-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <MitraSidebar mitra={mitra} onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-base-200">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-base-600 hover:text-base-900 hover:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Page title */}
              <div>
                <h1 className="text-xl font-semibold text-base-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-base-600 mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            {/* User info */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-base-900">{mitra.business_name}</p>
                <p className="text-xs text-base-500">{mitra.city}, {mitra.province}</p>
              </div>
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {mitra.business_name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar close button */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed top-4 right-4 z-50 lg:hidden p-2 rounded-md bg-white text-base-600 hover:text-base-900 hover:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
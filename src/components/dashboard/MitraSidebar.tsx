'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  User, 
  Settings, 
  BarChart3,
  MessageSquare,
  Star,
  Bell,
  ThumbsUp,
  LogOut
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import type { Mitra } from '@/lib/auth/types'

interface MitraSidebarProps {
  mitra: Mitra
  onLogout: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export function MitraSidebar({ mitra, onLogout }: MitraSidebarProps) {
  const pathname = usePathname()
  const { data } = useDashboard()

  // Update navigation items dengan badge count dinamis
  const getNavigationItems = (): NavigationItem[] => [
    {
      name: 'Dashboard',
      href: '/mitra/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Pesanan',
      href: '/mitra/dashboard/orders',
      icon: ShoppingBag,
      badge: data?.metrics.newOrders || 0,
    },
    {
      name: 'Layanan',
      href: '/mitra/dashboard/services',
      icon: Star,
    },
    {
      name: 'Kalender',
      href: '/mitra/dashboard/calendar',
      icon: Calendar,
    },
    {
      name: 'Pesan',
      href: '/mitra/dashboard/messages',
      icon: MessageSquare,
      badge: data?.unreadMessagesCount || 0,
    },
    {
      name: 'Ulasan',
      href: '/mitra/dashboard/reviews',
      icon: ThumbsUp,
    },
    {
      name: 'Laporan',
      href: '/mitra/dashboard/reports',
      icon: BarChart3,
    },
    {
      name: 'Notifikasi',
      href: '/mitra/dashboard/notifications',
      icon: Bell,
      badge: data?.unreadNotificationsCount || 0,
    },
    {
      name: 'Profil',
      href: '/mitra/dashboard/profile',
      icon: User,
    },
    {
      name: 'Pengaturan',
      href: '/mitra/dashboard/settings',
      icon: Settings,
    },
  ]

  const navigationItems = getNavigationItems()

  return (
    <div className="flex flex-col h-full bg-white border-r border-base-200">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-base-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-lg">
              {mitra.business_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-base-900 truncate">
              {mitra.business_name}
            </h2>
            <p className="text-xs text-base-500 truncate">
              {mitra.city}, {mitra.province}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-base-600 hover:bg-base-50 hover:text-base-900'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary-600' : 'text-base-400 group-hover:text-base-500'
                )}
              />
              <span className="flex-1">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-base-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-base-500">Status: Aktif</span>
          </div>
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Terverifikasi
          </span>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-base-600 rounded-lg hover:bg-base-50 hover:text-base-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-base-400" />
          Keluar
        </button>
      </div>
    </div>
  )
}
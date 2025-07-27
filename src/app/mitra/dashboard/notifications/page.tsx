'use client'

import React from 'react'
import { MitraDashboardLayout, NotificationPanel } from '@/components/dashboard'
import { useDashboard } from '@/hooks/useDashboard'

export default function NotificationsPage() {
  const { 
    data, 
    loading, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useDashboard()

  return (
    <MitraDashboardLayout 
      title="Notifikasi" 
      subtitle="Semua notifikasi dan pemberitahuan"
    >
      <div className="max-w-4xl">
        <NotificationPanel
          notifications={data?.notifications || []}
          loading={loading}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />
      </div>
    </MitraDashboardLayout>
  )
}
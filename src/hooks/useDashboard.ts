'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DashboardMetrics, Order, Notification } from '@/components/dashboard'

interface DashboardData {
  metrics: DashboardMetrics
  recentOrders: Order[]
  notifications: Notification[]
  unreadNotificationsCount: number
  unreadMessagesCount: number
}

interface UseDashboardReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  markNotificationAsRead: (notificationId: string) => void
  markAllNotificationsAsRead: () => void
}

/**
 * Hook untuk mengambil data dashboard mitra
 * Saat ini menggunakan mock data, nantinya akan diintegrasikan dengan API
 */
// Mock data - akan diganti dengan API call
const getMockData = (): DashboardData => {
  const notifications = [
    {
      id: '1',
      type: 'order' as const,
      title: 'Pesanan Baru',
      message: 'Ahmad Rizki memesan layanan Reparasi Sepatu Kulit',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      is_read: false,
      action_url: '/mitra/dashboard/orders/1',
      priority: 'high' as const
    },
    {
      id: '2',
      type: 'message' as const,
      title: 'Pesan Baru',
      message: 'Ahmad Rizki mengirim pesan tentang pesanannya',
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      is_read: false,
      action_url: '/mitra/dashboard/messages',
      priority: 'medium' as const
    },
    {
      id: '3',
      type: 'review' as const,
      title: 'Review Baru',
      message: 'Budi Santoso memberikan review 5 bintang untuk layanan Anda',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      is_read: true,
      action_url: '/mitra/dashboard/reviews',
      priority: 'low' as const
    },
    {
      id: '4',
      type: 'payment' as const,
      title: 'Pembayaran Diterima',
      message: 'Pembayaran untuk pesanan #12345 telah dikonfirmasi',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      is_read: true,
      action_url: '/mitra/dashboard/orders/12345',
      priority: 'medium' as const
    },
    {
      id: '5',
      type: 'system' as const,
      title: 'Update Profil',
      message: 'Jangan lupa lengkapi profil bisnis Anda untuk meningkatkan kepercayaan pelanggan',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      is_read: false,
      action_url: '/mitra/dashboard/profile',
      priority: 'low' as const
    }
  ]

  const recentOrders = [
    {
      id: '1',
      customer_name: 'Ahmad Rizki',
      service_title: 'Reparasi Sepatu Kulit',
      status: 'pending' as const,
      total_amount: 150000,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      has_unread_messages: true
    },
    {
      id: '2',
      customer_name: 'Siti Nurhaliza',
      service_title: 'Jahit Celana Panjang',
      status: 'in_progress' as const,
      total_amount: 75000,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      has_unread_messages: false
    },
    {
      id: '3',
      customer_name: 'Budi Santoso',
      service_title: 'Service Laptop',
      status: 'completed' as const,
      total_amount: 300000,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      has_unread_messages: false
    }
  ]

  // Hitung unread notifications dan messages
  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length
  const unreadMessagesCount = recentOrders.filter(o => o.has_unread_messages).length

  return {
    metrics: {
      newOrders: 3,
      totalRevenue: 2500000,
      averageRating: 4.8,
      completedOrders: 15,
      pendingOrders: 5,
      monthlyGrowth: 12.5
    },
    recentOrders,
    notifications,
    unreadNotificationsCount,
    unreadMessagesCount
  }
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/mitra/dashboard')
      // const data = await response.json()
      
      setData(getMockData())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshData = async () => {
    await fetchDashboardData()
  }

  const markNotificationAsRead = (notificationId: string) => {
    setData(prevData => {
      if (!prevData) return prevData
      
      return {
        ...prevData,
        notifications: prevData.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      }
    })
    
    // TODO: Send API request to mark notification as read
    // await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
  }

  const markAllNotificationsAsRead = () => {
    setData(prevData => {
      if (!prevData) return prevData
      
      return {
        ...prevData,
        notifications: prevData.notifications.map(notification => ({
          ...notification,
          is_read: true
        }))
      }
    })
    
    // TODO: Send API request to mark all notifications as read
    // await fetch('/api/notifications/read-all', { method: 'POST' })
  }

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    data,
    loading,
    error,
    refreshData,
    markNotificationAsRead,
    markAllNotificationsAsRead
  }
}
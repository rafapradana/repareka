'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Bell, 
  MessageSquare, 
  Star, 
  ShoppingBag, 
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface Notification {
  id: string
  type: 'order' | 'message' | 'review' | 'system' | 'payment'
  title: string
  message: string
  created_at: string
  is_read: boolean
  action_url?: string
  priority: 'low' | 'medium' | 'high'
}

interface NotificationPanelProps {
  notifications: Notification[]
  loading?: boolean
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
}

const notificationConfig = {
  order: {
    icon: ShoppingBag,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  message: {
    icon: MessageSquare,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  review: {
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  system: {
    icon: AlertCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  payment: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
}

const priorityConfig = {
  low: 'border-l-base-300',
  medium: 'border-l-yellow-400',
  high: 'border-l-red-400'
}

function NotificationSkeleton() {
  return (
    <div className="flex items-start space-x-3 p-4 border-b border-base-100 last:border-b-0">
      <div className="w-10 h-10 bg-base-200 rounded-full animate-pulse"></div>
      <div className="flex-1 animate-pulse">
        <div className="h-4 bg-base-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-base-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-base-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}

function NotificationItem({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification
  onMarkAsRead: (id: string) => void 
}) {
  const config = notificationConfig[notification.type]
  const Icon = config.icon
  
  const formatDate = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Baru saja'
    } else if (diffInHours < 24) {
      return `${diffInHours} jam lalu`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} hari lalu`
    }
  }

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id)
    }
  }

  return (
    <div 
      className={`
        flex items-start space-x-3 p-4 border-b border-base-100 last:border-b-0 
        border-l-4 ${priorityConfig[notification.priority]}
        ${!notification.is_read ? 'bg-blue-50' : 'bg-white'}
        hover:bg-base-50 transition-colors cursor-pointer
      `}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-base-900' : 'text-base-700'} truncate`}>
              {notification.title}
            </h4>
            <p className="text-sm text-base-600 mt-1 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-base-500">
                {formatDate(notification.created_at)}
              </span>
              {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {notification.action_url && (
            <Link 
              href={notification.action_url}
              className="ml-2 h-8 px-2 text-xs inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
            >
              Lihat
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export function NotificationPanel({ 
  notifications, 
  loading, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="bg-white rounded-lg border border-base-200">
      <div className="px-6 py-4 border-b border-base-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-base-600" />
            <h3 className="text-lg font-semibold text-base-900">Notifikasi</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                Tandai Semua Dibaca
              </Button>
            )}
            <Link 
              href="/mitra/dashboard/notifications"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          // Loading skeleton
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : notifications.length > 0 ? (
          // Notifications list
          notifications.slice(0, 5).map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        ) : (
          // Empty state
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-base-400" />
            <h3 className="mt-2 text-sm font-medium text-base-900">Tidak ada notifikasi</h3>
            <p className="mt-1 text-sm text-base-500">
              Notifikasi terbaru akan muncul di sini
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
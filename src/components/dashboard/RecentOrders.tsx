'use client'

import React from 'react'
import Link from 'next/link'
import { Clock, Eye, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface Order {
  id: string
  customer_name: string
  service_title: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  total_amount: number
  created_at: string
  has_unread_messages: boolean
}

interface RecentOrdersProps {
  orders: Order[]
  loading?: boolean
}

const statusConfig = {
  pending: {
    label: 'Menunggu',
    color: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-400'
  },
  confirmed: {
    label: 'Dikonfirmasi',
    color: 'bg-blue-100 text-blue-800',
    dot: 'bg-blue-400'
  },
  in_progress: {
    label: 'Dikerjakan',
    color: 'bg-purple-100 text-purple-800',
    dot: 'bg-purple-400'
  },
  completed: {
    label: 'Selesai',
    color: 'bg-green-100 text-green-800',
    dot: 'bg-green-400'
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'bg-red-100 text-red-800',
    dot: 'bg-red-400'
  }
}

function OrderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-base-100 last:border-b-0">
      <div className="flex-1 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-base-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-base-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-base-200 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="h-6 bg-base-200 rounded w-20"></div>
        <div className="h-8 bg-base-200 rounded w-16"></div>
      </div>
    </div>
  )
}

function OrderItem({ order }: { order: Order }) {
  const status = statusConfig[order.status]
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-base-100 last:border-b-0 hover:bg-base-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          {/* Customer Avatar */}
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 font-semibold text-sm">
              {order.customer_name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-base-900 truncate">
                {order.customer_name}
              </h4>
              {order.has_unread_messages && (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
            <p className="text-sm text-base-600 truncate">{order.service_title}</p>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center text-xs text-base-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(order.created_at)}
              </div>
              <div className="text-sm font-semibold text-base-900">
                {formatCurrency(order.total_amount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 ml-4">
        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${status.dot}`}></div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          {order.has_unread_messages && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              title="Pesan baru"
            >
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </Button>
          )}
          
          <Link 
            href={`/mitra/dashboard/orders/${order.id}`} 
            title="Lihat detail"
            className="h-8 w-8 p-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function RecentOrders({ orders, loading }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-lg border border-base-200">
      <div className="px-6 py-4 border-b border-base-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-base-900">Pesanan Terbaru</h3>
          <Link 
            href="/mitra/dashboard/orders"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            Lihat Semua
          </Link>
        </div>
      </div>

      <div className="divide-y divide-base-100">
        {loading ? (
          // Loading skeleton
          <>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : orders.length > 0 ? (
          // Orders list
          orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))
        ) : (
          // Empty state
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-12 w-12 text-base-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-base-900">Belum ada pesanan</h3>
            <p className="mt-1 text-sm text-base-500">
              Pesanan dari pelanggan akan muncul di sini
            </p>
            <div className="mt-6">
              <Link 
                href="/mitra/dashboard/services"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              >
                Tambah Layanan
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
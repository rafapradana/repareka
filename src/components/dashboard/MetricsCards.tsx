'use client'

import React from 'react'
import { 
  ShoppingBag, 
  DollarSign, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'

export interface DashboardMetrics {
  newOrders: number
  totalRevenue: number
  averageRating: number
  completedOrders: number
  pendingOrders: number
  monthlyGrowth: number
}

interface MetricsCardsProps {
  metrics: DashboardMetrics
  loading?: boolean
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red'
  trend?: {
    value: number
    isPositive: boolean
  }
  loading?: boolean
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    icon: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    icon: 'text-green-600'
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    icon: 'text-yellow-600'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    icon: 'text-purple-600'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    icon: 'text-orange-600'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    icon: 'text-red-600'
  }
}

function MetricCard({ title, value, icon: Icon, color, trend, loading }: MetricCardProps) {
  const colors = colorClasses[color]

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-base-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
              <div className="w-6 h-6 bg-base-300 rounded"></div>
            </div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-base-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-base-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-base-200 p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <p className="text-sm font-medium text-base-500 truncate">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-base-900">{value}</p>
            {trend && (
              <div className={`flex items-center text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp 
                  className={`w-4 h-4 mr-1 ${
                    trend.isPositive ? '' : 'rotate-180'
                  }`} 
                />
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MetricsCards({ metrics, loading }: MetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Pesanan Baru"
        value={metrics.newOrders}
        icon={ShoppingBag}
        color="blue"
        loading={loading}
      />
      
      <MetricCard
        title="Total Pendapatan"
        value={formatCurrency(metrics.totalRevenue)}
        icon={DollarSign}
        color="green"
        trend={{
          value: metrics.monthlyGrowth,
          isPositive: metrics.monthlyGrowth >= 0
        }}
        loading={loading}
      />
      
      <MetricCard
        title="Rating Rata-rata"
        value={formatRating(metrics.averageRating)}
        icon={Star}
        color="yellow"
        loading={loading}
      />
      
      <MetricCard
        title="Pesanan Selesai"
        value={metrics.completedOrders}
        icon={CheckCircle}
        color="green"
        loading={loading}
      />
      
      <MetricCard
        title="Pesanan Pending"
        value={metrics.pendingOrders}
        icon={Clock}
        color="orange"
        loading={loading}
      />
      
      <MetricCard
        title="Pertumbuhan Bulanan"
        value={`${metrics.monthlyGrowth >= 0 ? '+' : ''}${metrics.monthlyGrowth}%`}
        icon={TrendingUp}
        color={metrics.monthlyGrowth >= 0 ? 'green' : 'red'}
        loading={loading}
      />
    </div>
  )
}
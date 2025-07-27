'use client'

import { lazy, Suspense } from 'react'
import { ComponentSkeleton, ServiceCardSkeleton, GridSkeleton } from '@/components/ui/LazyComponent'

/**
 * Lazy loaded components untuk code splitting
 * Menggunakan dynamic imports untuk mengurangi bundle size
 */

// Auth Components
export const LazyCustomerAuthForm = lazy(() => 
  import('@/components/auth/CustomerAuthForm').then(module => ({
    default: module.CustomerAuthForm
  }))
)

export const LazyMitraAuthForm = lazy(() => 
  import('@/components/auth/MitraAuthForm').then(module => ({
    default: module.MitraAuthForm
  }))
)

export const LazyLoginPromptModal = lazy(() => 
  import('@/components/auth/LoginPromptModal').then(module => ({
    default: module.LoginPromptModal
  }))
)

// Dashboard Components
export const LazyMitraDashboard = lazy(() => 
  import('@/components/dashboard/MitraDashboardLayout').then(module => ({
    default: module.MitraDashboardLayout
  }))
)

export const LazyMetricsCards = lazy(() => 
  import('@/components/dashboard/MetricsCards').then(module => ({
    default: module.MetricsCards
  }))
)

export const LazyRecentOrders = lazy(() => 
  import('@/components/dashboard/RecentOrders').then(module => ({
    default: module.RecentOrders
  }))
)

// Service Components
export const LazyServiceGrid = lazy(() => 
  import('@/components/services/ServiceGrid').then(module => ({
    default: module.ServiceGrid
  }))
)

export const LazySearchAndFilter = lazy(() => 
  import('@/components/services/SearchAndFilter').then(module => ({
    default: module.SearchAndFilter
  }))
)

export const LazyCategoryNavigation = lazy(() => 
  import('@/components/services/CategoryNavigation').then(module => ({
    default: module.CategoryNavigation
  }))
)

/**
 * Wrapper components dengan Suspense dan fallback yang sesuai
 */

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyAuthWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <ComponentSkeleton lines={4} className="max-w-md mx-auto" />}>
      {children}
    </Suspense>
  )
}

export function LazyDashboardWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <ComponentSkeleton lines={6} className="space-y-4" />}>
      {children}
    </Suspense>
  )
}

export function LazyServiceWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <GridSkeleton count={6} />}>
      {children}
    </Suspense>
  )
}

/**
 * Pre-configured lazy components dengan fallback yang sesuai
 */

export function LazyCustomerAuth(props: any) {
  return (
    <LazyAuthWrapper>
      <LazyCustomerAuthForm {...props} />
    </LazyAuthWrapper>
  )
}

export function LazyMitraAuth(props: any) {
  return (
    <LazyAuthWrapper>
      <LazyMitraAuthForm {...props} />
    </LazyAuthWrapper>
  )
}

export function LazyDashboard(props: any) {
  return (
    <LazyDashboardWrapper>
      <LazyMitraDashboard {...props} />
    </LazyDashboardWrapper>
  )
}

export function LazyServices(props: any) {
  return (
    <LazyServiceWrapper>
      <LazyServiceGrid {...props} />
    </LazyServiceWrapper>
  )
}

export function LazyFilters(props: any) {
  return (
    <Suspense fallback={<ComponentSkeleton lines={3} />}>
      <LazySearchAndFilter {...props} />
    </Suspense>
  )
}

export function LazyCategories(props: any) {
  return (
    <Suspense fallback={<ComponentSkeleton lines={2} />}>
      <LazyCategoryNavigation {...props} />
    </Suspense>
  )
}

/**
 * Dynamic import utilities untuk runtime loading
 */

export const dynamicImports = {
  // Auth modules
  customerAuth: () => import('@/components/auth/CustomerAuthForm'),
  mitraAuth: () => import('@/components/auth/MitraAuthForm'),
  authGuard: () => import('@/components/auth/AuthGuard'),
  
  // Dashboard modules
  mitraDashboard: () => import('@/components/dashboard/MitraDashboardLayout'),
  metricsCards: () => import('@/components/dashboard/MetricsCards'),
  recentOrders: () => import('@/components/dashboard/RecentOrders'),
  
  // Service modules
  serviceGrid: () => import('@/components/services/ServiceGrid'),
  searchFilter: () => import('@/components/services/SearchAndFilter'),
  categoryNav: () => import('@/components/services/CategoryNavigation'),
  
  // UI modules
  bottomSheet: () => import('@/components/ui/bottom-sheet'),
  locationSelect: () => import('@/components/ui/location-select'),
}

/**
 * Preload utility untuk critical components
 */
export function preloadCriticalComponents() {
  // Preload komponen yang kemungkinan besar akan digunakan
  const criticalComponents = [
    dynamicImports.serviceGrid,
    dynamicImports.searchFilter,
    dynamicImports.categoryNav
  ]

  // Preload dengan delay untuk tidak mengganggu initial load
  setTimeout(() => {
    criticalComponents.forEach(importFn => {
      importFn().catch(error => {
        console.warn('Failed to preload component:', error)
      })
    })
  }, 2000)
}

/**
 * Route-based code splitting (hanya untuk halaman yang sudah ada)
 */
export const LazyPages = {
  // Homepage components (akan dibuat nanti)
  // Homepage: lazy(() => import('@/app/page')),
  
  // Auth pages (akan dibuat nanti)
  // CustomerLogin: lazy(() => import('@/app/auth/customer/login/page')),
  // CustomerRegister: lazy(() => import('@/app/auth/customer/register/page')),
  // MitraLogin: lazy(() => import('@/app/auth/mitra/login/page')),
  // MitraRegister: lazy(() => import('@/app/auth/mitra/register/page')),
  
  // Dashboard pages (akan dibuat nanti)
  // MitraDashboard: lazy(() => import('@/app/mitra/dashboard/page')),
  // MitraOrders: lazy(() => import('@/app/mitra/orders/page')),
  // MitraProfile: lazy(() => import('@/app/mitra/profile/page')),
  
  // Service pages (akan dibuat nanti)
  // ServiceDetail: lazy(() => import('@/app/services/[id]/page')),
  // ServiceCategory: lazy(() => import('@/app/categories/[slug]/page')),
}

/**
 * Bundle analysis helper (development only)
 */
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return

  const getComponentSize = async (importFn: () => Promise<any>) => {
    const start = performance.now()
    try {
      await importFn()
      const end = performance.now()
      return end - start
    } catch (error) {
      console.error('Failed to load component for analysis:', error)
      return null
    }
  }

  console.group('📦 Bundle Analysis')
  
  Object.entries(dynamicImports).forEach(async ([name, importFn]) => {
    const loadTime = await getComponentSize(importFn)
    if (loadTime) {
      console.log(`${name}: ${loadTime.toFixed(2)}ms`)
    }
  })
  
  console.groupEnd()
}
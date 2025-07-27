'use client'

import { useState, useEffect } from 'react'
import { GuestModeWrapper } from '@/components/layout/GuestModeWrapper'
import { ServiceCardGuest } from '@/components/services/ServiceCardGuest'
import { GuestEmptyState } from '@/components/ui/GuestEmptyState'
import { LoginPromptModal } from '@/components/auth/LoginPromptModal'
import { useAuth } from '@/hooks/useAuth'
import { useGuestAccess } from '@/hooks/useGuestAccess'
import { checkAuthRedirect } from '@/lib/auth/redirect'
import { Search, Filter } from 'lucide-react'

interface HomepageGuestProps {
  services: Array<{
    id: string
    title: string
    description: string
    images: string[]
    priceMin: number
    priceMax: number
    rating: number
    totalReviews: number
    mitra: {
      businessName: string
      city: string
      province: string
    }
  }>
  loading?: boolean
  onLoadMore: () => void
  hasMore: boolean
}

/**
 * Homepage component dengan guest mode support
 * Requirement 6.1 - Guest dapat browse homepage tanpa batasan
 * Requirement 6.6 - Setup redirect logic dengan return URL setelah authentication
 */
export function HomepageGuest({ services, loading, onLoadMore, hasMore }: HomepageGuestProps) {
  const { isAuthenticated } = useAuth()
  const { showLoginPrompt, promptConfig, closeLoginPrompt } = useGuestAccess()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalConfig, setAuthModalConfig] = useState({
    title: 'Login Diperlukan',
    message: 'Silakan login untuk melanjutkan',
    preferredUserType: 'customer' as 'customer' | 'mitra'
  })

  // Check untuk auth redirect dari URL parameters
  useEffect(() => {
    const { shouldShowLogin } = checkAuthRedirect()
    
    if (shouldShowLogin && !isAuthenticated) {
      setAuthModalConfig({
        title: 'Login untuk Melanjutkan',
        message: 'Silakan login untuk mengakses fitur yang Anda inginkan.',
        preferredUserType: 'customer'
      })
      setShowAuthModal(true)
    }
  }, [isAuthenticated])

  const handleViewProfile = (serviceId: string) => {
    // Guest dapat view profile dalam read-only mode (Requirement 6.2)
    console.log('View profile for service:', serviceId)
    // Navigate to service profile page
    window.location.href = `/services/${serviceId}`
  }

  const handleAuthPrompt = (userType: 'customer' | 'mitra') => {
    const currentUrl = window.location.pathname + window.location.search
    
    if (userType === 'mitra') {
      window.location.href = `/mitra?redirect=${encodeURIComponent(currentUrl)}`
    } else {
      window.location.href = `/?login=true&redirect=${encodeURIComponent(currentUrl)}`
    }
  }

  return (
    <GuestModeWrapper showGuestBanner={!isAuthenticated}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-800 dark:text-base-200 mb-2">
            Temukan Jasa Reparasi Terpercaya
          </h1>
          <p className="text-base-600 dark:text-base-400">
            Perbaiki, jangan buang! Temukan layanan reparasi berkualitas di sekitar Anda.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari layanan reparasi..."
              className="w-full pl-10 pr-4 py-3 border border-base-200 dark:border-base-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-base-900 text-base-800 dark:text-base-200"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-3 border border-base-200 dark:border-base-700 rounded-lg hover:bg-base-50 dark:hover:bg-base-800 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCardGuest
                  key={service.id}
                  service={service}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <GuestEmptyState
            title="Belum Ada Layanan"
            description="Saat ini belum ada layanan reparasi yang tersedia. Silakan coba lagi nanti atau daftar sebagai mitra untuk menawarkan layanan Anda."
            authPromptText="Bergabunglah dengan Repareka untuk mengakses lebih banyak fitur!"
            onAuthClick={handleAuthPrompt}
          />
        )}

        {/* Loading State */}
        {loading && services.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-base-900 rounded-lg shadow-sm border border-base-200 dark:border-base-700 overflow-hidden">
                <div className="w-full h-48 bg-base-200 dark:bg-base-800 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-base-200 dark:bg-base-800 rounded animate-pulse" />
                  <div className="h-3 bg-base-200 dark:bg-base-800 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-base-200 dark:bg-base-800 rounded animate-pulse w-1/2" />
                  <div className="h-8 bg-base-200 dark:bg-base-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auth Modals */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        title={promptConfig.title}
        message={promptConfig.message}
        returnUrl={promptConfig.returnUrl}
        preferredUserType={promptConfig.preferredUserType}
      />

      <LoginPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authModalConfig.title}
        message={authModalConfig.message}
        preferredUserType={authModalConfig.preferredUserType}
      />
    </GuestModeWrapper>
  )
}
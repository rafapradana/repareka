'use client'


import { Star, MapPin, Heart, MessageCircle, Calendar } from 'lucide-react'
import { LoginPromptModal } from '@/components/auth/LoginPromptModal'
import { useGuestAccess } from '@/hooks/useGuestAccess'

interface ServiceCardGuestProps {
  service: {
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
  }
  onViewProfile: (serviceId: string) => void
}

/**
 * Service card dengan guest access restrictions
 * Requirement 6.1, 6.3, 6.4, 6.5 - Guest dapat browse services tapi dengan akses terbatas
 */
export function ServiceCardGuest({ service, onViewProfile }: ServiceCardGuestProps) {
  const { 
    isAuthenticated,
    showLoginPrompt, 
    promptConfig, 
    requireAuthForBooking,
    requireAuthForChat,
    requireAuthForFavorite,
    closeLoginPrompt 
  } = useGuestAccess()

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!requireAuthForBooking()) return
    // Jika authenticated, lanjutkan ke booking
    console.log('Proceed to booking for service:', service.id)
  }

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!requireAuthForChat()) return
    // Jika authenticated, lanjutkan ke chat
    console.log('Proceed to chat for service:', service.id)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!requireAuthForFavorite()) return
    // Jika authenticated, lanjutkan ke favorite
    console.log('Add to favorite:', service.id)
  }

  const formatPrice = (min: number, max: number) => {
    if (min === max) {
      return `Rp ${min.toLocaleString('id-ID')}`
    }
    return `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`
  }

  return (
    <>
      <div 
        className="bg-white dark:bg-base-900 rounded-lg shadow-sm border border-base-200 dark:border-base-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onViewProfile(service.id)}
      >
        {/* Image */}
        <div className="relative">
          {service.images.length > 0 ? (
            <img
              src={service.images[0]}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-base-100 dark:bg-base-800 flex items-center justify-center">
              <span className="text-base-400 dark:text-base-600">No Image</span>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-base-900/90 rounded-full hover:bg-white dark:hover:bg-base-900 transition-colors"
          >
            <Heart className="w-4 h-4 text-base-600 dark:text-base-400" />
          </button>

          {/* Guest Indicator */}
          {!isAuthenticated && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500/90 text-white text-xs rounded-full">
              Guest Mode
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Description */}
          <h3 className="font-semibold text-base-800 dark:text-base-200 mb-2 line-clamp-1">
            {service.title}
          </h3>
          
          <p className="text-sm text-base-600 dark:text-base-400 mb-3 line-clamp-2">
            {service.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(service.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-base-300 dark:text-base-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-base-600 dark:text-base-400">
              {service.rating.toFixed(1)} ({service.totalReviews})
            </span>
          </div>

          {/* Mitra Info */}
          <div className="flex items-center text-base-600 dark:text-base-400 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {service.mitra.businessName} • {service.mitra.city}
            </span>
          </div>

          {/* Price */}
          <div className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">
            {formatPrice(service.priceMin, service.priceMax)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleBookingClick}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Book
            </button>
            
            <button
              onClick={handleChatClick}
              className="px-3 py-2 border border-base-200 dark:border-base-700 text-base-700 dark:text-base-300 rounded-lg hover:bg-base-50 dark:hover:bg-base-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Guest Notice */}
          {!isAuthenticated && (
            <div className="mt-3 text-xs text-base-500 dark:text-base-400 text-center p-2 bg-base-50 dark:bg-base-800 rounded">
              Login untuk booking dan chat
            </div>
          )}
        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        title={promptConfig.title}
        message={promptConfig.message}
        returnUrl={promptConfig.returnUrl}
        preferredUserType={promptConfig.preferredUserType}
      />
    </>
  )
}
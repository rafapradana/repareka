'use client'


import { Star, MapPin, Phone, Mail, MessageCircle, Heart, Calendar } from 'lucide-react'
import { LoginPromptModal } from '@/components/auth/LoginPromptModal'
import { useGuestAccess } from '@/hooks/useGuestAccess'

interface ServiceProfileReadOnlyProps {
  mitra: {
    id: string
    businessName: string
    phone: string
    email: string
    address: string
    city: string
    province: string
    rating: number
    totalReviews: number
    isActive: boolean
  }
  services: Array<{
    id: string
    title: string
    description: string
    priceMin: number
    priceMax: number
    images: string[]
    rating: number
    totalReviews: number
  }>
}

/**
 * Komponen untuk menampilkan profil UMKM dalam mode read-only untuk guest users
 * Requirement 6.2 - Guest dapat melihat profil UMKM dalam mode read-only
 */
export function ServiceProfileReadOnly({ mitra, services }: ServiceProfileReadOnlyProps) {
  const { 
    isAuthenticated, 
    showLoginPrompt, 
    promptConfig, 
    requireAuthForBooking,
    requireAuthForChat,
    requireAuthForFavorite,
    closeLoginPrompt 
  } = useGuestAccess()

  const handleBookingClick = () => {
    if (!requireAuthForBooking()) return
    // Jika authenticated, lanjutkan ke booking
    console.log('Proceed to booking')
  }

  const handleChatClick = () => {
    if (!requireAuthForChat()) return
    // Jika authenticated, lanjutkan ke chat
    console.log('Proceed to chat')
  }

  const handleFavoriteClick = () => {
    if (!requireAuthForFavorite()) return
    // Jika authenticated, lanjutkan ke favorite
    console.log('Add to favorite')
  }

  const formatPrice = (min: number, max: number) => {
    if (min === max) {
      return `Rp ${min.toLocaleString('id-ID')}`
    }
    return `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header Profil */}
      <div className="bg-white dark:bg-base-900 rounded-lg shadow-sm border border-base-200 dark:border-base-700 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Info Bisnis */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-base-800 dark:text-base-200 mb-2">
                  {mitra.businessName}
                </h1>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(mitra.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-base-300 dark:text-base-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-base-600 dark:text-base-400">
                    {mitra.rating.toFixed(1)} ({mitra.totalReviews} ulasan)
                  </span>
                </div>
                <div className="flex items-center text-base-600 dark:text-base-400 mb-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{mitra.city}, {mitra.province}</span>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                mitra.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {mitra.isActive ? 'Aktif' : 'Tidak Aktif'}
              </div>
            </div>

            {/* Kontak Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-base-600 dark:text-base-400">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">{mitra.phone}</span>
              </div>
              <div className="flex items-center text-base-600 dark:text-base-400">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">{mitra.email}</span>
              </div>
              <div className="flex items-start text-base-600 dark:text-base-400">
                <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                <span className="text-sm">{mitra.address}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <button
              onClick={handleChatClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Kirim Pesan
            </button>
            
            <button
              onClick={handleFavoriteClick}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-base-200 dark:border-base-700 text-base-700 dark:text-base-300 rounded-lg hover:bg-base-50 dark:hover:bg-base-800 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Simpan
            </button>

            {!isAuthenticated && (
              <div className="text-xs text-base-500 dark:text-base-400 text-center mt-2 p-2 bg-base-50 dark:bg-base-800 rounded">
                💡 Login untuk mengakses fitur lengkap
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Layanan */}
      <div className="bg-white dark:bg-base-900 rounded-lg shadow-sm border border-base-200 dark:border-base-700 p-6">
        <h2 className="text-xl font-semibold text-base-800 dark:text-base-200 mb-4">
          Layanan Tersedia
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="border border-base-200 dark:border-base-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Service Images */}
              {service.images.length > 0 && (
                <div className="mb-3">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <h3 className="font-semibold text-base-800 dark:text-base-200 mb-2">
                {service.title}
              </h3>
              
              <p className="text-sm text-base-600 dark:text-base-400 mb-3 line-clamp-2">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(service.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-base-300 dark:text-base-600'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-base-600 dark:text-base-400 ml-1">
                    ({service.totalReviews})
                  </span>
                </div>
                
                <div className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {formatPrice(service.priceMin, service.priceMax)}
                </div>
              </div>
              
              <button
                onClick={handleBookingClick}
                className="w-full px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Sekarang
              </button>
            </div>
          ))}
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
    </div>
  )
}
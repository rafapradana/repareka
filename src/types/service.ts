// Types untuk Service dan data terkait
export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  is_active: boolean
}

export interface Mitra {
  id: string
  email: string
  business_name: string
  phone: string
  address: string
  province: string
  city: string
  business_type: 'individual' | 'small_business' | 'company'
  verification_status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  mitra_id: string
  category_id: string
  title: string
  description: string
  price_min?: number
  price_max?: number
  images: string[]
  rating: number
  total_reviews: number
  is_active: boolean
  created_at: string
  updated_at: string
  mitra: Mitra
  category: Category
}

export interface FilterState {
  category?: string
  province?: string
  city?: string
  price_min?: number
  price_max?: number
  rating?: number
  search?: string
}

export interface ServiceGridProps {
  services: Service[]
  loading?: boolean
  onLoadMore: () => void
  hasMore: boolean
}

export interface ServiceCardProps {
  service: Service
  onClick?: (service: Service) => void
}
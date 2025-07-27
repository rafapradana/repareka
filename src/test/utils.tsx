import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock data untuk testing
export const mockUser = {
  id: '123',
  email: 'test@example.com',
  fullName: 'Test User',
  province: 'DKI Jakarta',
  city: 'Jakarta Selatan',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

export const mockMitra = {
  id: '456',
  email: 'mitra@example.com',
  businessName: 'Test Mitra',
  phone: '081234567890',
  address: 'Jl. Test No. 123',
  province: 'DKI Jakarta',
  city: 'Jakarta Selatan',
  businessType: 'individual' as const,
  verificationStatus: 'approved' as const,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

export const mockService = {
  id: '789',
  mitraId: '456',
  categoryId: 'cat-1',
  title: 'Reparasi Sepatu',
  description: 'Layanan reparasi sepatu berkualitas',
  priceMin: 50000,
  priceMax: 150000,
  images: ['image1.jpg'],
  rating: 4.5,
  totalReviews: 10,
  isActive: true,
  mitra: mockMitra,
  category: {
    id: 'cat-1',
    name: 'Sepatu',
    slug: 'sepatu',
    icon: 'shoe',
    description: 'Kategori sepatu',
    isActive: true
  }
}

// Custom render dengan providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
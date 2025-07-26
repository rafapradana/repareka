import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk sementara sampai MCP integration selesai
const mockServices = [
  {
    id: '6ff85e46-624a-4720-b1b5-3ac00fe097b9',
    mitra_id: '550e8400-e29b-41d4-a716-446655440001',
    category_id: 'cb7c5efd-83d2-458d-ad44-4768ee1e2b73',
    title: 'Jahit Baju Rusak',
    description: 'Layanan jahit untuk baju yang robek, kancing lepas, atau perlu penyesuaian ukuran',
    price_min: 15000,
    price_max: 50000,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300'],
    rating: 4.8,
    total_reviews: 127,
    is_active: true,
    created_at: '2025-07-26T05:06:50.147432Z',
    updated_at: '2025-07-26T05:06:50.147432Z',
    mitra: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      business_name: 'Jahit Berkah',
      city: 'Yogyakarta',
      province: 'DI Yogyakarta',
      email: 'jahit@berkah.com',
      phone: '081234567890',
      address: 'Jl. Malioboro No. 123',
      business_type: 'individual' as const,
      verification_status: 'approved' as const,
      is_active: true,
      created_at: '2025-07-26T05:06:50.147432Z',
      updated_at: '2025-07-26T05:06:50.147432Z'
    },
    category: {
      id: 'cb7c5efd-83d2-458d-ad44-4768ee1e2b73',
      name: 'Pakaian',
      slug: 'pakaian',
      icon: '👕',
      description: 'Layanan reparasi pakaian, jahit, dan sulam',
      is_active: true
    }
  },
  {
    id: 'bce14fd7-4d2d-40f1-9545-0ca505f1bb15',
    mitra_id: '550e8400-e29b-41d4-a716-446655440001',
    category_id: 'cb7c5efd-83d2-458d-ad44-4768ee1e2b73',
    title: 'Sulam Nama dan Logo',
    description: 'Layanan sulam nama, logo, atau desain custom pada pakaian',
    price_min: 25000,
    price_max: 75000,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300'],
    rating: 4.9,
    total_reviews: 89,
    is_active: true,
    created_at: '2025-07-26T05:06:50.147432Z',
    updated_at: '2025-07-26T05:06:50.147432Z',
    mitra: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      business_name: 'Jahit Berkah',
      city: 'Yogyakarta',
      province: 'DI Yogyakarta',
      email: 'jahit@berkah.com',
      phone: '081234567890',
      address: 'Jl. Malioboro No. 123',
      business_type: 'individual' as const,
      verification_status: 'approved' as const,
      is_active: true,
      created_at: '2025-07-26T05:06:50.147432Z',
      updated_at: '2025-07-26T05:06:50.147432Z'
    },
    category: {
      id: 'cb7c5efd-83d2-458d-ad44-4768ee1e2b73',
      name: 'Pakaian',
      slug: 'pakaian',
      icon: '👕',
      description: 'Layanan reparasi pakaian, jahit, dan sulam',
      is_active: true
    }
  },
  {
    id: '76898c0a-772e-4411-bdb9-e8a38730247a',
    mitra_id: '550e8400-e29b-41d4-a716-446655440002',
    category_id: 'dc675fec-8b5b-4998-8c9c-34f2a90e3b09',
    title: 'Ganti Sol Sepatu',
    description: 'Layanan penggantian sol sepatu dengan berbagai jenis bahan berkualitas',
    price_min: 35000,
    price_max: 85000,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300'],
    rating: 4.7,
    total_reviews: 156,
    is_active: true,
    created_at: '2025-07-26T05:06:50.147432Z',
    updated_at: '2025-07-26T05:06:50.147432Z',
    mitra: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      business_name: 'Sepatu Jaya Service',
      city: 'Yogyakarta',
      province: 'DI Yogyakarta',
      email: 'sepatu@jaya.com',
      phone: '081234567891',
      address: 'Jl. Malioboro No. 124',
      business_type: 'individual' as const,
      verification_status: 'approved' as const,
      is_active: true,
      created_at: '2025-07-26T05:06:50.147432Z',
      updated_at: '2025-07-26T05:06:50.147432Z'
    },
    category: {
      id: 'dc675fec-8b5b-4998-8c9c-34f2a90e3b09',
      name: 'Sepatu',
      slug: 'sepatu',
      icon: '👞',
      description: 'Layanan reparasi sepatu, sol, dan aksesoris sepatu',
      is_active: true
    }
  },
  {
    id: '29672cac-a5ed-4171-ab4f-0ff4797e7aea',
    mitra_id: '550e8400-e29b-41d4-a716-446655440002',
    category_id: 'dc675fec-8b5b-4998-8c9c-34f2a90e3b09',
    title: 'Reparasi Sepatu Kulit',
    description: 'Layanan reparasi sepatu kulit, termasuk perbaikan jahitan dan pewarnaan ulang',
    price_min: 50000,
    price_max: 120000,
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300'],
    rating: 4.6,
    total_reviews: 203,
    is_active: true,
    created_at: '2025-07-26T05:06:50.147432Z',
    updated_at: '2025-07-26T05:06:50.147432Z',
    mitra: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      business_name: 'Sepatu Jaya Service',
      city: 'Yogyakarta',
      province: 'DI Yogyakarta',
      email: 'sepatu@jaya.com',
      phone: '081234567891',
      address: 'Jl. Malioboro No. 124',
      business_type: 'individual' as const,
      verification_status: 'approved' as const,
      is_active: true,
      created_at: '2025-07-26T05:06:50.147432Z',
      updated_at: '2025-07-26T05:06:50.147432Z'
    },
    category: {
      id: 'dc675fec-8b5b-4998-8c9c-34f2a90e3b09',
      name: 'Sepatu',
      slug: 'sepatu',
      icon: '👞',
      description: 'Layanan reparasi sepatu, sol, dan aksesoris sepatu',
      is_active: true
    }
  },
  {
    id: '28bbe4ea-5a06-4055-980c-963426e31bda',
    mitra_id: '550e8400-e29b-41d4-a716-446655440003',
    category_id: '763ec3b1-308d-4418-ab02-66f0319a7d1d',
    title: 'Service HP Android/iPhone',
    description: 'Layanan reparasi smartphone dengan teknisi berpengalaman dan spare part original',
    price_min: 75000,
    price_max: 500000,
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300'],
    rating: 4.5,
    total_reviews: 342,
    is_active: true,
    created_at: '2025-07-26T05:06:50.147432Z',
    updated_at: '2025-07-26T05:06:50.147432Z',
    mitra: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      business_name: 'Elektronik Mandiri',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      email: 'elektronik@mandiri.com',
      phone: '081234567892',
      address: 'Jl. Sudirman No. 125',
      business_type: 'small_business' as const,
      verification_status: 'approved' as const,
      is_active: true,
      created_at: '2025-07-26T05:06:50.147432Z',
      updated_at: '2025-07-26T05:06:50.147432Z'
    },
    category: {
      id: '763ec3b1-308d-4418-ab02-66f0319a7d1d',
      name: 'Elektronik',
      slug: 'elektronik',
      icon: '📱',
      description: 'Layanan reparasi perangkat elektronik dan gadget',
      is_active: true
    }
  },
  {
    id: 'b5ecd70c-1e21-430c-9a40-5ec8f5444883',
    mitra_id: '550e8400-e29b-41d4-a716-446655440003',
    category_id: '763ec3b1-308d-4418-ab02-66f0319a7d1d',
    title: 'Reparasi Laptop/PC',
    description: 'Layanan reparasi laptop dan PC, diagnosa gratis, garansi service',
    price_min: 100000,
    price_max: 800000,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300'],
    rating: 4.4,
    total_reviews: 178,
    is_active: true,
    created_at: '2025-07-26T05:06:50.147432Z',
    updated_at: '2025-07-26T05:06:50.147432Z',
    mitra: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      business_name: 'Elektronik Mandiri',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      email: 'elektronik@mandiri.com',
      phone: '081234567892',
      address: 'Jl. Sudirman No. 125',
      business_type: 'small_business' as const,
      verification_status: 'approved' as const,
      is_active: true,
      created_at: '2025-07-26T05:06:50.147432Z',
      updated_at: '2025-07-26T05:06:50.147432Z'
    },
    category: {
      id: '763ec3b1-308d-4418-ab02-66f0319a7d1d',
      name: 'Elektronik',
      slug: 'elektronik',
      icon: '📱',
      description: 'Layanan reparasi perangkat elektronik dan gadget',
      is_active: true
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const province = searchParams.get('province') || ''
    const city = searchParams.get('city') || ''
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : null
    const priceMin = searchParams.get('price_min') ? parseInt(searchParams.get('price_min')!) : null
    const priceMax = searchParams.get('price_max') ? parseInt(searchParams.get('price_max')!) : null

    // Filter mock data berdasarkan parameter
    let filteredServices = [...mockServices]

    // Apply search filter
    if (search) {
      filteredServices = filteredServices.filter(service =>
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        service.mitra.business_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply category filter
    if (category) {
      filteredServices = filteredServices.filter(service => service.category_id === category)
    }

    // Apply location filters
    if (province) {
      filteredServices = filteredServices.filter(service => service.mitra.province === province)
    }
    if (city) {
      filteredServices = filteredServices.filter(service => service.mitra.city === city)
    }

    // Apply rating filter
    if (rating) {
      filteredServices = filteredServices.filter(service => service.rating >= rating)
    }

    // Apply price filters
    if (priceMin) {
      filteredServices = filteredServices.filter(service => 
        service.price_min && service.price_min >= priceMin
      )
    }
    if (priceMax) {
      filteredServices = filteredServices.filter(service => 
        service.price_max && service.price_max <= priceMax
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedServices = filteredServices.slice(startIndex, endIndex)
    const hasMore = endIndex < filteredServices.length

    return NextResponse.json({
      services: paginatedServices,
      hasMore,
      total: filteredServices.length,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
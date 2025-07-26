import { NextResponse } from 'next/server'

// Mock data yang sesuai dengan data Supabase
const mockCategories = [
  {
    id: 'cb7c5efd-83d2-458d-ad44-4768ee1e2b73',
    name: 'Pakaian',
    slug: 'pakaian',
    icon: '👕',
    description: 'Layanan reparasi pakaian, jahit, dan sulam',
    is_active: true
  },
  {
    id: 'dc675fec-8b5b-4998-8c9c-34f2a90e3b09',
    name: 'Sepatu',
    slug: 'sepatu',
    icon: '👞',
    description: 'Layanan reparasi sepatu, sol, dan aksesoris sepatu',
    is_active: true
  },
  {
    id: '763ec3b1-308d-4418-ab02-66f0319a7d1d',
    name: 'Elektronik',
    slug: 'elektronik',
    icon: '📱',
    description: 'Layanan reparasi perangkat elektronik dan gadget',
    is_active: true
  },
  {
    id: 'e998e954-63db-4755-983e-2c6b0c14633c',
    name: 'Furniture',
    slug: 'furniture',
    icon: '🪑',
    description: 'Layanan reparasi furniture dan perabotan rumah',
    is_active: true
  },
  {
    id: '368bdd0e-a6f2-449f-8efc-68b0e0107614',
    name: 'Jam/Aksesoris',
    slug: 'jam-aksesoris',
    icon: '⌚',
    description: 'Layanan reparasi jam tangan dan aksesoris fashion',
    is_active: true
  },
  {
    id: 'b57b8bbb-446c-4769-ab71-4f83634351e0',
    name: 'Tas',
    slug: 'tas',
    icon: '👜',
    description: 'Layanan reparasi tas, koper, dan dompet',
    is_active: true
  },
  {
    id: 'c6bdc2da-d507-462f-8766-301c0dcbc59e',
    name: 'Lainnya',
    slug: 'lainnya',
    icon: '🔧',
    description: 'Layanan reparasi lainnya yang tidak termasuk kategori di atas',
    is_active: true
  }
]

export async function GET() {
  try {
    // Untuk development, kita akan menggunakan mock data
    // Nanti akan diganti dengan query Supabase yang sebenarnya
    const activeCategories = mockCategories.filter(category => category.is_active)

    return NextResponse.json(activeCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
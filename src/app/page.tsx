import { MainLayout } from '@/components/layout'
import { Star, MapPin, Clock, Shield } from 'lucide-react'

export default function Home() {
  const categories = [
    { name: 'Pakaian', icon: '👕', count: '2.3k+' },
    { name: 'Sepatu', icon: '👟', count: '1.8k+' },
    { name: 'Elektronik', icon: '📱', count: '3.1k+' },
    { name: 'Furniture', icon: '🪑', count: '950+' },
    { name: 'Jam/Aksesoris', icon: '⌚', count: '1.2k+' },
    { name: 'Tas', icon: '👜', count: '890+' },
    { name: 'Lainnya', icon: '🔧', count: '500+' },
  ]

  const services = [
    {
      id: 1,
      title: 'Reparasi Jahit Pakaian Robek',
      provider: 'Jahit Express',
      location: 'Jakarta Selatan',
      price: '25.000',
      originalPrice: '35.000',
      rating: 4.8,
      reviews: 127,
      image: '/api/placeholder/300/200',
      badge: 'Terlaris',
      responseTime: '< 2 jam'
    },
    {
      id: 2,
      title: 'Service Sepatu Kulit Premium',
      provider: 'Cobbler Pro',
      location: 'Bandung',
      price: '75.000',
      originalPrice: '100.000',
      rating: 4.9,
      reviews: 89,
      image: '/api/placeholder/300/200',
      badge: 'Rekomendasi',
      responseTime: '< 1 jam'
    },
    {
      id: 3,
      title: 'Perbaikan LCD Smartphone',
      provider: 'TechFix Indonesia',
      location: 'Surabaya',
      price: '150.000',
      originalPrice: '200.000',
      rating: 4.7,
      reviews: 234,
      image: '/api/placeholder/300/200',
      badge: 'Garansi 30 Hari',
      responseTime: '< 3 jam'
    },
    {
      id: 4,
      title: 'Restorasi Furniture Kayu Antik',
      provider: 'Wood Master',
      location: 'Yogyakarta',
      price: '300.000',
      originalPrice: '450.000',
      rating: 4.9,
      reviews: 56,
      image: '/api/placeholder/300/200',
      badge: 'Spesialis',
      responseTime: '< 6 jam'
    },
    {
      id: 5,
      title: 'Service Jam Tangan Mewah',
      provider: 'Time Repair',
      location: 'Jakarta Pusat',
      price: '200.000',
      originalPrice: '300.000',
      rating: 4.8,
      reviews: 78,
      image: '/api/placeholder/300/200',
      badge: 'Bersertifikat',
      responseTime: '< 4 jam'
    },
    {
      id: 6,
      title: 'Reparasi Tas Branded',
      provider: 'Bag Clinic',
      location: 'Medan',
      price: '125.000',
      originalPrice: '175.000',
      rating: 4.6,
      reviews: 92,
      image: '/api/placeholder/300/200',
      badge: 'Terpercaya',
      responseTime: '< 5 jam'
    }
  ]

  return (
    <MainLayout>
      <div className="bg-background">
        {/* Categories Section */}
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Kategori</h2>
              <button className="text-primary text-sm hover:underline">Lihat Semua</button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.name}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium text-center text-foreground mb-1">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Promo Banner */}
          <section className="mb-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    🎉 Promo Hari Ini - Diskon hingga 30%!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Dapatkan layanan reparasi terbaik dengan harga spesial. Berlaku sampai 31 Januari 2025.
                  </p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Lihat Promo
                </button>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Layanan Terpopuler</h2>
              <div className="flex items-center space-x-4">
                <select className="text-sm border border-border rounded-lg px-3 py-2 bg-background">
                  <option>Urutkan: Terpopuler</option>
                  <option>Harga Terendah</option>
                  <option>Harga Tertinggi</option>
                  <option>Rating Tertinggi</option>
                  <option>Terdekat</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  {/* Service Image */}
                  <div className="relative h-48 bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {service.badge && (
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                        {service.badge}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{service.responseTime}</span>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-foreground">{service.provider}</span>
                      <Shield className="h-3 w-3 text-primary" />
                    </div>

                    <div className="flex items-center space-x-1 mb-3">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{service.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-primary">Rp {service.price}</span>
                        {service.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            Rp {service.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{service.rating}</span>
                        <span className="text-xs text-muted-foreground">({service.reviews})</span>
                      </div>
                    </div>

                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-accent text-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/80 transition-colors">
                Muat Lebih Banyak
              </button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

'use client'

import React from 'react'
import Image from 'next/image'
import { Star, MapPin, Clock, Shield } from 'lucide-react'
import type { Service } from '@/types/service'

interface ServiceCardProps {
  service: Service
  onClick?: (service: Service) => void
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  // Format harga untuk display
  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) {
      return 'Konsultasi'
    }
    
    if (min && max && min !== max) {
      return `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`
    }
    
    if (min) {
      return `Mulai Rp ${min.toLocaleString('id-ID')}`
    }
    
    return 'Konsultasi'
  }

  // Ambil gambar pertama atau gunakan placeholder
  const imageUrl = service.images && service.images.length > 0 
    ? service.images[0] 
    : '/api/placeholder/300/200'

  return (
    <div 
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onClick?.(service)}
    >
      {/* Service Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Badge untuk rating tinggi */}
        {service.rating >= 4.5 && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
            Terpercaya
          </div>
        )}
        
        {/* Response time indicator */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>&lt; 2 jam</span>
        </div>
      </div>

      {/* Service Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        
        {/* Provider info */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-medium text-foreground">{service.mitra.business_name}</span>
          <Shield className="h-3 w-3 text-primary" />
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 mb-3">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {service.mitra.city}, {service.mitra.province}
          </span>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="font-bold text-primary text-sm">
              {formatPrice(service.price_min, service.price_max)}
            </span>
            {service.price_min && service.price_max && service.price_min !== service.price_max && (
              <span className="text-xs text-muted-foreground">
                Harga bervariasi
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{service.rating}</span>
            <span className="text-xs text-muted-foreground">({service.total_reviews})</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Pesan Sekarang
        </button>
      </div>
    </div>
  )
}
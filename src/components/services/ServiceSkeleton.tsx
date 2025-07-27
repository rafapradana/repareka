'use client'

import React from 'react'

export function ServiceSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-muted" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-muted rounded w-3/4" />
        
        {/* Provider */}
        <div className="h-4 bg-muted rounded w-1/2" />
        
        {/* Location */}
        <div className="h-3 bg-muted rounded w-2/3" />
        
        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
        
        {/* Button */}
        <div className="h-8 bg-muted rounded w-full" />
      </div>
    </div>
  )
}

export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ServiceSkeleton key={index} />
      ))}
    </div>
  )
}
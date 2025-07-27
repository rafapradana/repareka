'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Komponen dasar skeleton untuk loading state
 */
export function Skeleton({ className, children, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Skeleton untuk service card di homepage
 */
export function ServiceCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full" />
      
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Price and rating skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Location skeleton */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton untuk grid service cards
 */
export function ServiceGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton untuk form input
 */
export function FormInputSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" /> {/* Label */}
      <Skeleton className="h-10 w-full" /> {/* Input */}
    </div>
  );
}

/**
 * Skeleton untuk form login/register
 */
export function AuthFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <Skeleton className="h-6 w-32 mx-auto" /> {/* Title */}
        <Skeleton className="h-4 w-48 mx-auto" /> {/* Subtitle */}
      </div>
      
      <div className="space-y-4">
        <FormInputSkeleton />
        <FormInputSkeleton />
        <FormInputSkeleton />
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
        
        {/* Link skeleton */}
        <div className="text-center">
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton untuk dashboard metrics
 */
export function DashboardMetricSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-8 w-16" /> {/* Value */}
        </div>
        <Skeleton className="h-8 w-8 rounded-full" /> {/* Icon */}
      </div>
    </div>
  );
}

/**
 * Skeleton untuk dashboard overview
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Metrics grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <DashboardMetricSkeleton key={index} />
        ))}
      </div>
      
      {/* Content area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton untuk search results
 */
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-card rounded-lg border border-border">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton untuk navigation menu
 */
export function NavigationSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-8 w-24" /> {/* Logo */}
      <div className="hidden md:flex items-center space-x-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-16" />
        ))}
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

/**
 * Skeleton untuk mobile navigation
 */
export function MobileNavigationSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
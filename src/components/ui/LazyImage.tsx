'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useInfiniteScroll } from '@/hooks/useGestures'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  onLoad?: () => void
  onError?: () => void
}

/**
 * Komponen LazyImage yang dioptimalkan untuk mobile
 * Menggunakan Intersection Observer untuk lazy loading
 * Mendukung placeholder dan progressive loading
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTJhNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority) // Jika priority, langsung load
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Setup intersection observer untuk lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Mulai load 50px sebelum masuk viewport
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Error state
  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-base-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-muted-foreground">
          <svg 
            className="w-8 h-8 mx-auto mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
          <p className="text-xs">Gagal memuat gambar</p>
        </div>
      </div>
    )
  }

  // Loading state (placeholder)
  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={`bg-base-100 animate-pulse ${className}`}
        style={{ width, height }}
      >
        <div className="w-full h-full bg-base-200 rounded" />
      </div>
    )
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder saat loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-base-100 animate-pulse">
          <div className="w-full h-full bg-base-200" />
        </div>
      )}
      
      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        quality={quality}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={placeholder}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover'
        }}
      />
    </div>
  )
}

/**
 * Komponen untuk progressive image loading dengan multiple sizes
 */
interface ProgressiveImageProps extends LazyImageProps {
  srcSet?: {
    small: string
    medium: string
    large: string
  }
}

export function ProgressiveImage({
  srcSet,
  src,
  ...props
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(srcSet?.small || src)
  const [isHighResLoaded, setIsHighResLoaded] = useState(false)

  useEffect(() => {
    if (!srcSet) return

    // Load medium resolution first
    const mediumImg = new window.Image()
    mediumImg.onload = () => {
      setCurrentSrc(srcSet.medium)
      
      // Then load high resolution
      const largeImg = new window.Image()
      largeImg.onload = () => {
        setCurrentSrc(srcSet.large)
        setIsHighResLoaded(true)
      }
      largeImg.src = srcSet.large
    }
    mediumImg.src = srcSet.medium
  }, [srcSet])

  return (
    <LazyImage
      {...props}
      src={currentSrc}
      className={`${props.className} ${
        isHighResLoaded ? '' : 'filter blur-sm'
      } transition-all duration-300`}
    />
  )
}

/**
 * Komponen untuk image gallery dengan lazy loading
 */
interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    thumbnail?: string
  }>
  className?: string
  onImageClick?: (index: number) => void
}

export function LazyImageGallery({
  images,
  className = '',
  onImageClick
}: ImageGalleryProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="aspect-square cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onImageClick?.(index)}
        >
          <LazyImage
            src={image.thumbnail || image.src}
            alt={image.alt}
            fill
            className="rounded-lg"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  )
}
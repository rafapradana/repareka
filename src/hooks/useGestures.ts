'use client'

import { useRef, useEffect, useCallback } from 'react'

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
  velocity: number
}

interface GestureHandlers {
  onSwipe?: (direction: SwipeDirection) => void
  onTap?: (event: TouchEvent) => void
  onLongPress?: (event: TouchEvent) => void
  onPinch?: (scale: number) => void
}

interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

/**
 * Hook untuk handling gesture interactions pada mobile
 * Mendukung swipe, tap, long press, dan pinch gestures
 */
export function useGestures(handlers: GestureHandlers) {
  const startTouch = useRef<TouchPoint | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const initialDistance = useRef<number>(0)

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0]
    
    if (event.touches.length === 1) {
      // Single touch - untuk swipe dan tap
      startTouch.current = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      }

      // Setup long press detection
      if (handlers.onLongPress) {
        longPressTimer.current = setTimeout(() => {
          handlers.onLongPress?.(event)
        }, 500) // 500ms untuk long press
      }
    } else if (event.touches.length === 2 && handlers.onPinch) {
      // Multi-touch untuk pinch
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      
      initialDistance.current = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
    }
  }, [handlers])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Cancel long press jika ada movement
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (event.touches.length === 2 && handlers.onPinch && initialDistance.current > 0) {
      // Handle pinch gesture
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      
      const scale = currentDistance / initialDistance.current
      handlers.onPinch(scale)
    }
  }, [handlers])

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (!startTouch.current || event.touches.length > 0) {
      return
    }

    const endTouch = event.changedTouches[0]
    const deltaX = endTouch.clientX - startTouch.current.x
    const deltaY = endTouch.clientY - startTouch.current.y
    const deltaTime = Date.now() - startTouch.current.timestamp
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const velocity = distance / deltaTime

    // Threshold untuk mendeteksi swipe vs tap
    const SWIPE_THRESHOLD = 50 // minimum distance untuk swipe
    const TAP_THRESHOLD = 10 // maximum distance untuk tap
    const MAX_TAP_TIME = 300 // maximum time untuk tap

    if (distance < TAP_THRESHOLD && deltaTime < MAX_TAP_TIME) {
      // Tap gesture
      handlers.onTap?.(event)
    } else if (distance > SWIPE_THRESHOLD && handlers.onSwipe) {
      // Swipe gesture
      let direction: 'left' | 'right' | 'up' | 'down'
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        direction = deltaX > 0 ? 'right' : 'left'
      } else {
        // Vertical swipe
        direction = deltaY > 0 ? 'down' : 'up'
      }

      handlers.onSwipe({
        direction,
        distance,
        velocity
      })
    }

    startTouch.current = null
    initialDistance.current = 0
  }, [handlers])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

/**
 * Hook untuk smooth scrolling dengan momentum pada mobile
 */
export function useSmoothScroll() {
  const scrollRef = useRef<HTMLElement | null>(null)

  const scrollTo = useCallback((target: number, duration: number = 300) => {
    if (!scrollRef.current) return

    const start = scrollRef.current.scrollTop
    const distance = target - start
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function untuk smooth animation
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

      const currentPosition = start + distance * easeInOutCubic(progress)
      
      if (scrollRef.current) {
        scrollRef.current.scrollTop = currentPosition
      }

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }, [])

  return {
    scrollRef,
    scrollTo
  }
}

/**
 * Hook untuk infinite scroll dengan intersection observer
 * Dioptimalkan untuk mobile performance
 */
export function useInfiniteScroll(
  callback: () => void,
  options: {
    threshold?: number
    rootMargin?: string
    enabled?: boolean
  } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true
  } = options

  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  const setElement = useCallback((element: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    elementRef.current = element

    if (element && enabled) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callback()
          }
        },
        {
          threshold,
          rootMargin
        }
      )

      observerRef.current.observe(element)
    }
  }, [callback, threshold, rootMargin, enabled])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return setElement
}
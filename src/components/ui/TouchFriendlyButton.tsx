'use client'

import React from 'react'
import { useMobile } from '@/hooks/useMobile'
import { useGestures } from '@/hooks/useGestures'

interface TouchFriendlyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

/**
 * Button component yang dioptimalkan untuk touch interactions
 * Menyediakan feedback haptic dan visual yang baik untuk mobile
 */
export function TouchFriendlyButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  onClick,
  disabled,
  ...props
}: TouchFriendlyButtonProps) {
  const { isMobile, isTouchDevice } = useMobile()
  
  // Gesture handling untuk touch feedback
  const gestureHandlers = useGestures({
    onTap: (event) => {
      if (!disabled && !loading && onClick) {
        // Haptic feedback jika tersedia
        if ('vibrate' in navigator && isTouchDevice) {
          navigator.vibrate(10) // Short vibration
        }
        
        onClick(event as React.MouseEvent<HTMLButtonElement>)
      }
    }
  })

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    no-select touch-action-manipulation
    ${isTouchDevice ? 'touch-target' : ''}
    ${isMobile ? 'active:scale-95' : 'hover:scale-105 active:scale-95'}
  `

  const variantClasses = {
    primary: `
      bg-primary text-primary-foreground
      hover:bg-primary/90 active:bg-primary/80
      focus:ring-primary/50
    `,
    secondary: `
      bg-secondary text-secondary-foreground
      hover:bg-secondary/90 active:bg-secondary/80
      focus:ring-secondary/50
    `,
    outline: `
      border border-border bg-background text-foreground
      hover:bg-accent hover:text-accent-foreground
      active:bg-accent/80
      focus:ring-primary/50
    `,
    ghost: `
      text-foreground hover:bg-accent hover:text-accent-foreground
      active:bg-accent/80
      focus:ring-primary/50
    `
  }

  const sizeClasses = {
    sm: isMobile ? 'px-3 py-2 text-sm min-h-[40px]' : 'px-3 py-2 text-sm',
    md: isMobile ? 'px-4 py-3 text-base min-h-[44px]' : 'px-4 py-2 text-sm',
    lg: isMobile ? 'px-6 py-4 text-lg min-h-[48px]' : 'px-6 py-3 text-base'
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
      {...(isTouchDevice ? gestureHandlers : { onClick })}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

/**
 * Floating Action Button untuk mobile
 */
interface FABProps {
  onClick: () => void
  icon: React.ReactNode
  label?: string
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  className?: string
}

export function FloatingActionButton({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  className = ''
}: FABProps) {
  const { isMobile } = useMobile()

  if (!isMobile) return null

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  }

  return (
    <TouchFriendlyButton
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]} z-50
        w-14 h-14 rounded-full shadow-lg
        bg-primary text-primary-foreground
        hover:shadow-xl active:shadow-md
        ${className}
      `}
      aria-label={label}
    >
      {icon}
    </TouchFriendlyButton>
  )
}
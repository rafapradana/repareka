'use client'

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className 
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* Bottom Sheet */}
      <div 
        ref={sheetRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl",
          "animate-in slide-in-from-bottom-full duration-300",
          "max-h-[85vh] overflow-hidden flex flex-col",
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
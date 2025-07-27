'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Home, Grid3X3, Users, Info, LogIn, User as UserIcon, LogOut } from 'lucide-react'
import { useGestures } from '@/hooks/useGestures'
import { useMobile } from '@/hooks/useMobile'
import type { User } from './types'

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
}

export function MobileNavDrawer({ isOpen, onClose, user }: MobileNavDrawerProps) {
  const { isMobile, isTouchDevice } = useMobile()
  
  // Gesture handling untuk swipe to close
  const gestureHandlers = useGestures({
    onSwipe: (swipe) => {
      if (swipe.direction === 'left' && swipe.distance > 100) {
        onClose()
      }
    }
  })

  // Close drawer when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      
      // Prevent scroll pada background saat drawer terbuka
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const navigationItems = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/categories', label: 'Kategori', icon: Grid3X3 },
    { href: '/mitra', label: 'Jadi Mitra', icon: Users },
    { href: '/about', label: 'Tentang', icon: Info },
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Drawer dengan gesture support */}
      <div 
        className={`
          fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card border-r border-border z-50 
          transform transition-transform duration-300 ease-in-out md:hidden safe-area-top safe-area-bottom
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        {...(isTouchDevice ? gestureHandlers : {})}
      >
        <div className="flex flex-col h-full mobile-viewport">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="font-display font-semibold text-xl text-foreground">
                Repareka
              </span>
            </Link>
            
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info (jika sudah login) */}
          {user && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  {user.avatar_url ? (
                    <Image 
                      src={user.avatar_url} 
                      alt={user.full_name || user.business_name || 'User avatar'} 
                      width={40}
                      height={40}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-primary-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {user.full_name || user.business_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-accent transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* User Actions */}
            {user ? (
              <div className="mt-6 pt-6 border-t border-border">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-accent transition-colors"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">Profil</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        // TODO: Implement logout functionality
                        console.log('Logout clicked')
                        onClose()
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-foreground hover:bg-accent transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Keluar</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-border">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/auth/login"
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-accent transition-colors"
                    >
                      <LogIn className="h-5 w-5" />
                      <span className="font-medium">Masuk</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg mx-4"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">Daftar</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

interface SearchBarProps {
  onClose?: () => void
  placeholder?: string
}

export function SearchBar({ onClose, placeholder = "Cari layanan reparasi..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Debounced search untuk mengurangi API calls
  const debouncedSearch = useDebouncedCallback(
    (searchQuery: string) => {
      if (searchQuery.trim()) {
        // TODO: Implement search functionality
        console.log('Searching for:', searchQuery)
        setIsLoading(false)
      }
    },
    300
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim()) {
      setIsLoading(true)
      debouncedSearch(value)
    } else {
      setIsLoading(false)
    }
  }, [debouncedSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose?.()
    }
  }

  const handleClear = () => {
    setQuery('')
    setIsLoading(false)
    onClose?.()
  }

  // Don't render interactive elements until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <div className="w-full pl-10 pr-20 py-2.5 bg-background border border-input rounded-lg text-sm text-muted-foreground">
            {placeholder}
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium">
            Cari
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
          autoComplete="off"
        />
        
        {/* Search Button */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          Cari
        </button>
        
        {/* Loading indicator atau Clear button */}
        {isLoading && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
        
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-accent rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-3">
            <div className="text-xs text-muted-foreground mb-2">Pencarian populer:</div>
            <div className="space-y-1">
              <div className="text-sm text-foreground hover:bg-accent p-2 rounded cursor-pointer">
                Reparasi sepatu kulit
              </div>
              <div className="text-sm text-foreground hover:bg-accent p-2 rounded cursor-pointer">
                Service handphone
              </div>
              <div className="text-sm text-foreground hover:bg-accent p-2 rounded cursor-pointer">
                Jahit pakaian
              </div>
            </div>
            <div className="border-t border-border mt-2 pt-2">
              <div className="text-sm text-primary hover:bg-accent p-2 rounded cursor-pointer">
                Cari &quot;{query}&quot;
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Search, Filter, X, ChevronDown, Sliders, MapPin, Star, DollarSign } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import type { FilterState, Category } from '@/types/service'

interface Location {
  province: string
  cities: string[]
}

interface SearchAndFilterProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: FilterState) => void
  categories: Category[]
  locations: Location[]
  initialFilters?: FilterState
}

export function SearchAndFilter({ 
  onSearch, 
  onFilterChange, 
  categories, 
  locations,
  initialFilters = {}
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '')
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Debounced search untuk mengurangi API calls
  const debouncedSearch = useDebouncedCallback(
    (query: string) => {
      onSearch(query)
    },
    300
  )

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }, [debouncedSearch])

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    
    // Reset city jika province berubah
    if (key === 'province') {
      newFilters.city = undefined
    }
    
    setFilters(newFilters)
    onFilterChange(newFilters)
  }, [filters, onFilterChange])

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: FilterState = {}
    setFilters(clearedFilters)
    setSearchQuery('')
    onFilterChange(clearedFilters)
    onSearch('')
    setShowMobileFilters(false)
  }

  // Get cities for selected province
  const availableCities = filters.province 
    ? locations.find(loc => loc.province === filters.province)?.cities || []
    : []

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Cari layanan reparasi..."
          className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
        />
        
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              onSearch('')
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {/* Search Suggestions */}
        {isSearchFocused && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="p-3">
              <div className="text-xs text-muted-foreground mb-2">Pencarian populer:</div>
              <div className="space-y-1">
                {['Reparasi sepatu kulit', 'Service handphone', 'Jahit pakaian', 'Furniture kayu'].map((suggestion) => (
                  <div
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion)
                      onSearch(suggestion)
                      setIsSearchFocused(false)
                    }}
                    className="text-sm text-foreground hover:bg-accent p-2 rounded cursor-pointer"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center space-x-2 bg-accent text-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Hapus Filter
            </button>
          )}
        </div>

        {/* Sort Options */}
        <select 
          className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="">Urutkan: Terpopuler</option>
          <option value="price_asc">Harga Terendah</option>
          <option value="price_desc">Harga Tertinggi</option>
          <option value="rating_desc">Rating Tertinggi</option>
          <option value="newest">Terbaru</option>
        </select>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Kategori</label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Provinsi</label>
            <select
              value={filters.province || ''}
              onChange={(e) => handleFilterChange('province', e.target.value || undefined)}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Semua Provinsi</option>
              {locations.map((location) => (
                <option key={location.province} value={location.province}>
                  {location.province}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Kota</label>
            <select
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
              disabled={!filters.province}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Semua Kota</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Rentang Harga</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.price_min || ''}
                onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Min"
                className="w-full border border-border rounded-lg px-2 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                value={filters.price_max || ''}
                onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Max"
                className="w-full border border-border rounded-lg px-2 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Rating Minimum</label>
            <select
              value={filters.rating || ''}
              onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Semua Rating</option>
              <option value="4">⭐ 4.0+</option>
              <option value="4.5">⭐ 4.5+</option>
              <option value="4.8">⭐ 4.8+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Filters */}
      <BottomSheet
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        title="Filter Layanan"
      >
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium text-foreground">Kategori</label>
            </div>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filters */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium text-foreground">Lokasi</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Provinsi</label>
                <select
                  value={filters.province || ''}
                  onChange={(e) => handleFilterChange('province', e.target.value || undefined)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Semua</option>
                  {locations.map((location) => (
                    <option key={location.province} value={location.province}>
                      {location.province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">Kota</label>
                <select
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                  disabled={!filters.province}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="">Semua</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium text-foreground">Rentang Harga</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Harga Minimum</label>
                <input
                  type="number"
                  value={filters.price_min || ''}
                  onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="0"
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Harga Maksimum</label>
                <input
                  type="number"
                  value={filters.price_max || ''}
                  onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Tidak terbatas"
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium text-foreground">Rating Minimum</label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: '', label: 'Semua Rating' },
                { value: '4', label: '⭐ 4.0+' },
                { value: '4.5', label: '⭐ 4.5+' },
                { value: '4.8', label: '⭐ 4.8+' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('rating', option.value ? Number(option.value) : undefined)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    (filters.rating?.toString() || '') === option.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              Reset Filter
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
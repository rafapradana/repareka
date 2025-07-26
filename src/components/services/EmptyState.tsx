'use client'

import React from 'react'
import { Search, Filter, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  type: 'search' | 'filter' | 'error'
  title?: string
  description?: string
  searchQuery?: string
  onReset?: () => void
  onRetry?: () => void
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  searchQuery, 
  onReset, 
  onRetry 
}: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: <Search className="h-12 w-12 text-muted-foreground" />,
          title: title || `Tidak ada hasil untuk "${searchQuery}"`,
          description: description || 'Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda.',
          suggestions: [
            'Gunakan kata kunci yang lebih umum',
            'Periksa ejaan kata kunci',
            'Coba kategori yang berbeda',
            'Hapus beberapa filter'
          ]
        }
      
      case 'filter':
        return {
          icon: <Filter className="h-12 w-12 text-muted-foreground" />,
          title: title || 'Tidak ada layanan yang sesuai',
          description: description || 'Tidak ada layanan yang memenuhi kriteria filter Anda.',
          suggestions: [
            'Coba hapus beberapa filter',
            'Pilih area yang lebih luas',
            'Sesuaikan rentang harga',
            'Pilih rating yang lebih rendah'
          ]
        }
      
      case 'error':
        return {
          icon: <RefreshCw className="h-12 w-12 text-muted-foreground" />,
          title: title || 'Terjadi kesalahan',
          description: description || 'Gagal memuat layanan. Silakan coba lagi.',
          suggestions: [
            'Periksa koneksi internet Anda',
            'Refresh halaman',
            'Coba lagi dalam beberapa saat'
          ]
        }
      
      default:
        return {
          icon: <Search className="h-12 w-12 text-muted-foreground" />,
          title: 'Tidak ada data',
          description: 'Tidak ada data yang dapat ditampilkan.',
          suggestions: []
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="mb-4">
        {content.icon}
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      
      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-md">
        {content.description}
      </p>
      
      {/* Suggestions */}
      {content.suggestions.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Saran:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {content.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center justify-center">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {type === 'search' ? 'Hapus Pencarian' : 'Reset Filter'}
          </button>
        )}
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            Coba Lagi
          </button>
        )}
        
        {!onReset && !onRetry && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Refresh Halaman
          </button>
        )}
      </div>
    </div>
  )
}
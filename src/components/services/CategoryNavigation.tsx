'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import type { Category } from '@/types/service'
import { cn } from '@/lib/utils'

interface CategoryNavigationProps {
  categories: Category[]
  selectedCategory?: string
  onCategorySelect: (categoryId: string) => void
  className?: string
}

export function CategoryNavigation({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  className 
}: CategoryNavigationProps) {
  return (
    <section className={cn("border-b border-border bg-card", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Kategori</h2>
          <button 
            onClick={() => onCategorySelect('')}
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            Lihat Semua
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-7 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => onCategorySelect(category.id)}
            />
          ))}
        </div>
        
        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => onCategorySelect(category.id)}
                mobile
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface CategoryCardProps {
  category: Category
  isSelected: boolean
  onClick: () => void
  mobile?: boolean
}

function CategoryCard({ category, isSelected, onClick, mobile }: CategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group",
        "border border-transparent hover:border-border",
        mobile && "min-w-[80px] flex-shrink-0",
        isSelected && "bg-primary/10 border-primary/20 text-primary"
      )}
    >
      <div className={cn(
        "text-2xl mb-2 group-hover:scale-110 transition-transform",
        mobile && "text-xl mb-1"
      )}>
        {category.icon}
      </div>
      <span className={cn(
        "text-xs font-medium text-center text-foreground",
        mobile && "text-[10px] leading-tight",
        isSelected && "text-primary font-semibold"
      )}>
        {category.name}
      </span>
    </div>
  )
}

// CSS untuk hide scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = scrollbarHideStyles
  document.head.appendChild(style)
}
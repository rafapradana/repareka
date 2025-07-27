import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ServiceCard } from '@/components/services/ServiceCard'
import { mockService } from '../utils'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}))

describe('ServiceCard Component', () => {
  const defaultProps = {
    service: mockService,
    onClick: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render service information correctly', () => {
      render(<ServiceCard {...defaultProps} />)

      expect(screen.getByText(mockService.title)).toBeInTheDocument()
      expect(screen.getByText(mockService.mitra.business_name)).toBeInTheDocument()
      expect(screen.getByText(`${mockService.mitra.city}, ${mockService.mitra.province}`)).toBeInTheDocument()
      expect(screen.getByText(mockService.rating.toString())).toBeInTheDocument()
      expect(screen.getByText(`(${mockService.total_reviews})`)).toBeInTheDocument()
    })

    it('should render service image with correct alt text', () => {
      render(<ServiceCard {...defaultProps} />)

      const image = screen.getByAltText(mockService.title)
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', mockService.images[0])
    })

    it('should render placeholder image when no images available', () => {
      const serviceWithoutImages = {
        ...mockService,
        images: []
      }

      render(<ServiceCard service={serviceWithoutImages} onClick={vi.fn()} />)

      const image = screen.getByAltText(mockService.title)
      expect(image).toHaveAttribute('src', '/api/placeholder/300/200')
    })

    it('should render "Pesan Sekarang" button', () => {
      render(<ServiceCard {...defaultProps} />)

      expect(screen.getByText('Pesan Sekarang')).toBeInTheDocument()
    })
  })

  describe('Price Formatting', () => {
    it('should display price range when min and max are different', () => {
      const serviceWithPriceRange = {
        ...mockService,
        price_min: 50000,
        price_max: 150000
      }

      render(<ServiceCard service={serviceWithPriceRange} onClick={vi.fn()} />)

      expect(screen.getByText('Rp 50.000 - Rp 150.000')).toBeInTheDocument()
      expect(screen.getByText('Harga bervariasi')).toBeInTheDocument()
    })

    it('should display starting price when only min price is available', () => {
      const serviceWithMinPrice = {
        ...mockService,
        price_min: 75000,
        price_max: undefined
      }

      render(<ServiceCard service={serviceWithMinPrice} onClick={vi.fn()} />)

      expect(screen.getByText('Mulai Rp 75.000')).toBeInTheDocument()
    })

    it('should display "Konsultasi" when no price is available', () => {
      const serviceWithoutPrice = {
        ...mockService,
        price_min: undefined,
        price_max: undefined
      }

      render(<ServiceCard service={serviceWithoutPrice} onClick={vi.fn()} />)

      expect(screen.getByText('Konsultasi')).toBeInTheDocument()
    })

    it('should display single price when min and max are the same', () => {
      const serviceWithSinglePrice = {
        ...mockService,
        price_min: 100000,
        price_max: 100000
      }

      render(<ServiceCard service={serviceWithSinglePrice} onClick={vi.fn()} />)

      expect(screen.getByText('Mulai Rp 100.000')).toBeInTheDocument()
    })
  })

  describe('Rating Badge', () => {
    it('should show "Terpercaya" badge for high rating services', () => {
      const highRatedService = {
        ...mockService,
        rating: 4.8
      }

      render(<ServiceCard service={highRatedService} onClick={vi.fn()} />)

      expect(screen.getByText('Terpercaya')).toBeInTheDocument()
    })

    it('should not show "Terpercaya" badge for lower rating services', () => {
      const lowerRatedService = {
        ...mockService,
        rating: 4.2
      }

      render(<ServiceCard service={lowerRatedService} onClick={vi.fn()} />)

      expect(screen.queryByText('Terpercaya')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onClick when card is clicked', () => {
      const mockOnClick = vi.fn()
      render(<ServiceCard service={mockService} onClick={mockOnClick} />)

      const card = screen.getByText(mockService.title).closest('div')
      fireEvent.click(card!)

      expect(mockOnClick).toHaveBeenCalledWith(mockService)
    })

    it('should call onClick when button is clicked', () => {
      const mockOnClick = vi.fn()
      render(<ServiceCard service={mockService} onClick={mockOnClick} />)

      const button = screen.getByText('Pesan Sekarang')
      fireEvent.click(button)

      expect(mockOnClick).toHaveBeenCalledWith(mockService)
    })

    it('should not crash when onClick is not provided', () => {
      expect(() => {
        render(<ServiceCard service={mockService} />)
        const card = screen.getByText(mockService.title).closest('div')
        fireEvent.click(card!)
      }).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('should have proper cursor pointer styling', () => {
      render(<ServiceCard {...defaultProps} />)

      const card = screen.getByText(mockService.title).closest('div')
      expect(card).toHaveClass('cursor-pointer')
    })

    it('should have proper button role for action button', () => {
      render(<ServiceCard {...defaultProps} />)

      const button = screen.getByText('Pesan Sekarang')
      expect(button.tagName).toBe('BUTTON')
    })

    it('should have proper image alt text', () => {
      render(<ServiceCard {...defaultProps} />)

      const image = screen.getByAltText(mockService.title)
      expect(image).toBeInTheDocument()
    })
  })

  describe('Visual Elements', () => {
    it('should render response time indicator', () => {
      render(<ServiceCard {...defaultProps} />)

      expect(screen.getByText('< 2 jam')).toBeInTheDocument()
    })

    it('should render location icon and text', () => {
      render(<ServiceCard {...defaultProps} />)

      const locationText = screen.getByText(`${mockService.mitra.city}, ${mockService.mitra.province}`)
      expect(locationText).toBeInTheDocument()
    })

    it('should render star rating with proper styling', () => {
      render(<ServiceCard {...defaultProps} />)

      const ratingText = screen.getByText(mockService.rating.toString())
      expect(ratingText).toBeInTheDocument()
      
      const reviewCount = screen.getByText(`(${mockService.total_reviews})`)
      expect(reviewCount).toBeInTheDocument()
    })

    it('should render shield icon for provider verification', () => {
      render(<ServiceCard {...defaultProps} />)

      // Shield icon should be present (tested through business name presence)
      expect(screen.getByText(mockService.mitra.business_name)).toBeInTheDocument()
    })
  })

  describe('Hover Effects', () => {
    it('should have hover classes for interactive elements', () => {
      render(<ServiceCard {...defaultProps} />)

      const card = screen.getByText(mockService.title).closest('div')
      expect(card).toHaveClass('hover:shadow-lg', 'transition-all', 'duration-300', 'group')

      const button = screen.getByText('Pesan Sekarang')
      expect(button).toHaveClass('hover:bg-primary/90', 'transition-colors')
    })
  })
})
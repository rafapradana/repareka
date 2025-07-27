import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchAndFilter } from '@/components/services/SearchAndFilter'
import type { FilterState, Category } from '@/types/service'

// Mock use-debounce
vi.mock('use-debounce', () => ({
  useDebouncedCallback: (fn: Function, delay: number) => fn
}))

// Mock BottomSheet component
vi.mock('@/components/ui/bottom-sheet', () => ({
  BottomSheet: ({ isOpen, onClose, title, children }: any) => 
    isOpen ? (
      <div data-testid="bottom-sheet">
        <div>{title}</div>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null
}))

describe('SearchAndFilter Component', () => {
  const mockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Sepatu',
      slug: 'sepatu',
      icon: '👟',
      description: 'Kategori sepatu',
      isActive: true
    },
    {
      id: 'cat-2',
      name: 'Pakaian',
      slug: 'pakaian',
      icon: '👕',
      description: 'Kategori pakaian',
      isActive: true
    }
  ]

  const mockLocations = [
    {
      province: 'DKI Jakarta',
      cities: ['Jakarta Selatan', 'Jakarta Utara', 'Jakarta Barat']
    },
    {
      province: 'Jawa Barat',
      cities: ['Bandung', 'Bogor', 'Depok']
    }
  ]

  const defaultProps = {
    onSearch: vi.fn(),
    onFilterChange: vi.fn(),
    categories: mockCategories,
    locations: mockLocations,
    initialFilters: {}
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Search Functionality', () => {
    it('should render search input with placeholder', () => {
      render(<SearchAndFilter {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Cari layanan reparasi...')
      expect(searchInput).toBeInTheDocument()
    })

    it('should call onSearch when typing in search input', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Cari layanan reparasi...')
      await user.type(searchInput, 'sepatu')

      expect(defaultProps.onSearch).toHaveBeenCalledWith('sepatu')
    })

    it('should show clear button when search has value', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Cari layanan reparasi...')
      await user.type(searchInput, 'test')

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should clear search when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Cari layanan reparasi...')
      await user.type(searchInput, 'test')

      const clearButton = screen.getByRole('button')
      await user.click(clearButton)

      expect(searchInput).toHaveValue('')
      expect(defaultProps.onSearch).toHaveBeenCalledWith('')
    })

    it('should show search suggestions when focused', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Cari layanan reparasi...')
      await user.type(searchInput, 'sepatu')
      await user.click(searchInput)

      expect(screen.getByText('Pencarian populer:')).toBeInTheDocument()
      expect(screen.getByText('Reparasi sepatu kulit')).toBeInTheDocument()
    })

    it('should select suggestion when clicked', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Cari layanan reparasi...')
      await user.type(searchInput, 'sepatu')
      await user.click(searchInput)

      const suggestion = screen.getByText('Reparasi sepatu kulit')
      await user.click(suggestion)

      expect(defaultProps.onSearch).toHaveBeenCalledWith('Reparasi sepatu kulit')
    })
  })

  describe('Desktop Filters', () => {
    it('should render all filter controls on desktop', () => {
      render(<SearchAndFilter {...defaultProps} />)

      expect(screen.getByText('Kategori')).toBeInTheDocument()
      expect(screen.getByText('Provinsi')).toBeInTheDocument()
      expect(screen.getByText('Kota')).toBeInTheDocument()
      expect(screen.getByText('Rentang Harga')).toBeInTheDocument()
      expect(screen.getByText('Rating Minimum')).toBeInTheDocument()
    })

    it('should populate category options correctly', () => {
      render(<SearchAndFilter {...defaultProps} />)

      const categorySelect = screen.getByDisplayValue('Semua Kategori')
      expect(categorySelect).toBeInTheDocument()

      // Check if categories are in the select
      mockCategories.forEach(category => {
        expect(screen.getByText(`${category.icon} ${category.name}`)).toBeInTheDocument()
      })
    })

    it('should populate province options correctly', () => {
      render(<SearchAndFilter {...defaultProps} />)

      const provinceSelect = screen.getByDisplayValue('Semua Provinsi')
      expect(provinceSelect).toBeInTheDocument()

      mockLocations.forEach(location => {
        expect(screen.getByText(location.province)).toBeInTheDocument()
      })
    })

    it('should update cities when province is selected', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const provinceSelect = screen.getByDisplayValue('Semua Provinsi')
      await user.selectOptions(provinceSelect, 'DKI Jakarta')

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        province: 'DKI Jakarta',
        city: undefined
      })
    })

    it('should handle price range inputs', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const minPriceInput = screen.getByPlaceholderText('Min')
      const maxPriceInput = screen.getByPlaceholderText('Max')

      await user.type(minPriceInput, '50000')
      await user.type(maxPriceInput, '150000')

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        price_min: 50000
      })
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        price_max: 150000
      })
    })

    it('should handle rating filter selection', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const ratingSelect = screen.getByDisplayValue('Semua Rating')
      await user.selectOptions(ratingSelect, '4.5')

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        rating: 4.5
      })
    })
  })

  describe('Mobile Filters', () => {
    it('should show mobile filter button', () => {
      render(<SearchAndFilter {...defaultProps} />)

      const filterButton = screen.getByText('Filter')
      expect(filterButton).toBeInTheDocument()
    })

    it('should show active filter count on mobile button', () => {
      const filtersWithActive = {
        category: 'cat-1',
        province: 'DKI Jakarta'
      }

      render(<SearchAndFilter {...defaultProps} initialFilters={filtersWithActive} />)

      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should open bottom sheet when mobile filter button is clicked', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const filterButton = screen.getByText('Filter')
      await user.click(filterButton)

      expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument()
      expect(screen.getByText('Filter Layanan')).toBeInTheDocument()
    })

    it('should close bottom sheet when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const filterButton = screen.getByText('Filter')
      await user.click(filterButton)

      const closeButton = screen.getByText('Close')
      await user.click(closeButton)

      expect(screen.queryByTestId('bottom-sheet')).not.toBeInTheDocument()
    })
  })

  describe('Sort Functionality', () => {
    it('should render sort dropdown', () => {
      render(<SearchAndFilter {...defaultProps} />)

      const sortSelect = screen.getByDisplayValue('Urutkan: Terpopuler')
      expect(sortSelect).toBeInTheDocument()
    })

    it('should handle sort selection', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const sortSelect = screen.getByDisplayValue('Urutkan: Terpopuler')
      await user.selectOptions(sortSelect, 'price_asc')

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
        sort: 'price_asc'
      })
    })
  })

  describe('Clear Filters', () => {
    it('should show clear filters button when filters are active', () => {
      const filtersWithActive = {
        category: 'cat-1',
        province: 'DKI Jakarta'
      }

      render(<SearchAndFilter {...defaultProps} initialFilters={filtersWithActive} />)

      expect(screen.getByText('Hapus Filter')).toBeInTheDocument()
    })

    it('should clear all filters when clear button is clicked', async () => {
      const user = userEvent.setup()
      const filtersWithActive = {
        category: 'cat-1',
        province: 'DKI Jakarta',
        search: 'test'
      }

      render(<SearchAndFilter {...defaultProps} initialFilters={filtersWithActive} />)

      const clearButton = screen.getByText('Hapus Filter')
      await user.click(clearButton)

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({})
      expect(defaultProps.onSearch).toHaveBeenCalledWith('')
    })
  })

  describe('Initial Filters', () => {
    it('should initialize with provided filters', () => {
      const initialFilters: FilterState = {
        search: 'initial search',
        category: 'cat-1',
        province: 'DKI Jakarta'
      }

      render(<SearchAndFilter {...defaultProps} initialFilters={initialFilters} />)

      const searchInput = screen.getByDisplayValue('initial search')
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for form controls', () => {
      render(<SearchAndFilter {...defaultProps} />)

      expect(screen.getByLabelText('Kategori')).toBeInTheDocument()
      expect(screen.getByLabelText('Provinsi')).toBeInTheDocument()
      expect(screen.getByLabelText('Kota')).toBeInTheDocument()
      expect(screen.getByLabelText('Rating Minimum')).toBeInTheDocument()
    })

    it('should disable city select when no province is selected', () => {
      render(<SearchAndFilter {...defaultProps} />)

      const citySelect = screen.getByDisplayValue('Semua Kota')
      expect(citySelect).toBeDisabled()
    })

    it('should enable city select when province is selected', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const provinceSelect = screen.getByDisplayValue('Semua Provinsi')
      await user.selectOptions(provinceSelect, 'DKI Jakarta')

      const citySelect = screen.getByDisplayValue('Semua Kota')
      expect(citySelect).not.toBeDisabled()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid price inputs gracefully', async () => {
      const user = userEvent.setup()
      render(<SearchAndFilter {...defaultProps} />)

      const minPriceInput = screen.getByPlaceholderText('Min')
      await user.type(minPriceInput, 'invalid')

      // Should not crash and should not call onFilterChange with invalid value
      expect(defaultProps.onFilterChange).not.toHaveBeenCalledWith({
        price_min: NaN
      })
    })
  })
})
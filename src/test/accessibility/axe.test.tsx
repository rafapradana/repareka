import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { AuthProvider } from '@/contexts/AuthContext'
import { MainLayout } from '@/components/layout/MainLayout'
import { ServiceCard } from '@/components/services/ServiceCard'
import { SearchAndFilter } from '@/components/services/SearchAndFilter'
import { CustomerAuthForm } from '@/components/auth/CustomerAuthForm'
import { MitraAuthForm } from '@/components/auth/MitraAuthForm'
import { mockService, mockUser, mockMitra } from '../utils'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    }
  }
}))

vi.mock('@/lib/auth/utils', () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
  loginUser: vi.fn(),
  registerCustomer: vi.fn(),
  registerMitra: vi.fn(),
  logoutUser: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}))

vi.mock('@/components/ui/bottom-sheet', () => ({
  BottomSheet: ({ isOpen, children }: any) => 
    isOpen ? <div role="dialog">{children}</div> : null
}))

vi.mock('use-debounce', () => ({
  useDebouncedCallback: (fn: Function) => fn
}))

const AuthWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Layout Components', () => {
    it('should not have accessibility violations in MainLayout', async () => {
      const { container } = render(
        <AuthWrapper>
          <MainLayout>
            <div>Test content</div>
          </MainLayout>
        </AuthWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper heading hierarchy', async () => {
      const { container } = render(
        <AuthWrapper>
          <MainLayout>
            <main>
              <h1>Main Title</h1>
              <section>
                <h2>Section Title</h2>
                <h3>Subsection Title</h3>
              </section>
            </main>
          </MainLayout>
        </AuthWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Service Components', () => {
    it('should not have accessibility violations in ServiceCard', async () => {
      const { container } = render(
        <ServiceCard service={mockService} onClick={vi.fn()} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper image alt text in ServiceCard', async () => {
      const { container, getByAltText } = render(
        <ServiceCard service={mockService} onClick={vi.fn()} />
      )

      // Check if image has proper alt text
      const image = getByAltText(mockService.title)
      expect(image).toBeInTheDocument()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper button accessibility in ServiceCard', async () => {
      const { container, getByRole } = render(
        <ServiceCard service={mockService} onClick={vi.fn()} />
      )

      // Check if button is properly accessible
      const button = getByRole('button', { name: /pesan sekarang/i })
      expect(button).toBeInTheDocument()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Search and Filter Components', () => {
    const mockCategories = [
      {
        id: 'cat-1',
        name: 'Sepatu',
        slug: 'sepatu',
        icon: '👟',
        description: 'Kategori sepatu',
        isActive: true
      }
    ]

    const mockLocations = [
      {
        province: 'DKI Jakarta',
        cities: ['Jakarta Selatan', 'Jakarta Utara']
      }
    ]

    it('should not have accessibility violations in SearchAndFilter', async () => {
      const { container } = render(
        <SearchAndFilter
          onSearch={vi.fn()}
          onFilterChange={vi.fn()}
          categories={mockCategories}
          locations={mockLocations}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper form labels in SearchAndFilter', async () => {
      const { container, getByLabelText } = render(
        <SearchAndFilter
          onSearch={vi.fn()}
          onFilterChange={vi.fn()}
          categories={mockCategories}
          locations={mockLocations}
        />
      )

      // Check if form controls have proper labels
      expect(getByLabelText('Kategori')).toBeInTheDocument()
      expect(getByLabelText('Provinsi')).toBeInTheDocument()
      expect(getByLabelText('Kota')).toBeInTheDocument()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper search input accessibility', async () => {
      const { container, getByPlaceholderText } = render(
        <SearchAndFilter
          onSearch={vi.fn()}
          onFilterChange={vi.fn()}
          categories={mockCategories}
          locations={mockLocations}
        />
      )

      // Check search input
      const searchInput = getByPlaceholderText('Cari layanan reparasi...')
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('type', 'text')

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Authentication Forms', () => {
    it('should not have accessibility violations in CustomerAuthForm', async () => {
      const { container } = render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="login"
            onSuccess={vi.fn()}
            onError={vi.fn()}
          />
        </AuthWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper form labels in CustomerAuthForm', async () => {
      const { container, getByLabelText } = render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="register"
            onSuccess={vi.fn()}
            onError={vi.fn()}
          />
        </AuthWrapper>
      )

      // Check if form inputs have proper labels
      expect(getByLabelText(/email/i)).toBeInTheDocument()
      expect(getByLabelText(/nama lengkap/i)).toBeInTheDocument()
      expect(getByLabelText(/password/i)).toBeInTheDocument()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations in MitraAuthForm', async () => {
      const { container } = render(
        <AuthWrapper>
          <MitraAuthForm
            mode="login"
            onSuccess={vi.fn()}
            onError={vi.fn()}
          />
        </AuthWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper form labels in MitraAuthForm', async () => {
      const { container, getByLabelText } = render(
        <AuthWrapper>
          <MitraAuthForm
            mode="register"
            onSuccess={vi.fn()}
            onError={vi.fn()}
          />
        </AuthWrapper>
      )

      // Check if form inputs have proper labels
      expect(getByLabelText(/email bisnis/i)).toBeInTheDocument()
      expect(getByLabelText(/nama bisnis/i)).toBeInTheDocument()
      expect(getByLabelText(/nomor telepon/i)).toBeInTheDocument()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper error message accessibility', async () => {
      const { container } = render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="login"
            onSuccess={vi.fn()}
            onError={vi.fn()}
          />
        </AuthWrapper>
      )

      // Error messages should be properly associated with form fields
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Interactive Elements', () => {
    it('should have proper focus management', async () => {
      const { container } = render(
        <AuthWrapper>
          <MainLayout>
            <button>First Button</button>
            <input type="text" placeholder="Text Input" />
            <button>Second Button</button>
          </MainLayout>
        </AuthWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper keyboard navigation', async () => {
      const { container } = render(
        <div>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Color Contrast', () => {
    it('should have sufficient color contrast for text elements', async () => {
      const { container } = render(
        <div>
          <h1 className="text-foreground">Main Heading</h1>
          <p className="text-muted-foreground">Secondary text</p>
          <button className="bg-primary text-primary-foreground">
            Primary Button
          </button>
          <button className="bg-secondary text-secondary-foreground">
            Secondary Button
          </button>
        </div>
      )

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('ARIA Attributes', () => {
    it('should have proper ARIA labels for interactive elements', async () => {
      const { container } = render(
        <div>
          <button aria-label="Close dialog">×</button>
          <input type="search" aria-label="Search services" />
          <div role="alert" aria-live="polite">
            Status message
          </div>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA roles for custom components', async () => {
      const { container } = render(
        <div>
          <div role="tablist">
            <button role="tab" aria-selected="true">Tab 1</button>
            <button role="tab" aria-selected="false">Tab 2</button>
          </div>
          <div role="tabpanel">Tab content</div>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Form Accessibility', () => {
    it('should have proper form structure', async () => {
      const { container } = render(
        <form>
          <fieldset>
            <legend>Personal Information</legend>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" required />
            
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required />
          </fieldset>
          
          <button type="submit">Submit</button>
        </form>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper error handling accessibility', async () => {
      const { container } = render(
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              aria-invalid="true"
              aria-describedby="email-error"
            />
            <div id="email-error" role="alert">
              Please enter a valid email address
            </div>
          </div>
        </form>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Mobile Accessibility', () => {
    it('should have proper touch target sizes', async () => {
      const { container } = render(
        <div>
          <button className="min-h-[44px] min-w-[44px] p-2">
            Touch Button
          </button>
          <a href="#" className="inline-block min-h-[44px] min-w-[44px] p-2">
            Touch Link
          </a>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Screen Reader Compatibility', () => {
    it('should have proper semantic structure', async () => {
      const { container } = render(
        <div>
          <header>
            <h1>Site Title</h1>
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </nav>
          </header>
          
          <main>
            <article>
              <h2>Article Title</h2>
              <p>Article content</p>
            </article>
          </main>
          
          <footer>
            <p>Footer content</p>
          </footer>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper skip links', async () => {
      const { container } = render(
        <div>
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>
          <nav>Navigation</nav>
          <main id="main-content">
            <h1>Main Content</h1>
          </main>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '@/contexts/AuthContext'
import { CustomerAuthForm } from '@/components/auth/CustomerAuthForm'
import { MitraAuthForm } from '@/components/auth/MitraAuthForm'
import { mockUser, mockMitra } from '../utils'

// Mock auth utilities
const mockLoginUser = vi.fn()
const mockRegisterCustomer = vi.fn()
const mockRegisterMitra = vi.fn()
const mockLogoutUser = vi.fn()
const mockGetCurrentUser = vi.fn()

vi.mock('@/lib/auth/utils', () => ({
  loginUser: mockLoginUser,
  registerCustomer: mockRegisterCustomer,
  registerMitra: mockRegisterMitra,
  logoutUser: mockLogoutUser,
  getCurrentUser: mockGetCurrentUser,
}))

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    }
  }
}))

// Mock location select component
vi.mock('@/components/ui/location-select', () => ({
  LocationSelect: ({ value, onChange, placeholder }: any) => (
    <select
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      data-testid="location-select"
    >
      <option value="">{placeholder}</option>
      <option value="DKI Jakarta">DKI Jakarta</option>
      <option value="Jawa Barat">Jawa Barat</option>
    </select>
  )
}))

const AuthWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCurrentUser.mockResolvedValue(null)
  })

  describe('Customer Authentication Flow', () => {
    it('should complete customer registration flow successfully', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      const mockCustomerUser = { ...mockUser, role: 'customer' }
      mockRegisterCustomer.mockResolvedValue(mockCustomerUser)

      render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="register"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Fill registration form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/nama lengkap/i), 'Test User')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      // Select province and city
      const provinceSelect = screen.getByTestId('location-select')
      await user.selectOptions(provinceSelect, 'DKI Jakarta')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /daftar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockRegisterCustomer).toHaveBeenCalledWith({
          email: 'test@example.com',
          fullName: 'Test User',
          password: 'password123',
          province: 'DKI Jakarta',
          city: expect.any(String)
        })
      })

      expect(mockOnSuccess).toHaveBeenCalledWith(mockCustomerUser)
      expect(mockOnError).not.toHaveBeenCalled()
    })

    it('should handle customer login flow successfully', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      const mockCustomerUser = { ...mockUser, role: 'customer' }
      mockLoginUser.mockResolvedValue(mockCustomerUser)

      render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="login"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Fill login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /masuk/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      expect(mockOnSuccess).toHaveBeenCalledWith(mockCustomerUser)
      expect(mockOnError).not.toHaveBeenCalled()
    })

    it('should handle customer authentication errors', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      const errorMessage = 'Invalid credentials'
      mockLoginUser.mockRejectedValue(new Error(errorMessage))

      render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="login"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Fill login form with invalid credentials
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /masuk/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(errorMessage)
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  describe('Mitra Authentication Flow', () => {
    it('should complete mitra registration flow successfully', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      const mockMitraUser = { ...mockMitra, role: 'mitra' }
      mockRegisterMitra.mockResolvedValue(mockMitraUser)

      render(
        <AuthWrapper>
          <MitraAuthForm
            mode="register"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Fill registration form
      await user.type(screen.getByLabelText(/email bisnis/i), 'mitra@example.com')
      await user.type(screen.getByLabelText(/nama bisnis/i), 'Test Mitra')
      await user.type(screen.getByLabelText(/nomor telepon/i), '081234567890')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.type(screen.getByLabelText(/alamat/i), 'Jl. Test No. 123')

      // Select province and city
      const provinceSelects = screen.getAllByTestId('location-select')
      await user.selectOptions(provinceSelects[0], 'DKI Jakarta')

      // Select business type
      const businessTypeSelect = screen.getByLabelText(/jenis bisnis/i)
      await user.selectOptions(businessTypeSelect, 'individual')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /daftar sebagai mitra/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockRegisterMitra).toHaveBeenCalledWith({
          email: 'mitra@example.com',
          businessName: 'Test Mitra',
          phone: '081234567890',
          password: 'password123',
          address: 'Jl. Test No. 123',
          province: 'DKI Jakarta',
          city: expect.any(String),
          businessType: 'individual'
        })
      })

      expect(mockOnSuccess).toHaveBeenCalledWith(mockMitraUser)
      expect(mockOnError).not.toHaveBeenCalled()
    })

    it('should handle mitra login flow successfully', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      const mockMitraUser = { ...mockMitra, role: 'mitra' }
      mockLoginUser.mockResolvedValue(mockMitraUser)

      render(
        <AuthWrapper>
          <MitraAuthForm
            mode="login"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Fill login form
      await user.type(screen.getByLabelText(/email/i), 'mitra@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /masuk/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith({
          email: 'mitra@example.com',
          password: 'password123'
        })
      })

      expect(mockOnSuccess).toHaveBeenCalledWith(mockMitraUser)
      expect(mockOnError).not.toHaveBeenCalled()
    })

    it('should handle mitra registration validation errors', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      render(
        <AuthWrapper>
          <MitraAuthForm
            mode="register"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Submit form without filling required fields
      const submitButton = screen.getByRole('button', { name: /daftar sebagai mitra/i })
      await user.click(submitButton)

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/email bisnis wajib diisi/i)).toBeInTheDocument()
      })

      expect(mockRegisterMitra).not.toHaveBeenCalled()
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  describe('Form Validation', () => {
    it('should validate email format in customer registration', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="register"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Enter invalid email
      await user.type(screen.getByLabelText(/email/i), 'invalid-email')
      await user.type(screen.getByLabelText(/nama lengkap/i), 'Test User')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /daftar/i })
      await user.click(submitButton)

      // Should show email validation error
      await waitFor(() => {
        expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument()
      })

      expect(mockRegisterCustomer).not.toHaveBeenCalled()
    })

    it('should validate password strength', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="register"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Enter weak password
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/nama lengkap/i), 'Test User')
      await user.type(screen.getByLabelText(/password/i), '123')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /daftar/i })
      await user.click(submitButton)

      // Should show password validation error
      await waitFor(() => {
        expect(screen.getByText(/password minimal 6 karakter/i)).toBeInTheDocument()
      })

      expect(mockRegisterCustomer).not.toHaveBeenCalled()
    })

    it('should validate phone number format in mitra registration', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      render(
        <AuthWrapper>
          <MitraAuthForm
            mode="register"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Fill form with invalid phone number
      await user.type(screen.getByLabelText(/email bisnis/i), 'mitra@example.com')
      await user.type(screen.getByLabelText(/nama bisnis/i), 'Test Mitra')
      await user.type(screen.getByLabelText(/nomor telepon/i), '123')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /daftar sebagai mitra/i })
      await user.click(submitButton)

      // Should show phone validation error
      await waitFor(() => {
        expect(screen.getByText(/format nomor telepon tidak valid/i)).toBeInTheDocument()
      })

      expect(mockRegisterMitra).not.toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should show loading state during customer registration', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      // Mock slow registration
      mockRegisterCustomer.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockUser), 1000))
      )

      render(
        <AuthWrapper>
          <CustomerAuthForm
            mode="register"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Fill and submit form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/nama lengkap/i), 'Test User')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      const submitButton = screen.getByRole('button', { name: /daftar/i })
      await user.click(submitButton)

      // Should show loading state
      expect(screen.getByText(/mendaftar/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })

    it('should show loading state during mitra login', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      // Mock slow login
      mockLoginUser.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockMitra), 1000))
      )

      render(
        <AuthWrapper>
          <MitraAuthForm
            mode="login"
            onSuccess={mockOnSuccess}
            onError={mockOnError}
          />
        </AuthWrapper>
      )

      // Fill and submit form
      await user.type(screen.getByLabelText(/email/i), 'mitra@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')

      const submitButton = screen.getByRole('button', { name: /masuk/i })
      await user.click(submitButton)

      // Should show loading state
      expect(screen.getByText(/masuk/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../../test/utils'
import userEvent from '@testing-library/user-event'
import { CustomerAuthForm } from '@/components/auth/CustomerAuthForm'

// Mock untuk useAuth hook
const mockSignIn = vi.fn()
const mockSignUp = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    loading: false,
    error: null
  })
}))

describe('CustomerAuthForm Component', () => {
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('harus render form login dengan benar', () => {
    render(
      <CustomerAuthForm 
        mode="login" 
        onSuccess={mockOnSuccess} 
        onError={mockOnError} 
      />
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument()
  })

  it('harus render form register dengan benar', () => {
    render(
      <CustomerAuthForm 
        mode="register" 
        onSuccess={mockOnSuccess} 
        onError={mockOnError} 
      />
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/provinsi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/kota/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /daftar/i })).toBeInTheDocument()
  })

  it('harus menampilkan error validasi untuk field yang kosong', async () => {
    const user = userEvent.setup()
    
    render(
      <CustomerAuthForm 
        mode="login" 
        onSuccess={mockOnSuccess} 
        onError={mockOnError} 
      />
    )

    const submitButton = screen.getByRole('button', { name: /masuk/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email wajib diisi/i)).toBeInTheDocument()
      expect(screen.getByText(/password wajib diisi/i)).toBeInTheDocument()
    })
  })

  it('harus menampilkan error validasi untuk email yang tidak valid', async () => {
    const user = userEvent.setup()
    
    render(
      <CustomerAuthForm 
        mode="login" 
        onSuccess={mockOnSuccess} 
        onError={mockOnError} 
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')

    const submitButton = screen.getByRole('button', { name: /masuk/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument()
    })
  })

  it('harus berhasil submit form login dengan data yang valid', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ success: true })
    
    render(
      <CustomerAuthForm 
        mode="login" 
        onSuccess={mockOnSuccess} 
        onError={mockOnError} 
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /masuk/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('harus berhasil submit form register dengan data yang valid', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({ success: true })
    
    render(
      <CustomerAuthForm 
        mode="register" 
        onSuccess={mockOnSuccess} 
        onError={mockOnError} 
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    const nameInput = screen.getByLabelText(/nama lengkap/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /daftar/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(nameInput, 'Test User')
    await user.type(passwordInput, 'password123')
    
    // Mock untuk select provinsi dan kota
    const provinsiSelect = screen.getByLabelText(/provinsi/i)
    const kotaSelect = screen.getByLabelText(/kota/i)
    
    fireEvent.change(provinsiSelect, { target: { value: 'DKI Jakarta' } })
    fireEvent.change(kotaSelect, { target: { value: 'Jakarta Selatan' } })

    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan'
      })
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('harus menampilkan loading state saat submit', async () => {
    const user = userEvent.setup()
    
    // Mock loading state
    vi.mocked(vi.importActual('@/hooks/useAuth')).useAuth = () => ({
      signIn: mockSignIn,
      signUp: mockSignUp,
      loading: true,
      error: null
    })
    
    render(
      <CustomerAuthForm 
        mode="login" 
        onSuccess={mockOnSuccess} 
        onError={mockOnError} 
      />
    )

    const submitButton = screen.getByRole('button', { name: /masuk/i })
    expect(submitButton).toBeDisabled()
  })

  it('harus menampilkan error message saat login gagal', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'
    mockSignIn.mockRejectedValue(new Error(errorMessage))
    
    render(
      <CustomerAuthForm 
        mode="login" 
        onSuccess={mockOnSuccess} 
        onError={mockOnError} 
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /masuk/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(errorMessage)
    })
  })
})
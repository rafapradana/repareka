import { test, expect } from '@playwright/test'

test.describe('Authentication Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Customer Authentication', () => {
    test('should complete customer registration flow', async ({ page }) => {
      // Click login button
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Should open auth modal
      await expect(page.getByText('Masuk ke Akun')).toBeVisible()
      
      // Switch to register tab
      await page.getByText('Daftar').click()
      
      // Fill registration form
      await page.getByLabel(/email/i).fill('customer@test.com')
      await page.getByLabel(/nama lengkap/i).fill('Test Customer')
      await page.getByLabel(/password/i).fill('password123')
      
      // Select province
      const provinceSelect = page.locator('select[name="province"]')
      await provinceSelect.selectOption('DKI Jakarta')
      
      // Select city
      const citySelect = page.locator('select[name="city"]')
      await citySelect.selectOption('Jakarta Selatan')
      
      // Submit registration
      await page.getByRole('button', { name: /daftar/i }).click()
      
      // Should show success message or redirect
      await expect(page.getByText(/berhasil/i)).toBeVisible({ timeout: 10000 })
    })

    test('should complete customer login flow', async ({ page }) => {
      // Click login button
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Fill login form
      await page.getByLabel(/email/i).fill('existing@customer.com')
      await page.getByLabel(/password/i).fill('password123')
      
      // Submit login
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Should redirect to homepage as authenticated user
      await expect(page.getByText(/selamat datang/i)).toBeVisible({ timeout: 10000 })
      
      // Should show user menu instead of login button
      await expect(page.getByRole('button', { name: /profil/i })).toBeVisible()
    })

    test('should handle customer login validation errors', async ({ page }) => {
      // Click login button
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Submit without filling form
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Should show validation errors
      await expect(page.getByText(/email wajib diisi/i)).toBeVisible()
      await expect(page.getByText(/password wajib diisi/i)).toBeVisible()
    })

    test('should handle invalid customer credentials', async ({ page }) => {
      // Click login button
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Fill with invalid credentials
      await page.getByLabel(/email/i).fill('invalid@test.com')
      await page.getByLabel(/password/i).fill('wrongpassword')
      
      // Submit login
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Should show error message
      await expect(page.getByText(/kredensial tidak valid/i)).toBeVisible()
    })

    test('should validate email format in registration', async ({ page }) => {
      // Click login button
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Switch to register tab
      await page.getByText('Daftar').click()
      
      // Fill with invalid email
      await page.getByLabel(/email/i).fill('invalid-email')
      await page.getByLabel(/nama lengkap/i).fill('Test User')
      await page.getByLabel(/password/i).fill('password123')
      
      // Submit registration
      await page.getByRole('button', { name: /daftar/i }).click()
      
      // Should show email validation error
      await expect(page.getByText(/format email tidak valid/i)).toBeVisible()
    })

    test('should validate password strength', async ({ page }) => {
      // Click login button
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Switch to register tab
      await page.getByText('Daftar').click()
      
      // Fill with weak password
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByLabel(/nama lengkap/i).fill('Test User')
      await page.getByLabel(/password/i).fill('123')
      
      // Submit registration
      await page.getByRole('button', { name: /daftar/i }).click()
      
      // Should show password validation error
      await expect(page.getByText(/password minimal 6 karakter/i)).toBeVisible()
    })
  })

  test.describe('Mitra Authentication', () => {
    test('should navigate to mitra auth page', async ({ page }) => {
      // Navigate to mitra page
      await page.goto('/mitra')
      
      // Should show mitra auth page
      await expect(page.getByText('Bergabung sebagai Mitra')).toBeVisible()
      await expect(page.getByText('Daftar sebagai Mitra')).toBeVisible()
    })

    test('should complete mitra registration flow', async ({ page }) => {
      // Navigate to mitra page
      await page.goto('/mitra')
      
      // Switch to register tab if needed
      await page.getByText('Daftar').click()
      
      // Fill registration form
      await page.getByLabel(/email bisnis/i).fill('mitra@test.com')
      await page.getByLabel(/nama bisnis/i).fill('Test Mitra Business')
      await page.getByLabel(/nomor telepon/i).fill('081234567890')
      await page.getByLabel(/password/i).fill('password123')
      await page.getByLabel(/alamat/i).fill('Jl. Test No. 123, Jakarta')
      
      // Select province
      const provinceSelect = page.locator('select[name="province"]')
      await provinceSelect.selectOption('DKI Jakarta')
      
      // Select city
      const citySelect = page.locator('select[name="city"]')
      await citySelect.selectOption('Jakarta Selatan')
      
      // Select business type
      const businessTypeSelect = page.locator('select[name="businessType"]')
      await businessTypeSelect.selectOption('individual')
      
      // Submit registration
      await page.getByRole('button', { name: /daftar sebagai mitra/i }).click()
      
      // Should show success message
      await expect(page.getByText(/pendaftaran berhasil/i)).toBeVisible({ timeout: 10000 })
      await expect(page.getByText(/menunggu verifikasi/i)).toBeVisible()
    })

    test('should complete mitra login flow', async ({ page }) => {
      // Navigate to mitra page
      await page.goto('/mitra')
      
      // Fill login form
      await page.getByLabel(/email/i).fill('verified@mitra.com')
      await page.getByLabel(/password/i).fill('password123')
      
      // Submit login
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Should redirect to mitra dashboard
      await expect(page.getByText('Dashboard Mitra')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('Pesanan Baru')).toBeVisible()
      await expect(page.getByText('Total Pendapatan')).toBeVisible()
    })

    test('should handle unverified mitra login', async ({ page }) => {
      // Navigate to mitra page
      await page.goto('/mitra')
      
      // Fill login form with unverified account
      await page.getByLabel(/email/i).fill('unverified@mitra.com')
      await page.getByLabel(/password/i).fill('password123')
      
      // Submit login
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Should show verification pending message
      await expect(page.getByText(/akun sedang dalam proses verifikasi/i)).toBeVisible()
    })

    test('should validate business information in registration', async ({ page }) => {
      // Navigate to mitra page
      await page.goto('/mitra')
      
      // Switch to register tab
      await page.getByText('Daftar').click()
      
      // Submit without filling required fields
      await page.getByRole('button', { name: /daftar sebagai mitra/i }).click()
      
      // Should show validation errors
      await expect(page.getByText(/email bisnis wajib diisi/i)).toBeVisible()
      await expect(page.getByText(/nama bisnis wajib diisi/i)).toBeVisible()
      await expect(page.getByText(/nomor telepon wajib diisi/i)).toBeVisible()
    })

    test('should validate phone number format', async ({ page }) => {
      // Navigate to mitra page
      await page.goto('/mitra')
      
      // Switch to register tab
      await page.getByText('Daftar').click()
      
      // Fill with invalid phone number
      await page.getByLabel(/email bisnis/i).fill('mitra@test.com')
      await page.getByLabel(/nama bisnis/i).fill('Test Mitra')
      await page.getByLabel(/nomor telepon/i).fill('123')
      await page.getByLabel(/password/i).fill('password123')
      
      // Submit registration
      await page.getByRole('button', { name: /daftar sebagai mitra/i }).click()
      
      // Should show phone validation error
      await expect(page.getByText(/format nomor telepon tidak valid/i)).toBeVisible()
    })
  })

  test.describe('Role-based Routing', () => {
    test('should redirect customer to homepage after login', async ({ page }) => {
      // Login as customer
      await page.getByRole('button', { name: /masuk/i }).click()
      await page.getByLabel(/email/i).fill('customer@test.com')
      await page.getByLabel(/password/i).fill('password123')
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Should stay on homepage
      await expect(page).toHaveURL('/')
      await expect(page.getByText('Layanan Terpopuler')).toBeVisible()
    })

    test('should redirect mitra to dashboard after login', async ({ page }) => {
      // Navigate to mitra page and login
      await page.goto('/mitra')
      await page.getByLabel(/email/i).fill('mitra@test.com')
      await page.getByLabel(/password/i).fill('password123')
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Should redirect to mitra dashboard
      await expect(page).toHaveURL('/mitra/dashboard')
      await expect(page.getByText('Dashboard Mitra')).toBeVisible()
    })

    test('should redirect mitra from customer pages to dashboard', async ({ page }) => {
      // Login as mitra first
      await page.goto('/mitra')
      await page.getByLabel(/email/i).fill('mitra@test.com')
      await page.getByLabel(/password/i).fill('password123')
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Try to access homepage
      await page.goto('/')
      
      // Should redirect to mitra dashboard
      await expect(page).toHaveURL('/mitra/dashboard')
    })
  })

  test.describe('Logout Flow', () => {
    test('should logout customer successfully', async ({ page }) => {
      // Login as customer first
      await page.getByRole('button', { name: /masuk/i }).click()
      await page.getByLabel(/email/i).fill('customer@test.com')
      await page.getByLabel(/password/i).fill('password123')
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Wait for login to complete
      await expect(page.getByRole('button', { name: /profil/i })).toBeVisible()
      
      // Click profile menu
      await page.getByRole('button', { name: /profil/i }).click()
      
      // Click logout
      await page.getByText('Keluar').click()
      
      // Should return to guest state
      await expect(page.getByRole('button', { name: /masuk/i })).toBeVisible()
    })

    test('should logout mitra successfully', async ({ page }) => {
      // Login as mitra first
      await page.goto('/mitra')
      await page.getByLabel(/email/i).fill('mitra@test.com')
      await page.getByLabel(/password/i).fill('password123')
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Wait for dashboard to load
      await expect(page.getByText('Dashboard Mitra')).toBeVisible()
      
      // Click profile menu
      await page.getByRole('button', { name: /profil/i }).click()
      
      // Click logout
      await page.getByText('Keluar').click()
      
      // Should redirect to mitra login page
      await expect(page).toHaveURL('/mitra')
      await expect(page.getByText('Masuk sebagai Mitra')).toBeVisible()
    })
  })

  test.describe('Guest Mode Restrictions', () => {
    test('should show login prompt when guest tries to book service', async ({ page }) => {
      // Wait for services to load
      await page.waitForSelector('[data-testid="service-card"]')
      
      // Click on a service card
      const firstCard = page.locator('[data-testid="service-card"]').first()
      await firstCard.click()
      
      // Should show login prompt modal
      await expect(page.getByText('Silakan login untuk melakukan booking')).toBeVisible()
      await expect(page.getByText('Login untuk melanjutkan')).toBeVisible()
    })

    test('should redirect to login when clicking login prompt', async ({ page }) => {
      // Trigger login prompt (implementation depends on your guest restrictions)
      await page.waitForSelector('[data-testid="service-card"]')
      const firstCard = page.locator('[data-testid="service-card"]').first()
      await firstCard.click()
      
      // Click login prompt
      await page.getByText('Login untuk melanjutkan').click()
      
      // Should open login modal
      await expect(page.getByText('Masuk ke Akun')).toBeVisible()
    })
  })

  test.describe('Form Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Click login button
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Tab through form elements
      await page.keyboard.press('Tab') // Email field
      await expect(page.getByLabel(/email/i)).toBeFocused()
      
      await page.keyboard.press('Tab') // Password field
      await expect(page.getByLabel(/password/i)).toBeFocused()
      
      await page.keyboard.press('Tab') // Submit button
      await expect(page.getByRole('button', { name: /masuk/i })).toBeFocused()
    })

    test('should have proper ARIA labels', async ({ page }) => {
      // Click login button
      await page.getByRole('button', { name: /masuk/i }).click()
      
      // Check ARIA labels
      const emailInput = page.getByLabel(/email/i)
      await expect(emailInput).toHaveAttribute('aria-label')
      
      const passwordInput = page.getByLabel(/password/i)
      await expect(passwordInput).toHaveAttribute('aria-label')
    })
  })
})
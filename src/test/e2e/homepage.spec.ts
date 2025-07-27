import { test, expect } from '@playwright/test'

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage with all essential elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Repareka/)

    // Check header elements
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByRole('link', { name: /repareka/i })).toBeVisible()
    await expect(page.getByPlaceholder('Cari layanan reparasi')).toBeVisible()
    await expect(page.getByRole('button', { name: /masuk/i })).toBeVisible()

    // Check main content sections
    await expect(page.getByText('Promo Hari Ini')).toBeVisible()
    await expect(page.getByText('Layanan Terpopuler')).toBeVisible()

    // Check footer
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should display service categories', async ({ page }) => {
    // Wait for categories to load
    await page.waitForSelector('[data-testid="category-navigation"]', { timeout: 10000 })

    // Check if categories are displayed
    const categories = ['Pakaian', 'Sepatu', 'Elektronik', 'Furniture', 'Jam/Aksesoris', 'Tas']
    
    for (const category of categories) {
      await expect(page.getByText(category)).toBeVisible()
    }
  })

  test('should display service grid with cards', async ({ page }) => {
    // Wait for services to load
    await page.waitForSelector('[data-testid="service-grid"]', { timeout: 10000 })

    // Check if service cards are displayed
    const serviceCards = page.locator('[data-testid="service-card"]')
    await expect(serviceCards.first()).toBeVisible()

    // Check service card content
    const firstCard = serviceCards.first()
    await expect(firstCard.locator('img')).toBeVisible()
    await expect(firstCard.locator('h3')).toBeVisible()
    await expect(firstCard.getByText('Pesan Sekarang')).toBeVisible()
  })

  test('should perform search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Cari layanan reparasi')
    
    // Type search query
    await searchInput.fill('sepatu')
    
    // Wait for search results
    await page.waitForTimeout(500) // Wait for debounce
    
    // Check if search results are displayed
    await expect(page.getByText('Hasil pencarian "sepatu"')).toBeVisible()
    
    // Clear search
    await searchInput.clear()
    await page.waitForTimeout(500)
    
    // Should return to default view
    await expect(page.getByText('Layanan Terpopuler')).toBeVisible()
  })

  test('should show search suggestions when focused', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Cari layanan reparasi')
    
    // Focus and type in search
    await searchInput.click()
    await searchInput.fill('sepatu')
    
    // Check if suggestions appear
    await expect(page.getByText('Pencarian populer:')).toBeVisible()
    await expect(page.getByText('Reparasi sepatu kulit')).toBeVisible()
    
    // Click on suggestion
    await page.getByText('Reparasi sepatu kulit').click()
    
    // Should update search input
    await expect(searchInput).toHaveValue('Reparasi sepatu kulit')
  })

  test('should filter by category', async ({ page }) => {
    // Wait for categories to load
    await page.waitForSelector('[data-testid="category-navigation"]')
    
    // Click on a category
    await page.getByText('Sepatu').click()
    
    // Wait for filtered results
    await page.waitForTimeout(1000)
    
    // Check if URL contains category filter
    expect(page.url()).toContain('category=')
    
    // Check if services are filtered
    const serviceCards = page.locator('[data-testid="service-card"]')
    await expect(serviceCards.first()).toBeVisible()
  })

  test('should open and use desktop filters', async ({ page }) => {
    // Check if desktop filters are visible (on larger screens)
    await page.setViewportSize({ width: 1200, height: 800 })
    
    // Check filter sections
    await expect(page.getByText('Kategori')).toBeVisible()
    await expect(page.getByText('Provinsi')).toBeVisible()
    await expect(page.getByText('Rentang Harga')).toBeVisible()
    
    // Use category filter
    const categorySelect = page.locator('select').filter({ hasText: 'Semua Kategori' })
    await categorySelect.selectOption({ label: '👟 Sepatu' })
    
    // Use province filter
    const provinceSelect = page.locator('select').filter({ hasText: 'Semua Provinsi' })
    await provinceSelect.selectOption('DKI Jakarta')
    
    // Wait for filtered results
    await page.waitForTimeout(1000)
    
    // Check if filters are applied
    expect(page.url()).toContain('category=')
    expect(page.url()).toContain('province=')
  })

  test('should handle mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile navigation
    const mobileMenuButton = page.getByRole('button', { name: /menu/i })
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      await expect(page.getByRole('navigation')).toBeVisible()
    }
    
    // Check mobile filter button
    await expect(page.getByText('Filter')).toBeVisible()
    
    // Open mobile filters
    await page.getByText('Filter').click()
    
    // Check if bottom sheet opens
    await expect(page.getByText('Filter Layanan')).toBeVisible()
    
    // Close filters
    await page.getByText('Terapkan Filter').click()
  })

  test('should handle infinite scroll', async ({ page }) => {
    // Wait for initial services to load
    await page.waitForSelector('[data-testid="service-grid"]')
    
    // Get initial service count
    const initialCards = await page.locator('[data-testid="service-card"]').count()
    
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    // Wait for more services to load
    await page.waitForTimeout(2000)
    
    // Check if more services loaded
    const newCards = await page.locator('[data-testid="service-card"]').count()
    expect(newCards).toBeGreaterThan(initialCards)
  })

  test('should show empty state when no results found', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Cari layanan reparasi')
    
    // Search for something that doesn't exist
    await searchInput.fill('xyz123nonexistent')
    
    // Wait for search results
    await page.waitForTimeout(1000)
    
    // Check if empty state is shown
    await expect(page.getByText('Tidak ada layanan yang ditemukan')).toBeVisible()
  })

  test('should handle service card interactions', async ({ page }) => {
    // Wait for services to load
    await page.waitForSelector('[data-testid="service-card"]')
    
    const firstCard = page.locator('[data-testid="service-card"]').first()
    
    // Hover over card (desktop only)
    if (await page.viewportSize()?.width! > 768) {
      await firstCard.hover()
      // Card should have hover effects
    }
    
    // Click on service card
    await firstCard.click()
    
    // Should navigate to service detail or show modal
    // (This depends on your implementation)
  })

  test('should show promo banner', async ({ page }) => {
    // Check if promo banner is visible
    await expect(page.getByText('Promo Hari Ini')).toBeVisible()
    await expect(page.getByText('Diskon hingga 30%')).toBeVisible()
    
    // Check promo button
    const promoButton = page.getByText('Lihat Promo')
    await expect(promoButton).toBeVisible()
    
    // Click promo button
    await promoButton.click()
    // Should handle promo action
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/services*', route => {
      route.abort('failed')
    })
    
    // Reload page
    await page.reload()
    
    // Should show error state
    await expect(page.getByText('Terjadi Kesalahan')).toBeVisible()
    await expect(page.getByText('Coba Lagi')).toBeVisible()
    
    // Click retry button
    await page.unroute('**/api/services*')
    await page.getByText('Coba Lagi').click()
    
    // Should recover and show services
    await page.waitForSelector('[data-testid="service-grid"]')
  })

  test('should maintain filter state in URL', async ({ page }) => {
    // Apply filters
    await page.getByText('Sepatu').click()
    
    const searchInput = page.getByPlaceholder('Cari layanan reparasi')
    await searchInput.fill('reparasi')
    
    // Wait for filters to apply
    await page.waitForTimeout(1000)
    
    // Check URL contains filters
    const url = page.url()
    expect(url).toContain('category=')
    expect(url).toContain('search=')
    
    // Refresh page
    await page.reload()
    
    // Filters should be maintained
    await expect(searchInput).toHaveValue('reparasi')
    // Category should still be selected (visual check would depend on implementation)
  })
})
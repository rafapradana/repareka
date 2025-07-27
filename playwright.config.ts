import { defineConfig, devices } from '@playwright/test'

/**
 * Konfigurasi Playwright untuk E2E testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/test/e2e',
  /* Jalankan tests secara paralel */
  fullyParallel: true,
  /* Gagal build jika ada test yang gagal di CI */
  forbidOnly: !!process.env.CI,
  /* Retry di CI saja */
  retries: process.env.CI ? 2 : 0,
  /* Opt out dari parallel tests di CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter untuk hasil test */
  reporter: 'html',
  /* Shared settings untuk semua projects */
  use: {
    /* Base URL untuk testing */
    baseURL: 'http://localhost:3000',
    /* Collect trace saat retry */
    trace: 'on-first-retry',
    /* Screenshot saat failure */
    screenshot: 'only-on-failure',
  },

  /* Konfigurasi untuk berbagai browser */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test di mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Jalankan dev server sebelum testing */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
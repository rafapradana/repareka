import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'

// Setup untuk testing environment
beforeAll(() => {
  // Mock untuk Next.js router
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// Cleanup setelah setiap test
afterEach(() => {
  cleanup()
})
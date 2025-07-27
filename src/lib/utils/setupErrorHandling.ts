'use client';

import { setupGlobalErrorHandler } from './errorHandler';

/**
 * Setup global error handling untuk aplikasi
 * Harus dipanggil di client-side saja
 */
export function initializeErrorHandling() {
  if (typeof window !== 'undefined') {
    setupGlobalErrorHandler();
  }
}

/**
 * Component untuk initialize error handling
 */
export function ErrorHandlingInitializer() {
  if (typeof window !== 'undefined') {
    setupGlobalErrorHandler();
  }
  
  return null;
}
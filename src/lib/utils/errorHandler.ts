/**
 * Utility functions untuk error handling dan classification
 */

export type ErrorType = 
  | 'network'
  | 'auth'
  | 'validation'
  | 'server'
  | 'client'
  | 'unknown';

export interface ClassifiedError {
  type: ErrorType;
  message: string;
  originalError: Error;
  isRetryable: boolean;
  statusCode?: number;
}

/**
 * Mengklasifikasikan error berdasarkan tipe dan karakteristiknya
 */
export function classifyError(error: Error | any): ClassifiedError {
  // Network errors
  if (error.name === 'NetworkError' || error.name === 'TypeError') {
    return {
      type: 'network',
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      originalError: error,
      isRetryable: true
    };
  }

  // Fetch API errors
  if (error.name === 'AbortError') {
    return {
      type: 'network',
      message: 'Permintaan dibatalkan atau timeout.',
      originalError: error,
      isRetryable: true
    };
  }

  // HTTP errors dengan status code
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    
    if (status >= 400 && status < 500) {
      // Client errors
      if (status === 401) {
        return {
          type: 'auth',
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          originalError: error,
          isRetryable: false,
          statusCode: status
        };
      }
      
      if (status === 403) {
        return {
          type: 'auth',
          message: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
          originalError: error,
          isRetryable: false,
          statusCode: status
        };
      }
      
      if (status === 422) {
        return {
          type: 'validation',
          message: 'Data yang dikirim tidak valid. Periksa kembali input Anda.',
          originalError: error,
          isRetryable: false,
          statusCode: status
        };
      }
      
      return {
        type: 'client',
        message: error.message || 'Terjadi kesalahan pada permintaan Anda.',
        originalError: error,
        isRetryable: false,
        statusCode: status
      };
    }
    
    if (status >= 500) {
      // Server errors
      return {
        type: 'server',
        message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
        originalError: error,
        isRetryable: true,
        statusCode: status
      };
    }
  }

  // Supabase specific errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return {
          type: 'auth',
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          originalError: error,
          isRetryable: false
        };
      case 'PGRST301':
        return {
          type: 'validation',
          message: 'Data yang dikirim tidak valid.',
          originalError: error,
          isRetryable: false
        };
      default:
        return {
          type: 'server',
          message: error.message || 'Terjadi kesalahan pada database.',
          originalError: error,
          isRetryable: true
        };
    }
  }

  // Validation errors
  if (error.name === 'ValidationError' || error.name === 'ZodError') {
    return {
      type: 'validation',
      message: 'Data yang dimasukkan tidak valid. Periksa kembali form Anda.',
      originalError: error,
      isRetryable: false
    };
  }

  // Default unknown error
  return {
    type: 'unknown',
    message: error.message || 'Terjadi kesalahan yang tidak terduga.',
    originalError: error,
    isRetryable: false
  };
}

/**
 * Mengecek apakah error dapat di-retry
 */
export function isRetryableError(error: Error | any): boolean {
  const classified = classifyError(error);
  return classified.isRetryable;
}

/**
 * Mendapatkan user-friendly message dari error
 */
export function getErrorMessage(error: Error | any): string {
  const classified = classifyError(error);
  return classified.message;
}

/**
 * Mengecek apakah sedang offline
 */
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

/**
 * Error handler untuk API calls
 */
export async function handleApiError(error: Error | any): Promise<never> {
  const classified = classifyError(error);
  
  // Log error untuk debugging
  console.error('API Error:', {
    type: classified.type,
    message: classified.message,
    statusCode: classified.statusCode,
    originalError: classified.originalError
  });

  // Throw classified error
  const enhancedError = new Error(classified.message);
  (enhancedError as any).type = classified.type;
  (enhancedError as any).isRetryable = classified.isRetryable;
  (enhancedError as any).statusCode = classified.statusCode;
  (enhancedError as any).originalError = classified.originalError;

  throw enhancedError;
}

/**
 * Wrapper untuk fetch dengan error handling
 */
export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    // Tambahkan timeout default
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 detik timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      (error as any).status = response.status;
      (error as any).statusText = response.statusText;
      throw error;
    }

    return response;
  } catch (error) {
    await handleApiError(error);
  }
}

/**
 * Global error handler untuk unhandled errors
 */
export function setupGlobalErrorHandler() {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      const classified = classifyError(event.reason);
      
      // Prevent default browser behavior untuk network errors
      if (classified.type === 'network') {
        event.preventDefault();
      }
    });

    // Handle general errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      
      const classified = classifyError(event.error);
      
      // Log ke monitoring service jika ada
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to monitoring service
      }
    });
  }
}

/**
 * Error boundary error handler
 */
export function handleErrorBoundaryError(error: Error, errorInfo: any) {
  console.error('Error Boundary caught error:', error, errorInfo);
  
  // Log ke monitoring service jika ada
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to monitoring service
  }
}

/**
 * Utility untuk membuat error dengan metadata
 */
export function createError(
  message: string,
  type: ErrorType = 'unknown',
  statusCode?: number,
  isRetryable: boolean = false
): Error {
  const error = new Error(message);
  (error as any).type = type;
  (error as any).statusCode = statusCode;
  (error as any).isRetryable = isRetryable;
  return error;
}
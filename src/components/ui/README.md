# Error Handling dan Loading States Components

Dokumentasi untuk komponen-komponen error handling dan loading states yang telah diimplementasikan.

## Komponen Utama

### 1. ErrorBoundary
Komponen untuk menangani error secara graceful di level component tree.

```tsx
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => console.log(error)}
>
  <YourComponent />
</ErrorBoundary>
```

### 2. ErrorFallback
Komponen fallback UI untuk berbagai jenis error.

```tsx
import { ErrorFallback, NetworkErrorFallback, AuthErrorFallback } from '@/components/ui/ErrorFallback'

// General error
<ErrorFallback error={error} resetError={resetError} />

// Network error
<NetworkErrorFallback resetError={resetError} />

// Auth error
<AuthErrorFallback resetError={resetError} />
```

### 3. LoadingSkeleton
Komponen skeleton untuk loading states.

```tsx
import { 
  ServiceCardSkeleton, 
  ServiceGridSkeleton, 
  AuthFormSkeleton,
  DashboardSkeleton 
} from '@/components/ui/LoadingSkeleton'

// Service grid skeleton
<ServiceGridSkeleton count={8} />

// Auth form skeleton
<AuthFormSkeleton />
```

### 4. Toast Notifications
Sistem notifikasi untuk success dan error messages.

```tsx
import { useToast, ToastProvider } from '@/components/ui/Toast'

// Di root layout
<ToastProvider>
  <App />
</ToastProvider>

// Di component
const { addToast } = useToast()

addToast({
  type: 'success',
  title: 'Berhasil',
  message: 'Data telah disimpan'
})
```

### 5. ErrorState
Komponen untuk menampilkan error state dengan retry functionality.

```tsx
import { ErrorState, LoadingWithError } from '@/components/ui/ErrorState'

// Error state dengan retry
<ErrorState 
  error={error} 
  onRetry={handleRetry}
  size="md"
/>

// Loading dengan error fallback
<LoadingWithError
  isLoading={loading}
  error={error}
  onRetry={handleRetry}
>
  <YourContent />
</LoadingWithError>
```

## Hooks

### 1. useRetry
Hook untuk retry mechanism dengan exponential backoff.

```tsx
import { useRetry, useApiRetry } from '@/hooks/useRetry'

const { execute, retry, isLoading, error, canRetry } = useRetry(
  async () => {
    // Your async function
  },
  {
    maxAttempts: 3,
    delay: 1000,
    onRetry: (attempt, error) => console.log(`Retry ${attempt}`)
  }
)
```

### 2. useNetworkStatus
Hook untuk monitoring network status.

```tsx
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

const { isOnline, isSlowConnection, connectionType } = useNetworkStatus()
```

## Utilities

### 1. Error Handler
Utility functions untuk error classification dan handling.

```tsx
import { 
  classifyError, 
  isRetryableError, 
  getErrorMessage,
  fetchWithErrorHandling 
} from '@/lib/utils/errorHandler'

// Classify error
const classified = classifyError(error)
console.log(classified.type) // 'network' | 'auth' | 'validation' | 'server' | 'client' | 'unknown'

// Check if retryable
const canRetry = isRetryableError(error)

// Get user-friendly message
const message = getErrorMessage(error)

// Fetch dengan error handling
const response = await fetchWithErrorHandling('/api/data')
```

## Implementasi di Components

### Enhanced Service Grid
```tsx
import { ServiceGrid } from '@/components/services/ServiceGrid'

<ServiceGrid
  services={services}
  loading={loading}
  error={error}
  onLoadMore={handleLoadMore}
  onRetry={handleRetry}
  hasMore={hasMore}
/>
```

### Enhanced Auth Forms
```tsx
import { CustomerAuthForm } from '@/components/auth/CustomerAuthForm'

<CustomerAuthForm
  mode="login"
  onSuccess={() => console.log('Success')}
  onError={(error) => console.log('Error:', error)}
/>
```

### Enhanced Homepage
```tsx
import { EnhancedHomepage } from '@/components/homepage/EnhancedHomepage'

<EnhancedHomepage />
```

## Best Practices

1. **Selalu gunakan ErrorBoundary** untuk component yang mungkin error
2. **Implementasikan loading states** untuk semua async operations
3. **Berikan feedback yang jelas** kepada user tentang status operasi
4. **Gunakan retry mechanism** untuk network-related errors
5. **Monitor network status** dan disable actions saat offline
6. **Classify errors** untuk memberikan pesan yang tepat
7. **Log errors** untuk debugging dan monitoring

## Error Types

- **network**: Masalah koneksi internet
- **auth**: Masalah autentikasi/autorisasi
- **validation**: Error validasi data
- **server**: Error dari server (5xx)
- **client**: Error dari client (4xx)
- **unknown**: Error yang tidak dapat diklasifikasi

## Toast Types

- **success**: Operasi berhasil
- **error**: Operasi gagal
- **warning**: Peringatan
- **info**: Informasi

## Network Status

- **isOnline**: Status koneksi internet
- **isSlowConnection**: Deteksi koneksi lambat
- **connectionType**: Jenis koneksi (wifi, cellular, etc.)
- **effectiveType**: Kecepatan efektif (4g, 3g, 2g, slow-2g)
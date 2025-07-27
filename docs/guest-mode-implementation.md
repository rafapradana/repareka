# Guest Mode Implementation

## Overview

Implementasi guest mode dan access restrictions untuk platform Repareka sesuai dengan requirements 6.1-6.6. Sistem ini memungkinkan pengguna untuk browse homepage dan melihat profil UMKM tanpa login, namun dengan akses terbatas untuk fitur-fitur tertentu.

## Features Implemented

### 1. Guest Browsing Functionality (Requirement 6.1)
- ✅ Guest dapat mengakses homepage tanpa batasan
- ✅ Dapat melihat semua layanan yang tersedia
- ✅ Dapat menggunakan search dan filter
- ✅ Guest banner untuk mendorong registrasi

### 2. Read-only Profile Access (Requirement 6.2)
- ✅ Guest dapat melihat profil UMKM dalam mode read-only
- ✅ Menampilkan informasi bisnis, layanan, dan kontak
- ✅ Tidak dapat mengakses fitur interaktif

### 3. Login Prompts untuk Fitur Terbatas (Requirement 6.3, 6.4, 6.5)
- ✅ Modal prompt saat mencoba booking
- ✅ Modal prompt saat mencoba chat
- ✅ Modal prompt saat mencoba memberikan review
- ✅ Modal prompt saat mencoba menyimpan favorit
- ✅ User type selection dalam modal

### 4. Redirect Logic dengan Return URL (Requirement 6.6)
- ✅ Menyimpan current URL untuk redirect setelah login
- ✅ URL validation untuk keamanan
- ✅ Role-based redirect setelah authentication
- ✅ URL parameter handling

## Components

### Core Components

#### `AuthGuard`
```typescript
// Melindungi route yang memerlukan authentication
<AuthGuard requiredRole="customer">
  <ProtectedContent />
</AuthGuard>
```

#### `LoginPromptModal`
```typescript
// Modal untuk prompting login dengan user type selection
<LoginPromptModal
  isOpen={showModal}
  onClose={closeModal}
  title="Login Diperlukan"
  message="Silakan login untuk melakukan booking"
  preferredUserType="customer"
/>
```

#### `GuestModeWrapper`
```typescript
// Wrapper untuk homepage dengan guest functionality
<GuestModeWrapper showGuestBanner={true}>
  <HomepageContent />
</GuestModeWrapper>
```

### Service Components

#### `ServiceCardGuest`
- Service card dengan guest access restrictions
- Menampilkan login prompt saat akses fitur terbatas
- Guest mode indicator

#### `ServiceProfileReadOnly`
- Profil UMKM dalam mode read-only untuk guest
- Menampilkan informasi lengkap tanpa fitur interaktif
- Login prompt untuk fitur yang memerlukan auth

### UI Components

#### `GuestBanner`
- Banner untuk mendorong guest registrasi
- Quick access ke login customer dan mitra
- Dapat di-dismiss oleh user

#### `GuestEmptyState`
- Empty state yang guest-friendly
- Menampilkan call-to-action untuk registrasi
- Berbeda untuk guest vs authenticated users

## Hooks

### `useGuestAccess`
```typescript
const {
  isAuthenticated,
  showLoginPrompt,
  requireAuthForBooking,
  requireAuthForChat,
  requireAuthForReview,
  requireAuthForFavorite,
  closeLoginPrompt
} = useGuestAccess()
```

### `useFeatureAccess`
```typescript
const {
  canBook,
  canChat,
  canReview,
  attemptBooking,
  attemptChat,
  getFeatureRestrictions
} = useFeatureAccess()
```

## Utilities

### Authentication Redirect
```typescript
import { 
  saveReturnUrl, 
  redirectToReturnUrl, 
  handlePostAuthRedirect 
} from '@/lib/auth/redirect'

// Simpan URL untuk redirect
saveReturnUrl('/services/123')

// Redirect setelah login
handlePostAuthRedirect('customer')
```

### Guest Session Tracking
```typescript
import { 
  trackServiceView, 
  trackSearchQuery, 
  getGuestAnalytics 
} from '@/lib/guest/session'

// Track guest behavior
trackServiceView('service-123')
trackSearchQuery('reparasi laptop')

// Get analytics
const analytics = getGuestAnalytics()
```

## Middleware Updates

Middleware telah diupdate untuk mendukung guest mode:

```typescript
// Redirect ke homepage dengan login prompt untuk protected routes
const redirectUrl = new URL('/', req.url)
redirectUrl.searchParams.set('login', 'true')
redirectUrl.searchParams.set('redirect', pathname)
```

## Usage Examples

### Homepage dengan Guest Mode
```typescript
import { HomepageGuest } from '@/components/homepage/HomepageGuest'

export default function HomePage() {
  return (
    <HomepageGuest
      services={services}
      loading={loading}
      onLoadMore={loadMore}
      hasMore={hasMore}
    />
  )
}
```

### Protected Route
```typescript
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function CustomerDashboard() {
  return (
    <AuthGuard requiredRole="customer">
      <DashboardContent />
    </AuthGuard>
  )
}
```

### Service Card dengan Guest Handling
```typescript
import { ServiceCardGuest } from '@/components/services/ServiceCardGuest'

function ServiceGrid({ services }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {services.map(service => (
        <ServiceCardGuest
          key={service.id}
          service={service}
          onViewProfile={handleViewProfile}
        />
      ))}
    </div>
  )
}
```

## Testing

### Development Test Panel
Komponen `GuestModeTest` tersedia untuk testing di development mode:

- Menampilkan auth status dan role
- Test feature access permissions
- Guest analytics tracking
- Manual trigger untuk login prompts

### Manual Testing Scenarios

1. **Guest Browsing**
   - Akses homepage tanpa login
   - Browse services dan gunakan search/filter
   - Verify guest banner muncul

2. **Feature Restrictions**
   - Klik tombol booking → should show login prompt
   - Klik tombol chat → should show login prompt
   - Klik tombol favorite → should show login prompt

3. **Profile Viewing**
   - Akses profil UMKM sebagai guest
   - Verify read-only mode
   - Test login prompts pada fitur interaktif

4. **Redirect Logic**
   - Akses protected route sebagai guest
   - Login dan verify redirect ke original URL
   - Test dengan berbagai user roles

## Security Considerations

1. **URL Validation**: Return URLs divalidasi untuk mencegah open redirect
2. **Session Management**: Guest session data disimpan di localStorage, tidak sensitive
3. **Route Protection**: Middleware memastikan proper access control
4. **XSS Prevention**: Semua user input di-sanitize

## Performance Optimizations

1. **Lazy Loading**: Modal components di-lazy load
2. **Session Storage**: Efficient guest session management
3. **Component Memoization**: Prevent unnecessary re-renders
4. **Bundle Splitting**: Guest-specific code dapat di-split

## Future Enhancements

1. **Analytics Integration**: Connect guest tracking dengan analytics service
2. **A/B Testing**: Test different login prompt strategies
3. **Personalization**: Customize experience berdasarkan guest behavior
4. **Progressive Enhancement**: Gradual feature unlock untuk engaged guests
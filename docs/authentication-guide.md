# Panduan Authentication System

## Overview

Authentication system Repareka menyediakan sistem autentikasi multi-role yang memisahkan akses antara customer dan mitra. Sistem ini menggunakan Supabase Auth sebagai backend dan menyediakan hooks, context, dan utilities yang mudah digunakan.

## Struktur File

```
src/
├── lib/
│   ├── supabase.ts              # Konfigurasi Supabase client
│   └── auth/
│       ├── index.ts             # Export semua auth utilities
│       ├── types.ts             # Type definitions
│       ├── utils.ts             # Auth utility functions
│       └── session.ts           # Session management
├── contexts/
│   └── AuthContext.tsx          # Auth context provider
├── hooks/
│   ├── useAuth.ts              # General auth hook
│   ├── useUser.ts              # Customer-specific hook
│   └── useMitra.ts             # Mitra-specific hook
├── components/
│   └── auth/
│       └── AuthGuard.tsx       # Route protection component
└── middleware.ts               # Route protection middleware
```

## Setup

### 1. Environment Variables

Buat file `.env.local` dengan konfigurasi Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Wrap App dengan AuthProvider

```tsx
// src/app/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## Penggunaan Hooks

### useAuth Hook

Hook utama untuk authentication:

```tsx
import { useAuth } from "@/lib/auth";

function MyComponent() {
  const {
    user,
    loading,
    error,
    isAuthenticated,
    isCustomer,
    isMitra,
    login,
    logout,
    registerAsCustomer,
    registerAsMitra,
  } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: "user@example.com", password: "password" });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {user?.email}!</div>;
}
```

### useUser Hook (Customer)

Hook khusus untuk customer:

```tsx
import { useUser } from "@/lib/auth";

function CustomerProfile() {
  const { user, loading, isCustomer, getFullName, getLocation, hasProfile } =
    useUser();

  if (!isCustomer || !hasProfile) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>{getFullName()}</h1>
      <p>
        Location: {getLocation()?.city}, {getLocation()?.province}
      </p>
    </div>
  );
}
```

### useMitra Hook

Hook khusus untuk mitra:

```tsx
import { useMitra } from "@/lib/auth";

function MitraDashboard() {
  const {
    mitra,
    loading,
    isMitra,
    isPending,
    isApproved,
    canAccessDashboard,
    getBusinessName,
  } = useMitra();

  if (!isMitra) {
    return <div>Access denied</div>;
  }

  if (isPending) {
    return <div>Akun sedang dalam proses verifikasi</div>;
  }

  if (!canAccessDashboard()) {
    return <div>Akun belum diverifikasi</div>;
  }

  return (
    <div>
      <h1>Dashboard {getBusinessName()}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

## Route Protection

### Menggunakan AuthGuard Component

```tsx
import { AuthGuard, CustomerGuard, MitraGuard } from "@/lib/auth";

// General auth protection
function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This page requires authentication</div>
    </AuthGuard>
  );
}

// Customer-only protection
function CustomerPage() {
  return (
    <CustomerGuard>
      <div>This page is for customers only</div>
    </CustomerGuard>
  );
}

// Mitra-only protection
function MitraPage() {
  return (
    <MitraGuard>
      <div>This page is for mitra only</div>
    </MitraGuard>
  );
}
```

### Menggunakan Higher-Order Component

```tsx
import { withAuthGuard } from "@/lib/auth";

const ProtectedComponent = withAuthGuard(
  function MyComponent() {
    return <div>Protected content</div>;
  },
  { requiredRole: "customer" }
);
```

### Middleware Protection

Middleware secara otomatis melindungi routes berdasarkan pattern:

- `/mitra/*` - Hanya untuk mitra
- `/customer/*` - Hanya untuk customer
- `/dashboard/*` - Memerlukan authentication

## Authentication Functions

### Login

```tsx
import { useAuth } from "@/lib/auth";

const { login } = useAuth();

await login({
  email: "user@example.com",
  password: "password",
});
```

### Register Customer

```tsx
import { useAuth } from "@/lib/auth";

const { registerAsCustomer } = useAuth();

await registerAsCustomer({
  email: "customer@example.com",
  fullName: "John Doe",
  password: "password",
  province: "DKI Jakarta",
  city: "Jakarta Selatan",
  phone: "08123456789",
});
```

### Register Mitra

```tsx
import { useAuth } from "@/lib/auth";

const { registerAsMitra } = useAuth();

await registerAsMitra({
  email: "mitra@example.com",
  businessName: "Toko Reparasi ABC",
  phone: "08123456789",
  password: "password",
  address: "Jl. Contoh No. 123",
  province: "DKI Jakarta",
  city: "Jakarta Selatan",
  businessType: "small_business",
});
```

### Logout

```tsx
import { useAuth } from "@/lib/auth";

const { logout } = useAuth();

await logout();
```

## Session Management

### Manual Session Control

```tsx
import {
  storeUserSession,
  getUserSession,
  clearUserSession,
  isSessionValid,
  refreshSessionActivity,
} from "@/lib/auth";

// Store session with remember me
storeUserSession(user, true);

// Get current session
const currentUser = getUserSession();

// Check if session is valid
if (isSessionValid()) {
  // Session is still valid
}

// Refresh activity timestamp
refreshSessionActivity();

// Clear session
clearUserSession();
```

### Session Monitoring

```tsx
import { setupSessionMonitoring } from "@/lib/auth";

// Setup automatic session monitoring
useEffect(() => {
  const cleanup = setupSessionMonitoring();
  return cleanup;
}, []);
```

## Error Handling

```tsx
import { useAuth } from "@/lib/auth";

function LoginForm() {
  const { login, error } = useAuth();
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (data) => {
    try {
      setLocalError("");
      await login(data);
    } catch (error) {
      setLocalError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {(error || localError) && (
        <div className="error">{error || localError}</div>
      )}
    </form>
  );
}
```

## Best Practices

1. **Selalu gunakan hooks** - Gunakan `useAuth`, `useUser`, atau `useMitra` untuk mengakses auth state
2. **Protect routes** - Gunakan `AuthGuard` atau middleware untuk melindungi routes
3. **Handle loading states** - Selalu handle loading state saat auth sedang diinisialisasi
4. **Error handling** - Implementasikan error handling yang proper
5. **Session management** - Gunakan session utilities untuk kontrol yang lebih baik
6. **Type safety** - Manfaatkan TypeScript types yang sudah disediakan

## Troubleshooting

### Common Issues

1. **"useAuthContext must be used within an AuthProvider"**

   - Pastikan component dibungkus dengan `AuthProvider`

2. **Infinite redirect loops**

   - Periksa konfigurasi middleware dan route patterns

3. **Session tidak persist**

   - Periksa environment variables Supabase
   - Pastikan cookies tidak diblokir browser

4. **Role tidak terdeteksi**
   - Pastikan user profile sudah dibuat di database
   - Periksa fungsi `determineUserRole`

'use client'

import { useState } from 'react'
import { useAuth, useUser, useMitra } from '@/lib/auth'
import { AuthGuard } from '@/lib/auth'

/**
 * Contoh penggunaan authentication system
 * File ini mendemonstrasikan cara menggunakan semua fitur auth
 */

// Contoh login form
export function LoginExample() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-primary-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </form>
  )
}

// Contoh customer profile
export function CustomerProfileExample() {
  const { user, getFullName, getLocation, hasProfile } = useUser()

  if (!hasProfile) {
    return <div>Customer profile not found</div>
  }

  return (
    <AuthGuard requiredRole="customer">
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold">Customer Profile</h2>
        <p><strong>Name:</strong> {getFullName()}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
        <p><strong>Location:</strong> {getLocation()?.city}, {getLocation()?.province}</p>
      </div>
    </AuthGuard>
  )
}

// Contoh mitra dashboard
export function MitraDashboardExample() {
  const {
    mitra,
    getBusinessName,
    getLocation,
    isPending,
    isApproved,
    canAccessDashboard,
    hasProfile
  } = useMitra()

  if (!hasProfile) {
    return <div>Mitra profile not found</div>
  }

  if (isPending) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h2 className="text-xl font-bold">Akun Sedang Diverifikasi</h2>
        <p>Akun Anda sedang dalam proses verifikasi. Mohon tunggu konfirmasi dari admin.</p>
      </div>
    )
  }

  if (!canAccessDashboard()) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h2 className="text-xl font-bold">Akses Ditolak</h2>
        <p>Akun Anda belum diverifikasi atau tidak aktif.</p>
      </div>
    )
  }

  return (
    <AuthGuard requiredRole="mitra">
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold">Mitra Dashboard</h2>
        <p><strong>Business Name:</strong> {getBusinessName()}</p>
        <p><strong>Email:</strong> {mitra?.email}</p>
        <p><strong>Phone:</strong> {mitra?.phone}</p>
        <p><strong>Business Type:</strong> {mitra?.business_type}</p>
        <p><strong>Location:</strong> {getLocation()?.city}, {getLocation()?.province}</p>
        <p><strong>Status:</strong> {isApproved ? 'Verified' : 'Pending'}</p>
      </div>
    </AuthGuard>
  )
}

// Contoh auth status display
export function AuthStatusExample() {
  const {
    user,
    loading,
    error,
    isAuthenticated,
    isCustomer,
    isMitra,
    logout
  } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600">
        Error: {error}
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="text-gray-600">
        Not authenticated
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 bg-green-100 border border-green-400 rounded">
      <div>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Type:</strong> {isCustomer ? 'Customer' : isMitra ? 'Mitra' : 'Unknown'}</p>
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  )
}

// Contoh protected content
export function ProtectedContentExample() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Authentication Examples</h1>
      
      {/* Auth Status */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Auth Status</h2>
        <AuthStatusExample />
      </section>

      {/* Login Form */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Login Form</h2>
        <div className="max-w-md">
          <LoginExample />
        </div>
      </section>

      {/* Protected Content */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Protected Content</h2>
        
        <AuthGuard fallback={<div>Please login to view this content</div>}>
          <div className="p-4 bg-blue-100 border border-blue-400 rounded">
            <p>This content is only visible to authenticated users.</p>
          </div>
        </AuthGuard>
      </section>

      {/* Customer Only Content */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Customer Profile</h2>
        <CustomerProfileExample />
      </section>

      {/* Mitra Only Content */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Mitra Dashboard</h2>
        <MitraDashboardExample />
      </section>
    </div>
  )
}
/**
 * Utility functions untuk menangani redirect logic setelah authentication
 * Requirement 6.6 - Setup redirect logic dengan return URL setelah authentication
 */

/**
 * Simpan current URL untuk redirect setelah login
 */
export function saveReturnUrl(url?: string) {
  const returnUrl = url || window.location.pathname + window.location.search
  sessionStorage.setItem('returnUrl', returnUrl)
}

/**
 * Ambil dan hapus return URL dari storage
 */
export function getAndClearReturnUrl(): string | null {
  const returnUrl = sessionStorage.getItem('returnUrl')
  if (returnUrl) {
    sessionStorage.removeItem('returnUrl')
    return returnUrl
  }
  return null
}

/**
 * Redirect ke URL yang disimpan atau default URL
 */
export function redirectToReturnUrl(defaultUrl: string = '/') {
  const returnUrl = getAndClearReturnUrl()
  
  if (returnUrl && isValidReturnUrl(returnUrl)) {
    window.location.href = returnUrl
  } else {
    window.location.href = defaultUrl
  }
}

/**
 * Validasi apakah return URL aman untuk redirect
 */
function isValidReturnUrl(url: string): boolean {
  try {
    // Pastikan URL adalah relative path atau same origin
    if (url.startsWith('/')) {
      return true
    }
    
    const urlObj = new URL(url)
    return urlObj.origin === window.location.origin
  } catch {
    return false
  }
}

/**
 * Generate login URL dengan return URL
 */
export function generateLoginUrl(userType: 'customer' | 'mitra', returnUrl?: string): string {
  const currentUrl = returnUrl || window.location.pathname + window.location.search
  
  if (userType === 'mitra') {
    return `/mitra?redirect=${encodeURIComponent(currentUrl)}`
  } else {
    return `/?login=true&redirect=${encodeURIComponent(currentUrl)}`
  }
}

/**
 * Parse redirect parameter dari URL
 */
export function parseRedirectFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  
  const urlParams = new URLSearchParams(window.location.search)
  const redirect = urlParams.get('redirect')
  
  if (redirect && isValidReturnUrl(redirect)) {
    return redirect
  }
  
  return null
}

/**
 * Handle redirect setelah successful authentication berdasarkan user role
 */
export function handlePostAuthRedirect(userRole: 'customer' | 'mitra') {
  const returnUrl = getAndClearReturnUrl() || parseRedirectFromUrl()
  
  if (returnUrl && isValidReturnUrl(returnUrl)) {
    // Jika ada return URL yang valid, redirect ke sana
    window.location.href = returnUrl
  } else {
    // Default redirect berdasarkan role
    if (userRole === 'mitra') {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/'
    }
  }
}

/**
 * Middleware untuk memeriksa apakah user perlu di-redirect setelah login
 */
export function checkAuthRedirect() {
  const urlParams = new URLSearchParams(window.location.search)
  const shouldShowLogin = urlParams.get('login') === 'true'
  const redirectUrl = urlParams.get('redirect')
  
  if (shouldShowLogin && redirectUrl) {
    saveReturnUrl(redirectUrl)
  }
  
  return {
    shouldShowLogin,
    redirectUrl
  }
}
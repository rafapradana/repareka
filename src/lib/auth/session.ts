import { supabase } from '../supabase'
import type { AuthUser, UserRole } from './types'

/**
 * Advanced session management utilities
 */

// Session storage keys
const SESSION_KEYS = {
  USER: 'repareka_user',
  ROLE: 'repareka_role',
  LAST_ACTIVITY: 'repareka_last_activity',
  REMEMBER_ME: 'repareka_remember_me'
} as const

// Session timeout (30 menit)
const SESSION_TIMEOUT = 30 * 60 * 1000

/**
 * Menyimpan user data ke local storage
 */
export function storeUserSession(user: AuthUser, rememberMe: boolean = false) {
  try {
    if (typeof window === 'undefined') return

    const storage = rememberMe ? localStorage : sessionStorage
    
    storage.setItem(SESSION_KEYS.USER, JSON.stringify(user))
    storage.setItem(SESSION_KEYS.ROLE, user.role)
    storage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString())
    
    if (rememberMe) {
      localStorage.setItem(SESSION_KEYS.REMEMBER_ME, 'true')
    }
  } catch (error) {
    console.error('Error storing user session:', error)
  }
}

/**
 * Mengambil user data dari local storage
 */
export function getUserSession(): AuthUser | null {
  try {
    if (typeof window === 'undefined') return null

    // Cek remember me preference
    const rememberMe = localStorage.getItem(SESSION_KEYS.REMEMBER_ME) === 'true'
    const storage = rememberMe ? localStorage : sessionStorage
    
    const userStr = storage.getItem(SESSION_KEYS.USER)
    const lastActivity = storage.getItem(SESSION_KEYS.LAST_ACTIVITY)
    
    if (!userStr || !lastActivity) return null
    
    // Cek session timeout
    const now = Date.now()
    const lastActivityTime = parseInt(lastActivity)
    
    if (now - lastActivityTime > SESSION_TIMEOUT) {
      clearUserSession()
      return null
    }
    
    // Update last activity
    storage.setItem(SESSION_KEYS.LAST_ACTIVITY, now.toString())
    
    return JSON.parse(userStr) as AuthUser
  } catch (error) {
    console.error('Error getting user session:', error)
    return null
  }
}

/**
 * Menghapus user session dari storage
 */
export function clearUserSession() {
  try {
    if (typeof window === 'undefined') return

    // Clear from both storages
    Object.values(SESSION_KEYS).forEach(key => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Error clearing user session:', error)
  }
}

/**
 * Cek apakah session masih valid
 */
export function isSessionValid(): boolean {
  try {
    if (typeof window === 'undefined') return false

    const rememberMe = localStorage.getItem(SESSION_KEYS.REMEMBER_ME) === 'true'
    const storage = rememberMe ? localStorage : sessionStorage
    
    const lastActivity = storage.getItem(SESSION_KEYS.LAST_ACTIVITY)
    if (!lastActivity) return false
    
    const now = Date.now()
    const lastActivityTime = parseInt(lastActivity)
    
    return (now - lastActivityTime) <= SESSION_TIMEOUT
  } catch (error) {
    console.error('Error checking session validity:', error)
    return false
  }
}

/**
 * Refresh session activity timestamp
 */
export function refreshSessionActivity() {
  try {
    if (typeof window === 'undefined') return

    const rememberMe = localStorage.getItem(SESSION_KEYS.REMEMBER_ME) === 'true'
    const storage = rememberMe ? localStorage : sessionStorage
    
    storage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString())
  } catch (error) {
    console.error('Error refreshing session activity:', error)
  }
}

/**
 * Get user role from session
 */
export function getSessionRole(): UserRole | null {
  try {
    if (typeof window === 'undefined') return null

    const rememberMe = localStorage.getItem(SESSION_KEYS.REMEMBER_ME) === 'true'
    const storage = rememberMe ? localStorage : sessionStorage
    
    const role = storage.getItem(SESSION_KEYS.ROLE)
    return role as UserRole | null
  } catch (error) {
    console.error('Error getting session role:', error)
    return null
  }
}

/**
 * Setup session activity monitoring
 */
export function setupSessionMonitoring() {
  if (typeof window === 'undefined') return

  // Monitor user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  
  const refreshActivity = () => {
    if (isSessionValid()) {
      refreshSessionActivity()
    }
  }

  events.forEach(event => {
    document.addEventListener(event, refreshActivity, true)
  })

  // Check session validity periodically
  const checkSession = () => {
    if (!isSessionValid()) {
      clearUserSession()
      // Trigger logout
      supabase.auth.signOut()
    }
  }

  // Check every 5 minutes
  const intervalId = setInterval(checkSession, 5 * 60 * 1000)

  // Cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, refreshActivity, true)
    })
    clearInterval(intervalId)
  }
}

/**
 * Handle session expiration warning
 */
export function handleSessionExpiration(onWarning?: () => void, onExpired?: () => void) {
  if (typeof window === 'undefined') return

  const checkExpiration = () => {
    const rememberMe = localStorage.getItem(SESSION_KEYS.REMEMBER_ME) === 'true'
    const storage = rememberMe ? localStorage : sessionStorage
    
    const lastActivity = storage.getItem(SESSION_KEYS.LAST_ACTIVITY)
    if (!lastActivity) return

    const now = Date.now()
    const lastActivityTime = parseInt(lastActivity)
    const timeSinceActivity = now - lastActivityTime

    // Warning 5 menit sebelum expired
    const warningTime = SESSION_TIMEOUT - (5 * 60 * 1000)
    
    if (timeSinceActivity >= SESSION_TIMEOUT) {
      onExpired?.()
    } else if (timeSinceActivity >= warningTime) {
      onWarning?.()
    }
  }

  // Check every minute
  const intervalId = setInterval(checkExpiration, 60 * 1000)

  return () => clearInterval(intervalId)
}
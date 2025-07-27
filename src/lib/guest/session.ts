/**
 * Utility functions untuk mengelola guest session dan preferences
 * Membantu tracking guest behavior untuk analytics dan UX improvement
 */

interface GuestSession {
  id: string
  startTime: number
  lastActivity: number
  viewedServices: string[]
  searchQueries: string[]
  appliedFilters: Record<string, unknown>[]
  loginPromptShown: number
  loginPromptDismissed: number
}

const GUEST_SESSION_KEY = 'repareka_guest_session'
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

/**
 * Initialize atau retrieve guest session
 */
export function initGuestSession(): GuestSession {
  if (typeof window === 'undefined') {
    return createNewGuestSession()
  }

  const stored = localStorage.getItem(GUEST_SESSION_KEY)
  
  if (stored) {
    try {
      const session: GuestSession = JSON.parse(stored)
      
      // Check jika session masih valid
      if (Date.now() - session.lastActivity < SESSION_TIMEOUT) {
        // Update last activity
        session.lastActivity = Date.now()
        saveGuestSession(session)
        return session
      }
    } catch (error) {
      console.error('Error parsing guest session:', error)
    }
  }
  
  // Create new session jika tidak ada atau expired
  return createNewGuestSession()
}

/**
 * Create new guest session
 */
function createNewGuestSession(): GuestSession {
  const session: GuestSession = {
    id: generateGuestId(),
    startTime: Date.now(),
    lastActivity: Date.now(),
    viewedServices: [],
    searchQueries: [],
    appliedFilters: [],
    loginPromptShown: 0,
    loginPromptDismissed: 0
  }
  
  saveGuestSession(session)
  return session
}

/**
 * Save guest session to localStorage
 */
function saveGuestSession(session: GuestSession) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session))
  } catch (error) {
    console.error('Error saving guest session:', error)
  }
}

/**
 * Generate unique guest ID
 */
function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Track service view
 */
export function trackServiceView(serviceId: string) {
  const session = initGuestSession()
  
  if (!session.viewedServices.includes(serviceId)) {
    session.viewedServices.push(serviceId)
    session.lastActivity = Date.now()
    saveGuestSession(session)
  }
}

/**
 * Track search query
 */
export function trackSearchQuery(query: string) {
  if (!query.trim()) return
  
  const session = initGuestSession()
  session.searchQueries.push(query)
  session.lastActivity = Date.now()
  saveGuestSession(session)
}

/**
 * Track applied filter
 */
export function trackAppliedFilter(filter: Record<string, unknown>) {
  const session = initGuestSession()
  session.appliedFilters.push({
    ...filter,
    timestamp: Date.now()
  })
  session.lastActivity = Date.now()
  saveGuestSession(session)
}

/**
 * Track login prompt shown
 */
export function trackLoginPromptShown() {
  const session = initGuestSession()
  session.loginPromptShown++
  session.lastActivity = Date.now()
  saveGuestSession(session)
}

/**
 * Track login prompt dismissed
 */
export function trackLoginPromptDismissed() {
  const session = initGuestSession()
  session.loginPromptDismissed++
  session.lastActivity = Date.now()
  saveGuestSession(session)
}

/**
 * Get guest session analytics
 */
export function getGuestAnalytics(): {
  sessionDuration: number
  servicesViewed: number
  searchesPerformed: number
  filtersApplied: number
  loginPromptConversion: number
} {
  const session = initGuestSession()
  
  return {
    sessionDuration: session.lastActivity - session.startTime,
    servicesViewed: session.viewedServices.length,
    searchesPerformed: session.searchQueries.length,
    filtersApplied: session.appliedFilters.length,
    loginPromptConversion: session.loginPromptShown > 0 
      ? (session.loginPromptShown - session.loginPromptDismissed) / session.loginPromptShown 
      : 0
  }
}

/**
 * Clear guest session (biasanya setelah login)
 */
export function clearGuestSession() {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(GUEST_SESSION_KEY)
  } catch (error) {
    console.error('Error clearing guest session:', error)
  }
}

/**
 * Check apakah guest sudah menunjukkan engagement tinggi
 * Untuk menentukan timing yang tepat untuk login prompt
 */
export function isHighEngagementGuest(): boolean {
  const analytics = getGuestAnalytics()
  
  return (
    analytics.servicesViewed >= 3 ||
    analytics.searchesPerformed >= 2 ||
    analytics.filtersApplied >= 1 ||
    analytics.sessionDuration >= 5 * 60 * 1000 // 5 minutes
  )
}

/**
 * Check apakah sudah waktunya untuk menampilkan login prompt
 */
export function shouldShowLoginPrompt(): boolean {
  const session = initGuestSession()
  
  // Jangan tampilkan jika sudah di-dismiss terlalu banyak
  if (session.loginPromptDismissed >= 3) {
    return false
  }
  
  // Tampilkan jika engagement tinggi dan belum terlalu sering ditampilkan
  return isHighEngagementGuest() && session.loginPromptShown < 2
}
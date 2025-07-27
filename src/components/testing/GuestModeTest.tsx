'use client'

import { useState } from 'react'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { useAuth } from '@/hooks/useAuth'
import { 
  trackServiceView, 
  trackSearchQuery, 
  trackAppliedFilter,
  getGuestAnalytics,
  isHighEngagementGuest,
  shouldShowLoginPrompt
} from '@/lib/guest/session'

/**
 * Komponen untuk testing guest mode functionality
 * Hanya untuk development/testing purposes
 */
export function GuestModeTest() {
  const { isAuthenticated, user } = useAuth()
  const featureAccess = useFeatureAccess()
  const [analytics, setAnalytics] = useState(getGuestAnalytics())

  const refreshAnalytics = () => {
    setAnalytics(getGuestAnalytics())
  }

  const testServiceView = () => {
    trackServiceView(`test-service-${Date.now()}`)
    refreshAnalytics()
  }

  const testSearch = () => {
    trackSearchQuery(`test query ${Date.now()}`)
    refreshAnalytics()
  }

  const testFilter = () => {
    trackAppliedFilter({
      category: 'electronics',
      location: 'jakarta',
      timestamp: Date.now()
    })
    refreshAnalytics()
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-base-900 border border-base-200 dark:border-base-700 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-semibold text-base-800 dark:text-base-200 mb-3">
        Guest Mode Test Panel
      </h3>
      
      {/* Auth Status */}
      <div className="mb-4 p-2 bg-base-50 dark:bg-base-800 rounded">
        <div className="text-sm">
          <strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Guest'}
        </div>
        {user && (
          <div className="text-sm">
            <strong>Role:</strong> {user.role}
          </div>
        )}
      </div>

      {/* Feature Access Tests */}
      <div className="mb-4">
        <h4 className="font-medium text-sm mb-2">Feature Access:</h4>
        <div className="space-y-1 text-xs">
          <div>Booking: {featureAccess.canBook() ? '✅' : '❌'}</div>
          <div>Chat: {featureAccess.canChat() ? '✅' : '❌'}</div>
          <div>Review: {featureAccess.canReview() ? '✅' : '❌'}</div>
          <div>Favorite: {featureAccess.canFavorite() ? '✅' : '❌'}</div>
          <div>Dashboard: {featureAccess.canAccessMitraDashboard() ? '✅' : '❌'}</div>
        </div>
      </div>

      {/* Guest Analytics */}
      {!isAuthenticated && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Guest Analytics:</h4>
          <div className="space-y-1 text-xs">
            <div>Services Viewed: {analytics.servicesViewed}</div>
            <div>Searches: {analytics.searchesPerformed}</div>
            <div>Filters: {analytics.filtersApplied}</div>
            <div>Session: {Math.round(analytics.sessionDuration / 1000)}s</div>
            <div>High Engagement: {isHighEngagementGuest() ? '✅' : '❌'}</div>
            <div>Should Show Prompt: {shouldShowLoginPrompt() ? '✅' : '❌'}</div>
          </div>
        </div>
      )}

      {/* Test Actions */}
      {!isAuthenticated && (
        <div className="space-y-2">
          <button
            onClick={testServiceView}
            className="w-full px-2 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600"
          >
            Test Service View
          </button>
          <button
            onClick={testSearch}
            className="w-full px-2 py-1 bg-secondary-500 text-white text-xs rounded hover:bg-secondary-600"
          >
            Test Search
          </button>
          <button
            onClick={testFilter}
            className="w-full px-2 py-1 bg-base-500 text-white text-xs rounded hover:bg-base-600"
          >
            Test Filter
          </button>
          <button
            onClick={featureAccess.attemptBooking}
            className="w-full px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Test Booking (Should Prompt)
          </button>
        </div>
      )}
    </div>
  )
}
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui/Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M8 17l-4-4m0 0l4-4m-4 4h12m-4 4l4-4m0 0l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <Spinner size="md" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading Western Haul...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}

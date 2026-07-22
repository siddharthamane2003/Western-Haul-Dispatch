import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

// Public pages
import Login from '@/pages/Login'
import ForgotPassword from '@/pages/ForgotPassword'

// Protected pages
import Dashboard from '@/pages/Dashboard'
import AddTrip from '@/pages/AddTrip'
import LocationPage from '@/pages/Location'
import DispatchHistory from '@/pages/DispatchHistory' // Used for Search Trip
import DispatchDetail from '@/pages/DispatchDetail'
import DispatchSummary from '@/pages/DispatchSummary'
import NotFound from '@/pages/NotFound'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Dispatch / Trip */}
          <Route path="dispatch/new" element={<AddTrip />} />
          <Route path="trip/location" element={<LocationPage />} />
          <Route path="dispatch/history" element={<Navigate to="/app/trip/search" replace />} />
          <Route path="trip/search" element={<DispatchHistory />} />
          <Route path="dispatch/detail/:id" element={<DispatchDetail />} />
          <Route path="dispatch/summary/:id" element={<DispatchSummary />} />
        </Route>

        {/* Legacy redirects */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/trip/add" element={<Navigate to="/app/dispatch/new" replace />} />
        <Route path="/trip/search" element={<Navigate to="/app/trip/search" replace />} />
        <Route path="/dispatch/history" element={<Navigate to="/app/trip/search" replace />} />
        <Route path="/dispatch/summary/:id" element={<Navigate to="/app/dispatch/summary/:id" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App

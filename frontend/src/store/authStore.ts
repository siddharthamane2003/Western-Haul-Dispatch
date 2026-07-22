import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { tokenManager } from '@/lib/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  // Helpers
  hasRole: (role: UserRole | UserRole[]) => boolean
  isAdmin: () => boolean
  isDispatcher: () => boolean
  isDriver: () => boolean
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,

        setUser: (user) =>
          set({ user, isAuthenticated: !!user, isLoading: false }),

        setLoading: (loading) => set({ isLoading: loading }),

        login: (user, accessToken, refreshToken) => {
          tokenManager.set(accessToken)
          tokenManager.setRefresh(refreshToken)
          set({ user, isAuthenticated: true, isLoading: false })
        },

        logout: () => {
          tokenManager.clear()
          set({ user: null, isAuthenticated: false, isLoading: false })
        },

        updateUser: (updates) => {
          const current = get().user
          if (current) {
            set({ user: { ...current, ...updates } })
          }
        },

        hasRole: (role) => {
          const { user } = get()
          if (!user) return false
          if (Array.isArray(role)) return role.includes(user.role)
          return user.role === role
        },

        isAdmin: () => {
          const { user } = get()
          return user?.role === 'admin' || user?.role === 'super_admin'
        },

        isDispatcher: () => {
          const { user } = get()
          return (
            user?.role === 'dispatcher' ||
            user?.role === 'admin' ||
            user?.role === 'super_admin'
          )
        },

        isDriver: () => {
          const { user } = get()
          return user?.role === 'driver'
        },
      }),
      {
        name: 'whd-auth',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: 'AuthStore' }
  )
)

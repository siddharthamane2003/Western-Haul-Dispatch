import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { tokenManager } from '@/lib/api'
import * as authService from '@/services/authService'
import type {
  LoginRequest,
  User,
  UserRole,
} from '@/types'

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const authKeys = {
  me: ['auth', 'me'] as const,
}

// ─── useCurrentUser ────────────────────────────────────────────────────────────

/**
 * Fetches GET /auth/me on mount if the user has a token but the store has no
 * user yet (e.g. after a page refresh). Keeps the store in sync.
 */
export function useCurrentUser() {
  const { setUser, user } = useAuthStore()
  const hasToken = !!tokenManager.get()

  return useQuery({
    queryKey: authKeys.me,
    queryFn: async (): Promise<User> => {
      const fetchedUser = await authService.getCurrentUser()
      setUser(fetchedUser)
      return fetchedUser
    },
    enabled: hasToken && !user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

// ─── useAuth ──────────────────────────────────────────────────────────────────

/**
 * Primary auth hook. Wraps the Zustand authStore and exposes mutations for
 * login, logout, profile update, and password change.
 *
 * Returns:
 *  - user, isAuthenticated, isLoading — from the store
 *  - hasRole, isAdmin, isDispatcher — from the store helpers
 *  - login, logout, updateProfile, changePassword — TanStack Query mutations
 */
export function useAuth() {
  const queryClient = useQueryClient()

  const {
    user,
    isAuthenticated,
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    updateUser,
    hasRole,
    isAdmin,
    isDispatcher,
    isDriver,
  } = useAuthStore()

  // ── Login ──────────────────────────────────────────────────────────────────

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      storeLogin(data.user, data.access_token, data.refresh_token)
      queryClient.setQueryData(authKeys.me, data.user)
    },
  })

  // ── Logout ─────────────────────────────────────────────────────────────────

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Always clear local state even if the API call fails
      storeLogout()
      queryClient.clear()
    },
  })

  // ── Update Profile ─────────────────────────────────────────────────────────

  const updateProfileMutation = useMutation({
    mutationFn: (data: authService.UpdateProfileRequest) =>
      authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      queryClient.setQueryData(authKeys.me, updatedUser)
    },
  })

  // ── Change Password ────────────────────────────────────────────────────────

  const changePasswordMutation = useMutation({
    mutationFn: (data: authService.ChangePasswordRequest) =>
      authService.changePassword(data),
  })

  return {
    // Store state
    user,
    isAuthenticated,
    isLoading,

    // Role helpers
    hasRole: (role: UserRole | UserRole[]) => hasRole(role),
    isAdmin: isAdmin(),
    isDispatcher: isDispatcher(),
    isDriver: isDriver(),

    // Mutations
    login: loginMutation,
    logout: logoutMutation,
    updateProfile: updateProfileMutation,
    changePassword: changePasswordMutation,
  }
}

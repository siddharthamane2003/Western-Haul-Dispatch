import { apiGet, apiPost, apiPatch } from '@/lib/api'
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '@/types'

// ─── Request / Response Shapes ────────────────────────────────────────────────

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
  confirm_password: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Authenticate a user with email and password.
 * Returns tokens + user object on success.
 */
export const login = (data: LoginRequest): Promise<LoginResponse> =>
  apiPost<LoginResponse>('/auth/login', data)

/**
 * Register a new user / company account.
 * Returns tokens + user object on success.
 */
export const register = (data: RegisterRequest): Promise<LoginResponse> =>
  apiPost<LoginResponse>('/auth/register', data)

/**
 * Invalidate the current session server-side.
 */
export const logout = (): Promise<ApiResponse<null>> =>
  apiPost<ApiResponse<null>>('/auth/logout')

/**
 * Exchange a refresh token for a new access/refresh token pair.
 */
export const refreshToken = (
  data: RefreshTokenRequest,
): Promise<RefreshTokenResponse> =>
  apiPost<RefreshTokenResponse>('/auth/refresh', data)

/**
 * Fetch the currently authenticated user's profile.
 */
export const getCurrentUser = (): Promise<User> =>
  apiGet<User>('/auth/me')

/**
 * Partially update the authenticated user's profile.
 */
export const updateProfile = (data: UpdateProfileRequest): Promise<User> =>
  apiPatch<User>('/auth/me', data)

/**
 * Change the authenticated user's password.
 * Requires the current password for verification.
 */
export const changePassword = (
  data: ChangePasswordRequest,
): Promise<ApiResponse<null>> =>
  apiPost<ApiResponse<null>>('/auth/change-password', data)

/**
 * Initiate the forgot-password flow.
 * The backend will send a reset link to the supplied email.
 */
export const forgotPassword = (
  data: ForgotPasswordRequest,
): Promise<ApiResponse<null>> =>
  apiPost<ApiResponse<null>>('/auth/forgot-password', data)

/**
 * Complete the password-reset flow using the token from the email link.
 */
export const resetPassword = (
  data: ResetPasswordRequest,
): Promise<ApiResponse<null>> =>
  apiPost<ApiResponse<null>>('/auth/reset-password', data)

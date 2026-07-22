import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api'
import type {
  ApiResponse,
  Notification,
  PaginatedResponse,
  PaginationParams,
} from '@/types'

// ─── Query Params ──────────────────────────────────────────────────────────────

export interface NotificationListParams extends PaginationParams {
  is_read?: boolean
}

// ─── Extra Response Types ──────────────────────────────────────────────────────

export interface UnreadCountResponse {
  count: number
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of notifications for the authenticated user.
 * Can be filtered by read status (is_read: true | false | undefined for all).
 */
export const getNotifications = (
  params: NotificationListParams = {},
): Promise<PaginatedResponse<Notification>> =>
  apiGet<PaginatedResponse<Notification>>('/notifications', { params })

/**
 * Mark a single notification as read by its ID.
 */
export const markNotificationRead = (id: string): Promise<Notification> =>
  apiPatch<Notification>(`/notifications/${id}/read`, {})

/**
 * Mark all unread notifications for the authenticated user as read in one call.
 */
export const markAllNotificationsRead = (): Promise<ApiResponse<null>> =>
  apiPost<ApiResponse<null>>('/notifications/mark-all-read')

/**
 * Permanently delete a single notification by its ID.
 */
export const deleteNotification = (id: string): Promise<ApiResponse<null>> =>
  apiDelete<ApiResponse<null>>(`/notifications/${id}`)

/**
 * Fetch only the count of unread notifications.
 * Lightweight endpoint used to update the badge in the navigation bar.
 */
export const getUnreadCount = (): Promise<UnreadCountResponse> =>
  apiGet<UnreadCountResponse>('/notifications/unread-count')

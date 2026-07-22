import { apiGet } from '@/lib/api'
import type {
  DashboardStats,
  DriverStatusBreakdown,
  FreightOrder,
  OrderStatusBreakdown,
  RevenueDataPoint,
} from '@/types'

// ─── Query Params ──────────────────────────────────────────────────────────────

export type RevenueTrendPeriod = '7d' | '30d' | '90d'

export interface RevenueTrendParams {
  period?: RevenueTrendPeriod
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch top-level KPI statistics for the dashboard header cards.
 * Includes totals for orders, dispatches, drivers, vehicles, and revenue.
 */
export const getDashboardStats = (): Promise<DashboardStats> =>
  apiGet<DashboardStats>('/dashboard/stats')

/**
 * Fetch the revenue trend time-series data for the dashboard chart.
 * @param period - '7d' (last 7 days), '30d' (last 30 days), '90d' (last 90 days)
 *                 Defaults to '30d' on the backend if omitted.
 */
export const getRevenueTrend = (
  params: RevenueTrendParams = { period: '30d' },
): Promise<RevenueDataPoint[]> =>
  apiGet<RevenueDataPoint[]>('/dashboard/revenue-trend', { params })

/**
 * Fetch the count and percentage breakdown of orders by status
 * for the pie / donut chart on the dashboard.
 */
export const getOrderStatusBreakdown = (): Promise<OrderStatusBreakdown[]> =>
  apiGet<OrderStatusBreakdown[]>('/dashboard/order-status-breakdown')

/**
 * Fetch the current availability breakdown of all drivers
 * (available, on_trip, off_duty, unavailable counts).
 */
export const getDriverStatus = (): Promise<DriverStatusBreakdown> =>
  apiGet<DriverStatusBreakdown>('/dashboard/driver-status')

/**
 * Fetch the most recent freight orders for the activity feed / recent-orders table.
 */
export const getRecentOrders = (): Promise<FreightOrder[]> =>
  apiGet<FreightOrder[]>('/dashboard/recent-orders')

import { apiGet, apiPost } from '@/lib/api'
import type {
  DriverPerformanceReport,
  ReportFilter,
  RevenueReport,
} from '@/types'

// ─── Extra Report Types ────────────────────────────────────────────────────────

export interface FleetUtilizationReport {
  vehicle_id: string
  vehicle_number: string
  type: string
  total_trips: number
  total_miles: number
  utilization_rate: number
  maintenance_days: number
  revenue_generated: number
}

export interface CustomerAnalysisReport {
  customer_id: string
  customer_name: string
  total_orders: number
  total_revenue: number
  avg_order_value: number
  on_time_rate: number
  outstanding_balance: number
}

export type ExportReportType =
  | 'revenue'
  | 'driver_performance'
  | 'fleet_utilization'
  | 'customer_analysis'

export interface ExportReportRequest {
  report_type: ExportReportType
  filters?: ReportFilter
  format?: 'csv' | 'xlsx'
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch a revenue summary report for a given date range.
 * Optionally filtered by customer, driver, vehicle, status, or freight type.
 */
export const getRevenueReport = (
  filters: ReportFilter,
): Promise<RevenueReport> =>
  apiGet<RevenueReport>('/reports/revenue', { params: filters })

/**
 * Fetch a performance summary for each driver within the filter period.
 * Includes trip count, miles, on-time rate, rating, and revenue generated.
 */
export const getDriverPerformanceReport = (
  filters: ReportFilter,
): Promise<DriverPerformanceReport[]> =>
  apiGet<DriverPerformanceReport[]>('/reports/driver-performance', {
    params: filters,
  })

/**
 * Fetch fleet utilization metrics for each vehicle within the filter period.
 * Includes total trips, miles driven, utilization rate, and maintenance downtime.
 */
export const getFleetUtilizationReport = (
  filters: ReportFilter,
): Promise<FleetUtilizationReport[]> =>
  apiGet<FleetUtilizationReport[]>('/reports/fleet-utilization', {
    params: filters,
  })

/**
 * Fetch an analysis of customer activity for the filter period.
 * Includes total orders, revenue, average order value, on-time delivery rate,
 * and outstanding balance per customer.
 */
export const getCustomerAnalysisReport = (
  filters: ReportFilter,
): Promise<CustomerAnalysisReport[]> =>
  apiGet<CustomerAnalysisReport[]>('/reports/customer-analysis', {
    params: filters,
  })

/**
 * Request a CSV (or XLSX) export of the specified report type.
 * The backend generates the file and returns it as a binary Blob.
 * The caller is responsible for triggering the browser download.
 *
 * @example
 * const blob = await exportReport({ report_type: 'revenue', filters, format: 'csv' })
 * const url = URL.createObjectURL(blob)
 * const a = document.createElement('a')
 * a.href = url
 * a.download = 'revenue-report.csv'
 * a.click()
 * URL.revokeObjectURL(url)
 */
export const exportReport = async (
  data: ExportReportRequest,
): Promise<Blob> => {
  const response = await apiPost<Blob>('/reports/export', data, {
    responseType: 'blob',
  })
  return response
}

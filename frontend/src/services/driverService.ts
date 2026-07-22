import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api'
import type {
  ApiResponse,
  Dispatch,
  Driver,
  DriverFormData,
  DriverStatus,
  PaginatedResponse,
  PaginationParams,
} from '@/types'

// ─── Query Params ──────────────────────────────────────────────────────────────

export interface DriverListParams extends PaginationParams {
  status?: DriverStatus
}

export interface UpdateDriverStatusRequest {
  status: DriverStatus
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of drivers with optional search and status filters.
 */
export const getDrivers = (
  params: DriverListParams = {},
): Promise<PaginatedResponse<Driver>> =>
  apiGet<PaginatedResponse<Driver>>('/drivers', { params })

/**
 * Fetch a single driver by their ID.
 */
export const getDriver = (id: string): Promise<Driver> =>
  apiGet<Driver>(`/drivers/${id}`)

/**
 * Create a new driver record.
 */
export const createDriver = (data: DriverFormData): Promise<Driver> =>
  apiPost<Driver>('/drivers', data)

/**
 * Fully update an existing driver record.
 */
export const updateDriver = (
  id: string,
  data: DriverFormData,
): Promise<Driver> => apiPut<Driver>(`/drivers/${id}`, data)

/**
 * Permanently delete a driver. Returns a confirmation message.
 */
export const deleteDriver = (id: string): Promise<ApiResponse<null>> =>
  apiDelete<ApiResponse<null>>(`/drivers/${id}`)

/**
 * Update only the status of a driver (e.g. available → off_duty).
 */
export const updateDriverStatus = (
  id: string,
  data: UpdateDriverStatusRequest,
): Promise<Driver> => apiPatch<Driver>(`/drivers/${id}/status`, data)

/**
 * Fetch paginated trip (dispatch) history for a specific driver.
 */
export const getDriverTrips = (
  driverId: string,
  params: PaginationParams = {},
): Promise<PaginatedResponse<Dispatch>> =>
  apiGet<PaginatedResponse<Dispatch>>(`/drivers/${driverId}/trips`, { params })

/**
 * Fetch the list of all drivers currently available for dispatch assignment.
 * Returns a flat array (not paginated) for quick selection UIs.
 */
export const getAvailableDrivers = (): Promise<Driver[]> =>
  apiGet<Driver[]>('/drivers/available')

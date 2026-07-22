import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api'
import type {
  Dispatch,
  DispatchStatus,
  PaginatedResponse,
  PaginationParams,
} from '@/types'

// ─── Request Shapes ────────────────────────────────────────────────────────────

export interface CreateDispatchRequest {
  order_id: string
  driver_id?: string
  vehicle_id?: string
  notes?: string
  estimated_arrival?: string
}

export interface UpdateDispatchRequest {
  driver_id?: string
  vehicle_id?: string
  notes?: string
  estimated_arrival?: string
  miles_driven?: number
  fuel_used?: number
  current_latitude?: number
  current_longitude?: number
}

export interface UpdateDispatchStatusRequest {
  status: DispatchStatus
  notes?: string
  current_latitude?: number
  current_longitude?: number
}

export interface AssignDispatchRequest {
  driver_id: string
  vehicle_id: string
}

// ─── Query Params ──────────────────────────────────────────────────────────────

export interface DispatchListParams extends PaginationParams {
  status?: DispatchStatus
  driver_id?: string
  vehicle_id?: string
  order_id?: string
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of dispatches with optional status, driver, vehicle,
 * and order filters.
 */
export const getDispatches = (
  params: DispatchListParams = {},
): Promise<PaginatedResponse<Dispatch>> =>
  apiGet<PaginatedResponse<Dispatch>>('/dispatches', { params })

/**
 * Fetch a single dispatch record by ID (includes order, driver, vehicle).
 */
export const getDispatch = (id: string): Promise<Dispatch> =>
  apiGet<Dispatch>(`/dispatches/${id}`)

/**
 * Create a new dispatch, linking an order to an optional driver and vehicle.
 */
export const createDispatch = (
  data: CreateDispatchRequest,
): Promise<Dispatch> => apiPost<Dispatch>('/dispatches', data)

/**
 * Fully update an existing dispatch record (mileage, location, ETA, etc.).
 */
export const updateDispatch = (
  id: string,
  data: UpdateDispatchRequest,
): Promise<Dispatch> => apiPut<Dispatch>(`/dispatches/${id}`, data)

/**
 * Transition a dispatch to a new operational status.
 * Optionally includes a location update and notes for audit trail.
 */
export const updateDispatchStatus = (
  id: string,
  data: UpdateDispatchStatusRequest,
): Promise<Dispatch> => apiPatch<Dispatch>(`/dispatches/${id}/status`, data)

/**
 * Fetch all dispatches that are currently active
 * (status is 'dispatched' or 'in_transit').
 * Returns a flat array suitable for live-tracking dashboards.
 */
export const getActiveDispatches = (): Promise<Dispatch[]> =>
  apiGet<Dispatch[]>('/dispatches/active')

/**
 * Assign (or re-assign) a driver and vehicle to an existing dispatch.
 * Use this after creating a dispatch without initial assignments.
 */
export const assignDispatch = (
  id: string,
  data: AssignDispatchRequest,
): Promise<Dispatch> => apiPost<Dispatch>(`/dispatches/${id}/assign`, data)

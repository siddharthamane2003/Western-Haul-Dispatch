import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api'
import type {
  ApiResponse,
  Dispatch,
  PaginatedResponse,
  PaginationParams,
  Vehicle,
  VehicleFormData,
  VehicleStatus,
  VehicleType,
} from '@/types'

// ─── Query Params ──────────────────────────────────────────────────────────────

export interface VehicleListParams extends PaginationParams {
  status?: VehicleStatus
  type?: VehicleType
}

export interface UpdateVehicleStatusRequest {
  status: VehicleStatus
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of vehicles with optional search, status, and type filters.
 */
export const getVehicles = (
  params: VehicleListParams = {},
): Promise<PaginatedResponse<Vehicle>> =>
  apiGet<PaginatedResponse<Vehicle>>('/vehicles', { params })

/**
 * Fetch a single vehicle by its ID.
 */
export const getVehicle = (id: string): Promise<Vehicle> =>
  apiGet<Vehicle>(`/vehicles/${id}`)

/**
 * Create a new vehicle record.
 */
export const createVehicle = (data: VehicleFormData): Promise<Vehicle> =>
  apiPost<Vehicle>('/vehicles', data)

/**
 * Fully update an existing vehicle record.
 */
export const updateVehicle = (
  id: string,
  data: Partial<VehicleFormData>,
): Promise<Vehicle> => apiPut<Vehicle>(`/vehicles/${id}`, data)

/**
 * Permanently delete a vehicle. Returns a confirmation message.
 */
export const deleteVehicle = (id: string): Promise<ApiResponse<null>> =>
  apiDelete<ApiResponse<null>>(`/vehicles/${id}`)

/**
 * Update only the operational status of a vehicle (e.g. active → maintenance).
 */
export const updateVehicleStatus = (
  id: string,
  data: UpdateVehicleStatusRequest,
): Promise<Vehicle> => apiPatch<Vehicle>(`/vehicles/${id}/status`, data)

/**
 * Fetch all vehicles currently available for dispatch assignment.
 * Returns a flat array for use in quick-selection dropdowns.
 */
export const getAvailableVehicles = (): Promise<Vehicle[]> =>
  apiGet<Vehicle[]>('/vehicles/available')

/**
 * Fetch paginated trip (dispatch) history for a specific vehicle.
 */
export const getVehicleTrips = (
  vehicleId: string,
  params: PaginationParams = {},
): Promise<PaginatedResponse<Dispatch>> =>
  apiGet<PaginatedResponse<Dispatch>>(`/vehicles/${vehicleId}/trips`, { params })

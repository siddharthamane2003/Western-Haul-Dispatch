import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api'
import type {
  ApiResponse,
  Document,
  FreightOrder,
  FreightType,
  OrderFormData,
  OrderStatus,
  PaginatedResponse,
  PaginationParams,
  ServiceType,
} from '@/types'

// ─── Query Params ──────────────────────────────────────────────────────────────

export interface OrderListParams extends PaginationParams {
  status?: OrderStatus
  customer_id?: string
  freight_type?: FreightType
  service_type?: ServiceType
  date_from?: string
  date_to?: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  notes?: string
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of freight orders.
 * Supports search, status, customer, freight type, service type, and date-range filters.
 */
export const getOrders = (
  params: OrderListParams = {},
): Promise<PaginatedResponse<FreightOrder>> =>
  apiGet<PaginatedResponse<FreightOrder>>('/orders', { params })

/**
 * Fetch a single freight order by its ID (includes locations and customer).
 */
export const getOrder = (id: string): Promise<FreightOrder> =>
  apiGet<FreightOrder>(`/orders/${id}`)

/**
 * Create a new freight order.
 */
export const createOrder = (data: OrderFormData): Promise<FreightOrder> =>
  apiPost<FreightOrder>('/orders', data)

/**
 * Fully update an existing freight order.
 */
export const updateOrder = (
  id: string,
  data: Partial<OrderFormData>,
): Promise<FreightOrder> => apiPut<FreightOrder>(`/orders/${id}`, data)

/**
 * Permanently delete a freight order.
 */
export const deleteOrder = (id: string): Promise<ApiResponse<null>> =>
  apiDelete<ApiResponse<null>>(`/orders/${id}`)

/**
 * Transition a freight order to a new status.
 * An optional notes field can document the reason for the change.
 */
export const updateOrderStatus = (
  id: string,
  data: UpdateOrderStatusRequest,
): Promise<FreightOrder> =>
  apiPatch<FreightOrder>(`/orders/${id}/status`, data)

/**
 * Fetch all documents attached to a specific freight order
 * (e.g. bill of lading, proof of delivery, invoices).
 */
export const getOrderDocuments = (orderId: string): Promise<Document[]> =>
  apiGet<Document[]>(`/orders/${orderId}/documents`)

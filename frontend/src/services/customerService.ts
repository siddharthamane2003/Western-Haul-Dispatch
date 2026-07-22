import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import type {
  ApiResponse,
  Customer,
  CustomerFormData,
  CustomerStatus,
  CustomerType,
  FreightOrder,
  PaginatedResponse,
  PaginationParams,
} from '@/types'

// ─── Query Params ──────────────────────────────────────────────────────────────

export interface CustomerListParams extends PaginationParams {
  status?: CustomerStatus
  customer_type?: CustomerType
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of customers with optional search, status, and type filters.
 */
export const getCustomers = (
  params: CustomerListParams = {},
): Promise<PaginatedResponse<Customer>> =>
  apiGet<PaginatedResponse<Customer>>('/customers', { params })

/**
 * Fetch a single customer by their ID.
 */
export const getCustomer = (id: string): Promise<Customer> =>
  apiGet<Customer>(`/customers/${id}`)

/**
 * Create a new customer record.
 */
export const createCustomer = (data: CustomerFormData): Promise<Customer> =>
  apiPost<Customer>('/customers', data)

/**
 * Fully update an existing customer record.
 */
export const updateCustomer = (
  id: string,
  data: CustomerFormData,
): Promise<Customer> => apiPut<Customer>(`/customers/${id}`, data)

/**
 * Permanently delete a customer. Returns a confirmation message.
 */
export const deleteCustomer = (id: string): Promise<ApiResponse<null>> =>
  apiDelete<ApiResponse<null>>(`/customers/${id}`)

/**
 * Fetch the freight-order history for a specific customer (paginated).
 */
export const getCustomerOrders = (
  customerId: string,
  params: PaginationParams = {},
): Promise<PaginatedResponse<FreightOrder>> =>
  apiGet<PaginatedResponse<FreightOrder>>(`/customers/${customerId}/orders`, {
    params,
  })

/**
 * Export the customer list as a CSV file.
 * Applies the same filters as `getCustomers` so the export matches the UI view.
 * The response is a Blob which the caller can turn into a download link.
 */
export const exportCustomersCSV = async (
  params: CustomerListParams = {},
): Promise<Blob> => {
  const response = await apiGet<Blob>('/customers/export', {
    params: { ...params, format: 'csv' },
    responseType: 'blob',
  })
  return response
}

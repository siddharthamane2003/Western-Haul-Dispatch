import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as customerService from '@/services/customerService'
import type {
  Customer,
  CustomerFormData,
  CustomerStatus,
  CustomerType,
  PaginatedResponse,
  PaginationParams,
} from '@/types'

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: CustomerListParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
}

// ─── Params Type ───────────────────────────────────────────────────────────────

export interface CustomerListParams extends PaginationParams {
  status?: CustomerStatus
  customer_type?: CustomerType
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filterable list of customers.
 */
export function useCustomers(params: CustomerListParams = {}) {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getCustomers(params),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Fetch a single customer by ID.
 */
export function useCustomer(id: string) {
  return useQuery<Customer>({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  })
}

/**
 * Create a new customer. Invalidates the customers list on success.
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation<Customer, Error, CustomerFormData>({
    mutationFn: (data) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

/**
 * Update an existing customer. Invalidates both the list and the detail cache.
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation<
    Customer,
    Error,
    { id: string; data: CustomerFormData }
  >({
    mutationFn: ({ id, data }) => customerService.updateCustomer(id, data),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.setQueryData(
        customerKeys.detail(updatedCustomer.id),
        updatedCustomer,
      )
    },
  })
}

/**
 * Delete a customer with an optimistic update — removes the customer from every
 * cached list immediately, and rolls back if the request fails.
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string; status: string }, Error, string>({
    mutationFn: (id) => customerService.deleteCustomer(id),
    onMutate: async (deletedId) => {
      // Cancel any in-flight refetches so they don't overwrite optimistic state
      await queryClient.cancelQueries({ queryKey: customerKeys.lists() })

      // Snapshot previous cache entries so we can roll back
      const previousLists = queryClient.getQueriesData<PaginatedResponse<Customer>>({
        queryKey: customerKeys.lists(),
      })

      // Optimistically remove the customer from all list caches
      queryClient.setQueriesData<PaginatedResponse<Customer>>(
        { queryKey: customerKeys.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            items: old.items.filter((c) => c.id !== deletedId),
            total: old.total - 1,
          }
        },
      )

      return { previousLists }
    },
    onError: (_err, _id, context) => {
      // Roll back to the snapshots captured in onMutate
      const ctx = context as {
        previousLists: [unknown, PaginatedResponse<Customer> | undefined][]
      }
      ctx?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey as readonly unknown[], data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

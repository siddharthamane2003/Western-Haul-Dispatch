import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as driverService from '@/services/driverService'
import type {
  Driver,
  DriverFormData,
  DriverStatus,
  LicenseClass,
  PaginatedResponse,
  PaginationParams,
} from '@/types'

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const driverKeys = {
  all: ['drivers'] as const,
  lists: () => [...driverKeys.all, 'list'] as const,
  list: (params: DriverListParams) => [...driverKeys.lists(), params] as const,
  available: () => [...driverKeys.all, 'available'] as const,
  details: () => [...driverKeys.all, 'detail'] as const,
  detail: (id: string) => [...driverKeys.details(), id] as const,
}

// ─── Params Type ───────────────────────────────────────────────────────────────

export interface DriverListParams extends PaginationParams {
  status?: DriverStatus
  license_class?: LicenseClass
  is_active?: boolean
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filterable list of drivers.
 */
export function useDrivers(params: DriverListParams = {}) {
  return useQuery<PaginatedResponse<Driver>>({
    queryKey: driverKeys.list(params),
    queryFn: () => driverService.getDrivers(params),
    staleTime: 30 * 1000,
  })
}

/**
 * Fetch a single driver by ID.
 */
export function useDriver(id: string) {
  return useQuery<Driver>({
    queryKey: driverKeys.detail(id),
    queryFn: () => driverService.getDriver(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  })
}

/**
 * Fetch all drivers currently available for dispatch assignment.
 * Refreshes every 30 seconds so the dispatcher always sees fresh availability.
 */
export function useAvailableDrivers() {
  return useQuery<Driver[]>({
    queryKey: driverKeys.available(),
    queryFn: () => driverService.getAvailableDrivers(),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  })
}

/**
 * Create a new driver. Invalidates all driver list caches.
 */
export function useCreateDriver() {
  const queryClient = useQueryClient()

  return useMutation<Driver, Error, DriverFormData>({
    mutationFn: (data) => driverService.createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() })
      queryClient.invalidateQueries({ queryKey: driverKeys.available() })
    },
  })
}

/**
 * Update an existing driver's details. Refreshes the list and the specific detail.
 */
export function useUpdateDriver() {
  const queryClient = useQueryClient()

  return useMutation<Driver, Error, { id: string; data: DriverFormData }>({
    mutationFn: ({ id, data }) => driverService.updateDriver(id, data),
    onSuccess: (updatedDriver) => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() })
      queryClient.invalidateQueries({ queryKey: driverKeys.available() })
      queryClient.setQueryData(driverKeys.detail(updatedDriver.id), updatedDriver)
    },
  })
}

/**
 * Patch only the status of a driver (available, on_trip, off_duty, unavailable).
 * Uses an optimistic update so the status badge flips instantly in the UI.
 */
export function useUpdateDriverStatus() {
  const queryClient = useQueryClient()

  return useMutation<
    Driver,
    Error,
    { id: string; data: driverService.UpdateDriverStatusRequest }
  >({
    mutationFn: ({ id, data }) => driverService.updateDriverStatus(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: driverKeys.detail(id) })
      const previousDriver = queryClient.getQueryData<Driver>(driverKeys.detail(id))

      queryClient.setQueryData<Driver>(driverKeys.detail(id), (old) =>
        old ? { ...old, status: data.status } : old,
      )

      return { previousDriver }
    },
    onError: (_err, { id }, context) => {
      const ctx = context as { previousDriver: Driver | undefined }
      if (ctx?.previousDriver) {
        queryClient.setQueryData(driverKeys.detail(id), ctx.previousDriver)
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: driverKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() })
      queryClient.invalidateQueries({ queryKey: driverKeys.available() })
    },
  })
}

/**
 * Delete a driver. Removes them from all list caches optimistically.
 */
export function useDeleteDriver() {
  const queryClient = useQueryClient()

  return useMutation<{ message?: string; status: string }, Error, string>({
    mutationFn: (id) => driverService.deleteDriver(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: driverKeys.lists() })

      const previousLists = queryClient.getQueriesData<PaginatedResponse<Driver>>({
        queryKey: driverKeys.lists(),
      })

      queryClient.setQueriesData<PaginatedResponse<Driver>>(
        { queryKey: driverKeys.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            items: old.items.filter((d) => d.id !== deletedId),
            total: old.total - 1,
          }
        },
      )

      return { previousLists }
    },
    onError: (_err, _id, context) => {
      const ctx = context as {
        previousLists: [unknown, PaginatedResponse<Driver> | undefined][]
      }
      ctx?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey as readonly unknown[], data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.lists() })
      queryClient.invalidateQueries({ queryKey: driverKeys.available() })
    },
  })
}

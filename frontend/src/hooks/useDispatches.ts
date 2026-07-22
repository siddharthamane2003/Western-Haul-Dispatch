import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as dispatchService from '@/services/dispatchService'
import type { PaginationParams, DispatchStatus } from '@/types'
import toast from 'react-hot-toast'

export function useDispatches(params: PaginationParams & { status?: DispatchStatus }) {
  return useQuery({
    queryKey: ['dispatches', params],
    queryFn: () => dispatchService.getDispatches(params),
  })
}

export function useDispatch(id: string) {
  return useQuery({
    queryKey: ['dispatches', id],
    queryFn: () => dispatchService.getDispatch(id),
    enabled: !!id,
  })
}

export function useActiveDispatches() {
  return useQuery({
    queryKey: ['dispatches', 'active'],
    queryFn: () => dispatchService.getActiveDispatches(),
    refetchInterval: 30000, // Refetch active trips location every 30s
  })
}

export function useCreateDispatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { order_id: string; driver_id: string; vehicle_id: string }) =>
      dispatchService.createDispatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatches'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Driver and vehicle assigned successfully')
    },
  })
}

export function useUpdateDispatch(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => dispatchService.updateDispatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatches', id] })
      queryClient.invalidateQueries({ queryKey: ['dispatches'] })
      toast.success('Dispatch updated successfully')
    },
  })
}

export function useUpdateDispatchStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      dispatchService.updateDispatchStatus(id, { status: status as DispatchStatus, notes: reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dispatches', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dispatches'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`Dispatch status updated to ${variables.status}`)
    },
  })
}

export function useAssignDispatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, driver_id, vehicle_id }: { id: string; driver_id: string; vehicle_id: string }) =>
      dispatchService.assignDispatch(id, { driver_id, vehicle_id }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dispatches', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dispatches'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Driver and Vehicle assigned successfully')
    },
  })
}

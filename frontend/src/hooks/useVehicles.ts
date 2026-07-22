import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as vehicleService from '@/services/vehicleService'
import type { PaginationParams, VehicleFormData, VehicleStatus, VehicleType } from '@/types'
import toast from 'react-hot-toast'

export function useVehicles(params: PaginationParams & { status?: VehicleStatus; type?: VehicleType }) {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.getVehicles(params),
  })
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehicleService.getVehicle(id),
    enabled: !!id,
  })
}

export function useAvailableVehicles() {
  return useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: () => vehicleService.getAvailableVehicles(),
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: VehicleFormData) => vehicleService.createVehicle(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success(`Vehicle created successfully`)
    },
  })
}

export function useUpdateVehicle(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<VehicleFormData>) => vehicleService.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', id] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Vehicle updated successfully')
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Vehicle deleted successfully')
    },
  })
}

export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      vehicleService.updateVehicleStatus(id, { status: status as VehicleStatus }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success(`Vehicle status updated to ${variables.status}`)
    },
  })
}

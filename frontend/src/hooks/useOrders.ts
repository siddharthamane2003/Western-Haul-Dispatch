import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as orderService from '@/services/orderService'
import type { PaginationParams, OrderFormData, OrderStatus, FreightType, ServiceType } from '@/types'
import toast from 'react-hot-toast'

export function useOrders(
  params: PaginationParams & {
    status?: OrderStatus
    customer_id?: string
    freight_type?: FreightType
    service_type?: ServiceType
    date_from?: string
    date_to?: string
  }
) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getOrders(params),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OrderFormData) => orderService.createOrder(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Freight order created successfully')
    },
  })
}

export function useUpdateOrder(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<OrderFormData>) => orderService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order updated successfully')
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order deleted successfully')
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      orderService.updateOrderStatus(id, { status: status as OrderStatus, notes: reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success(`Order status updated to ${variables.status.replace('_', ' ')}`)
    },
  })
}

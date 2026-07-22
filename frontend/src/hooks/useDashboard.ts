import { useQuery } from '@tanstack/react-query'
import * as dashboardService from '@/services/dashboardService'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000,
  })
}

export function useRevenueTrend(period: '7d' | '30d' | '90d' = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'revenue-trend', period],
    queryFn: () => dashboardService.getRevenueTrend({ period }),
    staleTime: 60000, // 1 minute
  })
}

export function useOrderStatusBreakdown() {
  return useQuery({
    queryKey: ['dashboard', 'order-status'],
    queryFn: () => dashboardService.getOrderStatusBreakdown(),
    staleTime: 30000,
  })
}

export function useDriverStatus() {
  return useQuery({
    queryKey: ['dashboard', 'driver-status'],
    queryFn: () => dashboardService.getDriverStatus(),
    staleTime: 15000, // 15 seconds (keep it fresh)
    refetchInterval: 15000,
  })
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ['dashboard', 'recent-orders'],
    queryFn: () => dashboardService.getRecentOrders(),
    staleTime: 30000,
  })
}

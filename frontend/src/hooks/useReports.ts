import { useQuery, useMutation } from '@tanstack/react-query'
import * as reportService from '@/services/reportService'
import type { ReportFilter } from '@/types'
import type { ExportReportType } from '@/services/reportService'
import toast from 'react-hot-toast'

export function useRevenueReport(filter: ReportFilter) {
  return useQuery({
    queryKey: ['reports', 'revenue', filter],
    queryFn: () => reportService.getRevenueReport(filter),
    enabled: !!filter.start_date && !!filter.end_date,
  })
}

export function useDriverPerformance(filter: ReportFilter) {
  return useQuery({
    queryKey: ['reports', 'driver-performance', filter],
    queryFn: () => reportService.getDriverPerformanceReport(filter),
    enabled: !!filter.start_date && !!filter.end_date,
  })
}

export function useFleetUtilization(filter: ReportFilter) {
  return useQuery({
    queryKey: ['reports', 'fleet-utilization', filter],
    queryFn: () => reportService.getFleetUtilizationReport(filter),
    enabled: !!filter.start_date && !!filter.end_date,
  })
}

export function useCustomerAnalysis(filter: ReportFilter) {
  return useQuery({
    queryKey: ['reports', 'customer-analysis', filter],
    queryFn: () => reportService.getCustomerAnalysisReport(filter),
    enabled: !!filter.start_date && !!filter.end_date,
  })
}

export function useExportReport() {
  return useMutation({
    mutationFn: (data: { report_type: ExportReportType; format: 'csv' | 'xlsx'; filters: ReportFilter }) =>
      reportService.exportReport(data),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${variables.report_type}_report_${new Date().toISOString().split('T')[0]}.${variables.format}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Report exported successfully')
    },
    onError: () => {
      toast.error('Failed to export report')
    },
  })
}

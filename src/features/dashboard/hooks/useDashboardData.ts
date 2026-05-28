import { useQuery } from '@tanstack/react-query'
import { getReports } from '../../reports/services/reportService'
import { countOverdueReports, countReportsByStatus, getStatusCount } from '../../reports/utils/reportMetrics'
import { RECENT_REPORTS_LIMIT } from '../constants/dashboardOptions'

export type DashboardMetrics = {
  total: number
  pending: number
  inProgress: number
  resolved: number
  rejected: number
  overdue: number
}

export function useDashboardData() {
  const reportsQuery = useQuery({ queryKey: ['reports'], queryFn: () => getReports() })
  const reports = reportsQuery.data ?? []
  const statusMetrics = countReportsByStatus(reports)
  const metrics: DashboardMetrics = {
    total: reports.length,
    pending: getStatusCount(statusMetrics, 'PENDIENTE'),
    inProgress: getStatusCount(statusMetrics, 'EN_PROCESO'),
    resolved: getStatusCount(statusMetrics, 'RESUELTO'),
    rejected: getStatusCount(statusMetrics, 'RECHAZADO'),
    overdue: countOverdueReports(reports),
  }

  return {
    reports,
    isLoading: reportsQuery.isLoading,
    metrics,
    chartData: statusMetrics.map((metric) => ({ name: metric.label, value: metric.value })),
    recentReports: reports.slice(0, RECENT_REPORTS_LIMIT),
  }
}

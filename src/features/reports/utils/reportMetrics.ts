import { statusLabels } from '../../../shared/utils/format'
import { isReportOverdue } from './reportDates'
import type { Report, ReportStatus } from '../types/report'

export type StatusMetric = {
  status: ReportStatus
  label: string
  value: number
}

export function countReportsByStatus(reports: Report[]): StatusMetric[] {
  return Object.entries(statusLabels).map(([status, label]) => ({
    status: status as ReportStatus,
    label,
    value: reports.filter((report) => report.status === status).length,
  }))
}

export function countReportsByCategory(reports: Report[]) {
  return countByLabel(reports, (report) => report.categories?.name ?? 'Sin categoría', 'categoria')
}

export function countReportsByArea(reports: Report[]) {
  return countByLabel(reports, (report) => report.areas?.name ?? 'Sin área', 'area')
}

export function countReportsByResponsible(reports: Report[]) {
  return countByLabel(reports, (report) => report.assigned_user?.full_name ?? 'Sin asignar', 'responsable')
}

export function countOverdueReports(reports: Report[]) {
  return reports.filter((report) => isReportOverdue(report)).length
}

export function getStatusCount(metrics: StatusMetric[], status: ReportStatus) {
  return metrics.find((metric) => metric.status === status)?.value ?? 0
}

function countByLabel<Key extends string>(reports: Report[], getLabel: (report: Report) => string, keyName: Key) {
  return Object.values(
    reports.reduce<Record<string, Record<Key, string> & { reportes: number }>>((acc, report) => {
      const key = getLabel(report)
      acc[key] = acc[key] ?? ({ [keyName]: key, reportes: 0 } as Record<Key, string> & { reportes: number })
      acc[key].reportes += 1
      return acc
    }, {}),
  )
}

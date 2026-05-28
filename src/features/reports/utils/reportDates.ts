import type { Report } from '../types/report'

const overdueStatuses = new Set(['PENDIENTE', 'EN_REVISION', 'ASIGNADO', 'EN_PROCESO'])
const overdueDays = 15

export function getDaysOpen(report: Report, now = new Date()) {
  const createdAt = new Date(report.created_at)
  const milliseconds = now.getTime() - createdAt.getTime()
  return Math.max(0, Math.floor(milliseconds / 86_400_000))
}

export function isReportOverdue(report: Report, now = new Date()) {
  return overdueStatuses.has(report.status) && getDaysOpen(report, now) >= overdueDays
}

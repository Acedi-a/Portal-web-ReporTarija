import { formatDate } from '../../../shared/utils/format'
import { priorityLabels } from '../constants/reportOptions'
import type { Report } from '../types/report'

const csvHeaders = ['Titulo', 'Categoria', 'Estado', 'Prioridad', 'Fecha', 'Zona', 'Direccion', 'Area', 'Responsable']

export function createReportsCsv(reports: Report[]) {
  const rows = reports.map((report) => [
    report.title,
    report.categories?.name ?? '',
    report.status,
    priorityLabels[report.priority],
    formatDate(report.created_at),
    report.neighborhood ?? '',
    report.address ?? '',
    report.areas?.name ?? '',
    report.assigned_user?.full_name ?? '',
  ])

  return [csvHeaders, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n')
}

export function downloadReportsCsv(reports: Report[]) {
  const blob = new Blob([createReportsCsv(reports)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `reportes-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

import type { ReportStatus } from '../../features/reports/types/report'

export const statusLabels: Record<ReportStatus, string> = {
  PENDIENTE: 'Pendiente',
  EN_REVISION: 'En revisión',
  ASIGNADO: 'Asignado',
  EN_PROCESO: 'En proceso',
  RESUELTO: 'Resuelto',
  RECHAZADO: 'Rechazado',
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function statusClass(status: ReportStatus) {
  const classes: Record<ReportStatus, string> = {
    PENDIENTE: 'bg-amber-100 text-amber-800 ring-amber-200',
    EN_REVISION: 'bg-blue-100 text-blue-800 ring-blue-200',
    ASIGNADO: 'bg-violet-100 text-violet-800 ring-violet-200',
    EN_PROCESO: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
    RESUELTO: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    RECHAZADO: 'bg-red-100 text-red-800 ring-red-200',
  }

  return classes[status]
}

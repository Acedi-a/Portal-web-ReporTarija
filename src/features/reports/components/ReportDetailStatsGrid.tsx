import { ArrowUp, Building2, CalendarDays, Clock3, Hash, MapPin, Tag, Timer, UserRound } from 'lucide-react'
import { formatDate, statusLabels } from '../../../shared/utils/format'
import { getDaysOpen } from '../utils/reportDates'
import { priorityLabels } from '../constants/reportOptions'
import type { Report } from '../types/report'

type ReportDetailStatsGridProps = {
  report: Report
}

export function ReportDetailStatsGrid({ report }: ReportDetailStatsGridProps) {
  const stats = [
    { icon: CalendarDays, label: 'Creado', value: formatDate(report.created_at) },
    { icon: MapPin, label: 'Ubicación', value: report.address ?? report.neighborhood ?? 'Sin ubicación' },
    { icon: Tag, label: 'Categoría', value: report.categories?.name ?? 'Sin categoría' },
    { icon: ArrowUp, label: 'Prioridad', value: priorityLabels[report.priority] },
    { icon: Hash, label: 'ID del reporte', value: `#${report.id.slice(0, 8)}` },
    { icon: Clock3, label: 'Estado actual', value: statusLabels[report.status] },
    { icon: Timer, label: 'Tiempo transcurrido', value: `${getDaysOpen(report)} días` },
    { icon: Building2, label: 'Área responsable', value: report.areas?.name ?? 'Sin área' },
    { icon: UserRound, label: 'Responsable', value: report.assigned_user?.full_name ?? 'Sin asignar' },
    { icon: MapPin, label: 'Coordenadas', value: `${report.latitude ?? 'N/D'}, ${report.longitude ?? 'N/D'}` },
  ]

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatTile key={stat.label} {...stat} />
      ))}
    </section>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-zinc-200">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 dark:text-zinc-500">{label}</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-950 dark:text-zinc-50">{value}</p>
        </div>
      </div>
    </div>
  )
}

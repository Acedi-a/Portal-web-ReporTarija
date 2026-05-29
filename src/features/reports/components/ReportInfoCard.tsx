import { Building2, MapPin, UserRound, type LucideIcon } from 'lucide-react'
import { Panel } from '../../../shared/components/ui/Panel'
import { priorityLabels } from '../constants/reportOptions'
import type { Report } from '../types/report'

type ReportInfoCardProps = {
  report: Report
}

export function ReportInfoCard({ report }: ReportInfoCardProps) {
  return (
    <Panel className="space-y-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-blue-700 dark:text-zinc-400">Ficha operativa</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-zinc-50">Detalle del reporte</h2>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
          {priorityLabels[report.priority]}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Info icon={UserRound} label="Ciudadano" value={report.citizen?.full_name ?? 'Ciudadano no identificado'} />
        <Info icon={Building2} label="Área" value={report.areas?.name ?? 'Sin área'} />
        <Info label="Responsable" value={report.assigned_user?.full_name ?? 'Sin asignar'} />
        <Info label="Categoría" value={report.categories?.name ?? 'Sin categoría'} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-zinc-50">
          <MapPin className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
          Ubicación registrada
        </div>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
          <Info label="Dirección" value={report.address ?? 'Sin dirección'} compact />
          <Info label="Zona" value={report.neighborhood ?? 'Sin zona'} compact />
          <Info label="Coordenadas" value={`${report.latitude ?? 'N/D'}, ${report.longitude ?? 'N/D'}`} compact />
        </div>
      </div>
    </Panel>
  )
}

function Info({
  icon: Icon,
  label,
  value,
  compact = false,
}: {
  icon?: LucideIcon
  label: string
  value: string
  compact?: boolean
}) {
  return (
    <div className={compact ? '' : 'rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950'}>
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-blue-700 dark:text-zinc-300" /> : null}
        <p className="text-xs uppercase text-slate-400 dark:text-zinc-500">{label}</p>
      </div>
      <p className="mt-1 font-medium text-slate-900 dark:text-zinc-100">{value}</p>
    </div>
  )
}

import { MapPin } from 'lucide-react'
import { Panel } from '../../../shared/components/ui/Panel'
import { priorityLabels } from '../constants/reportOptions'
import type { Report } from '../types/report'

type ReportInfoCardProps = {
  report: Report
}

export function ReportInfoCard({ report }: ReportInfoCardProps) {
  return (
    <Panel className="space-y-4">
      <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Detalle del reporte</h2>
      <p className="text-sm leading-6 text-slate-600 dark:text-zinc-300">{report.description}</p>
      <div className="grid gap-3 text-sm md:grid-cols-2">
        <Info label="Ciudadano" value={report.citizen?.full_name ?? 'Ciudadano no identificado'} />
        <Info label="Prioridad" value={priorityLabels[report.priority]} />
        <Info label="Área" value={report.areas?.name ?? 'Sin área'} />
        <Info label="Responsable" value={report.assigned_user?.full_name ?? 'Sin asignar'} />
        <Info label="Dirección" value={report.address ?? 'Sin dirección'} />
        <Info label="Zona" value={report.neighborhood ?? 'Sin zona'} />
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-zinc-50">
          <MapPin className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
          Ubicación
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
          Latitud {report.latitude ?? 'N/D'}, longitud {report.longitude ?? 'N/D'}
        </p>
      </div>
    </Panel>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-400 dark:text-zinc-500">{label}</p>
      <p className="font-medium text-slate-900 dark:text-zinc-100">{value}</p>
    </div>
  )
}

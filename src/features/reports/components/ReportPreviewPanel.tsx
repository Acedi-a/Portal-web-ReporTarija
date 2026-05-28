import { Link } from 'react-router-dom'
import { ExternalLink, MapPin, X } from 'lucide-react'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate } from '../../../shared/utils/format'
import { priorityLabels } from '../constants/reportOptions'
import type { Evidence, Report } from '../types/report'
import { PriorityBadge } from './PriorityBadge'

type ReportPreviewPanelProps = {
  report: Report
  evidence?: Evidence
  onClose: () => void
}

export function ReportPreviewPanel({ report, evidence, onClose }: ReportPreviewPanelProps) {
  return (
    <aside className="flex h-full min-h-[560px] flex-col border-l border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-zinc-800">
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-zinc-400">Reporte seleccionado</p>
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Detalle rápido</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="Cerrar detalle"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {evidence?.file_url ? (
          <img src={evidence.file_url} alt={evidence.file_name ?? report.title} className="mb-4 h-44 w-full rounded-lg object-cover" />
        ) : null}

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={report.status} />
          <PriorityBadge priority={report.priority} />
        </div>

        <h3 className="text-lg font-semibold leading-tight text-slate-950 dark:text-zinc-50">{report.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-300">{report.description}</p>

        <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <Info label="Categoría" value={report.categories?.name ?? 'Sin categoría'} />
          <Info label="Prioridad" value={priorityLabels[report.priority]} />
          <Info label="Fecha" value={formatDate(report.created_at)} />
          <Info label="Área" value={report.areas?.name ?? 'Sin área'} />
          <Info label="Responsable" value={report.assigned_user?.full_name ?? 'Sin asignar'} />
          <Info label="Ciudadano" value={report.citizen?.full_name ?? 'No identificado'} />
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-zinc-50">
            <MapPin className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
            Ubicación
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">{report.address ?? report.neighborhood ?? 'Sin dirección registrada'}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
            {report.latitude ?? 'N/D'}, {report.longitude ?? 'N/D'}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 p-4 dark:border-zinc-800">
        <Link
          to={`/reports/${report.id}`}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800"
        >
          Abrir detalle completo
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500 dark:text-zinc-400">{label}</span>
      <span className="text-right font-medium text-slate-900 dark:text-zinc-100">{value}</span>
    </div>
  )
}

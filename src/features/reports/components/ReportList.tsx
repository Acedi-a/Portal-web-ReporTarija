import { Link } from 'react-router-dom'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate } from '../../../shared/utils/format'
import type { Evidence, Report } from '../types/report'

type ReportListProps = {
  reports: Report[]
  isLoading: boolean
  mappedCount: number
  evidenceByReport: Record<string, Evidence>
}

export function ReportList({ reports, isLoading, mappedCount, evidenceByReport }: ReportListProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-zinc-800">
        <span className="font-medium text-slate-900 dark:text-zinc-100">{reports.length} reportes</span>
        <span className="text-slate-500 dark:text-zinc-400">{mappedCount} con ubicación</span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">Cargando reportes...</div>
        ) : reports.length === 0 ? (
          <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">No hay reportes con esos filtros.</div>
        ) : (
          reports.map((report) => (
            <ReportListCard key={report.id} report={report} imageUrl={evidenceByReport[report.id]?.file_url} />
          ))
        )}
      </div>
    </>
  )
}

function ReportListCard({ report, imageUrl }: { report: Report; imageUrl?: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="flex gap-3">
        {imageUrl ? <img src={imageUrl} alt="" className="h-20 w-24 rounded-md object-cover" /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 font-medium text-slate-950 dark:text-slate-50">{report.title}</h2>
            <StatusBadge status={report.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{report.categories?.name} · {formatDate(report.created_at)}</p>
          <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{report.neighborhood ?? report.address}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">{report.assigned_user?.full_name ?? 'Sin asignar'}</span>
            <Link className="text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-zinc-300" to={`/reports/${report.id}`}>
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

import { Link } from 'react-router-dom'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import type { ClusterPointProperties } from '../hooks/useReportMapData'
import type { Report } from '../types/report'

type ReportMapPopupProps = {
  report: Report
  imageUrl?: string
}

export function ReportMapPopup({ report, imageUrl }: ReportMapPopupProps) {
  return (
    <div className="overflow-hidden rounded-md bg-white dark:bg-zinc-900">
      {imageUrl ? <img src={imageUrl} alt="" className="h-32 w-full object-cover" /> : null}
      <div className="space-y-2 p-3">
        <StatusBadge status={report.status} />
        <div>
          <h3 className="font-semibold leading-tight text-slate-950 dark:text-slate-50">{report.title}</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{report.categories?.name} · {report.address}</p>
        </div>
        <Link to={`/reports/${report.id}`} className="inline-flex h-9 w-full items-center justify-center rounded-md bg-blue-700 text-sm font-medium text-white hover:bg-blue-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200">
          Abrir reporte
        </Link>
      </div>
    </div>
  )
}

export function ClusterPopup({ point }: { point: ClusterPointProperties }) {
  return (
    <div className="overflow-hidden rounded-md bg-white dark:bg-zinc-900">
      {point.image ? <img src={point.image} alt="" className="h-32 w-full object-cover" /> : null}
      <div className="space-y-2 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-zinc-400">{point.category}</p>
        <h3 className="font-semibold leading-tight text-slate-950 dark:text-slate-50">{point.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{point.address}</p>
        <Link to={`/reports/${point.id}`} className="inline-flex h-9 w-full items-center justify-center rounded-md bg-blue-700 text-sm font-medium text-white hover:bg-blue-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200">
          Abrir reporte
        </Link>
      </div>
    </div>
  )
}

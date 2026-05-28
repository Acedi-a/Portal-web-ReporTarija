import { Link } from 'react-router-dom'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate, statusLabels } from '../../../shared/utils/format'
import { PriorityBadge } from './PriorityBadge'
import { isReportOverdue } from '../utils/reportDates'
import type { Report, ReportStatus } from '../types/report'

const columns = Object.entries(statusLabels) as Array<[ReportStatus, string]>

type ReportKanbanBoardProps = {
  reports: Report[]
}

export function ReportKanbanBoard({ reports }: ReportKanbanBoardProps) {
  return (
    <section className="grid gap-3 overflow-x-auto pb-2 xl:grid-cols-6">
      {columns.map(([status, label]) => {
        const columnReports = reports.filter((report) => report.status === status)

        return (
          <div key={status} className="min-w-64 rounded-lg border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-slate-950 dark:text-zinc-50">{label}</h2>
              <span className="text-xs text-slate-500 dark:text-zinc-400">{columnReports.length}</span>
            </div>
            <div className="space-y-3 p-3">
              {columnReports.map((report) => (
                <KanbanCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

function KanbanCard({ report }: { report: Report }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-slate-950 dark:text-zinc-50">{report.title}</h3>
        <StatusBadge status={report.status} />
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">{report.categories?.name} · {formatDate(report.created_at)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={report.priority} />
        {isReportOverdue(report) ? <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">Vencido</span> : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="truncate text-xs text-slate-500 dark:text-zinc-400">{report.assigned_user?.full_name ?? 'Sin asignar'}</span>
        <Link className="text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-zinc-300" to={`/reports/${report.id}`}>
          Abrir
        </Link>
      </div>
    </article>
  )
}

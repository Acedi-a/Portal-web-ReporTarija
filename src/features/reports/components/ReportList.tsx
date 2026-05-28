import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate } from '../../../shared/utils/format'
import { PriorityBadge } from './PriorityBadge'
import { isReportOverdue } from '../utils/reportDates'
import type { Evidence, Report } from '../types/report'

type ReportListProps = {
  reports: Report[]
  isLoading: boolean
  mappedCount: number
  evidenceByReport: Record<string, Evidence>
  selectedReportId?: string
  onSelectReport: (report: Report) => void
}

const pageSize = 5

export function ReportList({
  reports,
  isLoading,
  mappedCount,
  evidenceByReport,
  selectedReportId,
  onSelectReport,
}: ReportListProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(reports.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return reports.slice(start, start + pageSize)
  }, [currentPage, reports])

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 text-sm dark:border-zinc-800">
        <div>
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Reportes ({reports.length})</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{mappedCount} con ubicación registrada</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">Cargando reportes...</div>
        ) : reports.length === 0 ? (
          <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">No hay reportes con esos filtros.</div>
        ) : (
          paginatedReports.map((report) => (
            <ReportListCard
              key={report.id}
              report={report}
              imageUrl={evidenceByReport[report.id]?.file_url}
              isSelected={report.id === selectedReportId}
              onSelect={() => onSelectReport(report)}
            />
          ))
        )}
      </div>
      {reports.length > pageSize ? (
        <ReportPagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      ) : null}
    </>
  )
}

function ReportPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.slice(0, 4).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange(item)}
          className={`h-9 min-w-9 rounded-md px-3 text-sm font-medium ${
            item === page
              ? 'bg-blue-700 text-white'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          {item}
        </button>
      ))}
      {totalPages > 5 ? <span className="px-1 text-sm text-slate-400">...</span> : null}
      {totalPages > 4 ? (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          className={`h-9 min-w-9 rounded-md px-3 text-sm font-medium ${
            totalPages === page
              ? 'bg-blue-700 text-white'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          {totalPages}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function ReportListCard({
  report,
  imageUrl,
  isSelected,
  onSelect,
}: {
  report: Report
  imageUrl?: string
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border bg-white p-3 text-left transition hover:border-blue-200 hover:shadow-sm dark:bg-zinc-950 dark:hover:border-zinc-700 ${
        isSelected ? 'border-blue-400 ring-2 ring-blue-100 dark:border-zinc-500 dark:ring-zinc-800' : 'border-slate-200 dark:border-zinc-800'
      }`}
    >
      <div className="flex gap-3">
        {imageUrl ? <img src={imageUrl} alt="" className="h-20 w-24 rounded-md object-cover" /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 font-medium text-slate-950 dark:text-slate-50">{report.title}</h2>
            <StatusBadge status={report.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{report.categories?.name} · {formatDate(report.created_at)}</p>
          <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{report.neighborhood ?? report.address}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={report.priority} />
            {isReportOverdue(report) ? <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">Vencido</span> : null}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">{report.assigned_user?.full_name ?? 'Sin asignar'}</span>
            <span className="text-sm font-medium text-blue-700 dark:text-zinc-300">Ver detalle</span>
          </div>
        </div>
      </div>
    </button>
  )
}

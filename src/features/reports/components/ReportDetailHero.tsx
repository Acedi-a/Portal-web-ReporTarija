import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import type { Report } from '../types/report'
import { Button } from '../../../shared/components/ui/Button'

type ReportDetailHeroProps = {
  report: Report
  onOpenActions: () => void
}

export function ReportDetailHero({ report, onOpenActions }: ReportDetailHeroProps) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <Link to="/reports" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-zinc-300">
          <ArrowLeft className="h-4 w-4" />
          Volver a reportes
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold leading-tight text-slate-950 dark:text-zinc-50">{report.title}</h1>
          <StatusBadge status={report.status} />
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500 dark:text-zinc-400">{report.description}</p>
      </div>
      <div className="flex items-center gap-3 pt-8">
        {report.status !== 'RESUELTO' ? (
          <Button variant="secondary" onClick={onOpenActions} className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-zinc-700 dark:text-zinc-100">
            <RefreshCw className="h-4 w-4" />
            Actualizar estado
          </Button>
        ) : null}
      </div>
    </section>
  )
}

import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { Panel } from '../../../shared/components/ui/Panel'
import { formatDate } from '../../../shared/utils/format'
import type { Report } from '../../reports/types/report'

type RecentReportsListProps = {
  reports: Report[]
}

export function RecentReportsList({ reports }: RecentReportsListProps) {
  return (
    <Panel>
      <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Reportes recientes</h2>
      <div className="mt-4 divide-y divide-slate-100 dark:divide-zinc-800">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="font-medium text-slate-900 dark:text-zinc-100">{report.title}</p>
              <p className="text-sm text-slate-500 dark:text-zinc-400">{report.categories?.name} · {formatDate(report.created_at)}</p>
            </div>
            <StatusBadge status={report.status} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

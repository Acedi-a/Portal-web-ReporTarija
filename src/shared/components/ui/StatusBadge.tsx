import type { ReportStatus } from '../../../features/reports/types/report'
import { statusClass, statusLabels } from '../../utils/format'

type StatusBadgeProps = {
  status: ReportStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusClass(status)}`}>
      {statusLabels[status]}
    </span>
  )
}

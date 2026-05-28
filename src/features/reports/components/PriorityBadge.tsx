import { priorityClasses, priorityLabels } from '../constants/reportOptions'
import type { Priority } from '../types/report'

type PriorityBadgeProps = {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${priorityClasses[priority]}`}>
      {priorityLabels[priority]}
    </span>
  )
}

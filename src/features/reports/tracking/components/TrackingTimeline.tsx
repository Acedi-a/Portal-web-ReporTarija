import { StatusBadge } from '../../../../shared/components/ui/StatusBadge'
import { formatDate } from '../../../../shared/utils/format'
import type { TrackingEntry } from '../../types/report'

type TrackingTimelineProps = {
  tracking: TrackingEntry[]
}

export function TrackingTimeline({ tracking }: TrackingTimelineProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Historial de seguimiento</h2>
      {tracking.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">Aún no hay cambios registrados para este reporte.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {tracking.map((entry) => (
            <TrackingTimelineItem key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  )
}

function TrackingTimelineItem({ entry }: { entry: TrackingEntry }) {
  return (
    <div className="rounded-md border border-slate-100 p-3 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={entry.new_status} />
        <span className="text-xs text-slate-500 dark:text-zinc-400">{formatDate(entry.created_at)}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">{entry.comment ?? 'Sin comentario'}</p>
    </div>
  )
}

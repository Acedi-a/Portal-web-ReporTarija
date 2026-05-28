import type { ReactNode } from 'react'
import { Columns3, Download, Map } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'

export type ReportsViewMode = 'map' | 'kanban'

type ReportsToolbarProps = {
  viewMode: ReportsViewMode
  reportCount: number
  onViewModeChange: (mode: ReportsViewMode) => void
  onExport: () => void
}

export function ReportsToolbar({ viewMode, reportCount, onViewModeChange, onExport }: ReportsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
        <ViewButton active={viewMode === 'map'} icon={<Map className="h-4 w-4" />} label="Mapa" onClick={() => onViewModeChange('map')} />
        <ViewButton active={viewMode === 'kanban'} icon={<Columns3 className="h-4 w-4" />} label="Kanban" onClick={() => onViewModeChange('kanban')} />
      </div>
      <Button variant="secondary" onClick={onExport} disabled={reportCount === 0}>
        <Download className="h-4 w-4" />
        Exportar CSV
      </Button>
    </div>
  )
}

function ViewButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium ${
        active
          ? 'bg-blue-700 text-white dark:bg-zinc-100 dark:text-zinc-950'
          : 'text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-900'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

import { AlertTriangle, CheckCircle2, ClipboardList, Clock3 } from 'lucide-react'
import { StatCard } from '../../../shared/components/ui/StatCard'
import type { DashboardMetrics } from '../hooks/useDashboardData'

type DashboardStatGridProps = {
  metrics: DashboardMetrics
}

export function DashboardStatGrid({ metrics }: DashboardStatGridProps) {
  const statCards = [
    { icon: ClipboardList, label: 'Total reportes', value: metrics.total },
    { icon: Clock3, label: 'Pendientes', value: metrics.pending },
    { icon: AlertTriangle, label: 'En proceso', value: metrics.inProgress },
    { icon: CheckCircle2, label: 'Resueltos', value: metrics.resolved },
    { icon: AlertTriangle, label: 'Rechazados', value: metrics.rejected },
    { icon: Clock3, label: 'Vencidos', value: metrics.overdue },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {statCards.map((card) => (
        <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} />
      ))}
    </div>
  )
}

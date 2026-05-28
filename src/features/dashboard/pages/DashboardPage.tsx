import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { DashboardStatGrid } from '../components/DashboardStatGrid'
import { OperationalReportsSummary } from '../components/OperationalReportsSummary'
import { RecentReportsList } from '../components/RecentReportsList'
import { ReportsByStatusChart } from '../components/ReportsByStatusChart'
import { useDashboardData } from '../hooks/useDashboardData'

export function DashboardPage() {
  const dashboardData = useDashboardData()

  if (dashboardData.isLoading) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Cargando métricas...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Panel ReportaTarija" title="Dashboard municipal" />

      <DashboardStatGrid metrics={dashboardData.metrics} />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <ReportsByStatusChart data={dashboardData.chartData} />
        <RecentReportsList reports={dashboardData.recentReports} />
      </div>

      <OperationalReportsSummary reports={dashboardData.reports} />
    </div>
  )
}

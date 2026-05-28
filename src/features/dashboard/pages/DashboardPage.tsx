import { AlertTriangle, CheckCircle2, ClipboardList, Clock3 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getReports } from '../../reports/services/reportService'
import { countOverdueReports, countReportsByStatus, getStatusCount } from '../../reports/utils/reportMetrics'
import { ReportsSummaryContent } from '../../summary/pages/ReportsSummaryPage'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Panel } from '../../../shared/components/ui/Panel'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate } from '../../../shared/utils/format'

const chartColors = ['#f59e0b', '#2563eb', '#7c3aed', '#0891b2', '#059669', '#dc2626']

export function DashboardPage() {
  const { data: reports = [], isLoading } = useQuery({ queryKey: ['reports'], queryFn: () => getReports() })

  const statusMetrics = countReportsByStatus(reports)
  const total = reports.length
  const pending = getStatusCount(statusMetrics, 'PENDIENTE')
  const inProgress = getStatusCount(statusMetrics, 'EN_PROCESO')
  const resolved = getStatusCount(statusMetrics, 'RESUELTO')
  const rejected = getStatusCount(statusMetrics, 'RECHAZADO')
  const overdue = countOverdueReports(reports)
  const chartData = statusMetrics.map((metric) => ({ name: metric.label, value: metric.value }))

  if (isLoading) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Cargando métricas...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Panel ReportaTarija" title="Dashboard municipal" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard icon={ClipboardList} label="Total reportes" value={total} />
        <StatCard icon={Clock3} label="Pendientes" value={pending} />
        <StatCard icon={AlertTriangle} label="En proceso" value={inProgress} />
        <StatCard icon={CheckCircle2} label="Resueltos" value={resolved} />
        <StatCard icon={AlertTriangle} label="Rechazados" value={rejected} />
        <StatCard icon={Clock3} label="Vencidos" value={overdue} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Reportes por estado</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={95} paddingAngle={2}>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Reportes recientes</h2>
          <div className="mt-4 divide-y divide-slate-100 dark:divide-zinc-800">
            {reports.slice(0, 6).map((report) => (
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
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-zinc-50">Informes operativos</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Consulta cortes rápidos por categoría, área responsable y funcionario asignado.
          </p>
        </div>
        <ReportsSummaryContent showHeader={false} />
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: typeof ClipboardList; label: string; value: number }) {
  return (
    <Panel as="div">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-zinc-400">{label}</span>
        <Icon className="h-5 w-5 text-blue-700 dark:text-zinc-300" />
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-zinc-50">{value}</p>
    </Panel>
  )
}

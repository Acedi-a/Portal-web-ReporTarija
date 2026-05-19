import { AlertTriangle, CheckCircle2, ClipboardList, Clock3 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getReports } from '../../reports/services/reportService'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate, statusLabels } from '../../../shared/utils/format'

const chartColors = ['#f59e0b', '#2563eb', '#7c3aed', '#0891b2', '#059669', '#dc2626']

export function DashboardPage() {
  const { data: reports = [], isLoading } = useQuery({ queryKey: ['reports'], queryFn: () => getReports() })

  const total = reports.length
  const pending = reports.filter((report) => report.status === 'PENDIENTE').length
  const inProgress = reports.filter((report) => report.status === 'EN_PROCESO').length
  const resolved = reports.filter((report) => report.status === 'RESUELTO').length
  const rejected = reports.filter((report) => report.status === 'RECHAZADO').length
  const chartData = Object.entries(statusLabels).map(([status, label]) => ({
    name: label,
    value: reports.filter((report) => report.status === status).length,
  }))

  if (isLoading) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Cargando métricas...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-700 dark:text-zinc-400">Panel ReportaTarija</p>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">Dashboard municipal</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={ClipboardList} label="Total reportes" value={total} />
        <StatCard icon={Clock3} label="Pendientes" value={pending} />
        <StatCard icon={AlertTriangle} label="En proceso" value={inProgress} />
        <StatCard icon={CheckCircle2} label="Resueltos" value={resolved} />
        <StatCard icon={AlertTriangle} label="Rechazados" value={rejected} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
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
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
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
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: typeof ClipboardList; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-zinc-400">{label}</span>
        <Icon className="h-5 w-5 text-blue-700 dark:text-zinc-300" />
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-zinc-50">{value}</p>
    </div>
  )
}

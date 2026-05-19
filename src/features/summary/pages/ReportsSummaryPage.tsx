import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getReports } from '../../reports/services/reportService'
import { statusLabels } from '../../../shared/utils/format'

type ChartRow = {
  reportes: number
} & Record<string, string | number>

export function ReportsSummaryPage() {
  const { data: reports = [] } = useQuery({ queryKey: ['reports'], queryFn: () => getReports() })
  const byStatus = Object.entries(statusLabels).map(([status, label]) => ({
    estado: label,
    reportes: reports.filter((report) => report.status === status).length,
  }))
  const byCategory = Object.values(
    reports.reduce<Record<string, { categoria: string; reportes: number }>>((acc, report) => {
      const key = report.categories?.name ?? 'Sin categoría'
      acc[key] = acc[key] ?? { categoria: key, reportes: 0 }
      acc[key].reportes += 1
      return acc
    }, {}),
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">Informes</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">Resumen básico por estado y categoría.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Chart title="Reportes por estado" data={byStatus} xKey="estado" />
        <Chart title="Reportes por categoría" data={byCategory} xKey="categoria" />
      </div>
    </div>
  )
}

function Chart({ title, data, xKey }: { title: string; data: ChartRow[]; xKey: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold text-slate-950 dark:text-zinc-50">{title}</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="reportes" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

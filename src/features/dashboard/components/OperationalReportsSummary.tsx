import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Panel } from '../../../shared/components/ui/Panel'
import type { Report } from '../../reports/types/report'
import {
  countOverdueReports,
  countReportsByArea,
  countReportsByCategory,
  countReportsByResponsible,
} from '../../reports/utils/reportMetrics'
import { REPORT_OVERDUE_DAYS } from '../../reports/utils/reportDates'

type ChartRow = {
  reportes: number
} & Record<string, string | number>

type OperationalReportsSummaryProps = {
  reports: Report[]
}

export function OperationalReportsSummary({ reports }: OperationalReportsSummaryProps) {
  const byCategory = countReportsByCategory(reports)
  const byArea = countReportsByArea(reports)
  const byResponsible = countReportsByResponsible(reports)
  const overdueCount = countOverdueReports(reports)

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold text-slate-950 dark:text-zinc-50">Informes operativos</h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Consulta cortes rápidos por categoría, área responsable y funcionario asignado.
        </p>
      </div>
      <div className="space-y-5">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Reportes vencidos</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Reportes abiertos con {REPORT_OVERDUE_DAYS} o más días sin resolución.
              </p>
            </div>
            <p className="text-3xl font-semibold text-red-700">{overdueCount}</p>
          </div>
        </Panel>
        <div className="grid gap-4 lg:grid-cols-2">
          <SummaryChart title="Reportes por categoría" data={byCategory} xKey="categoria" />
          <SummaryChart title="Reportes por área responsable" data={byArea} xKey="area" />
          <SummaryChart title="Reportes por responsable" data={byResponsible} xKey="responsable" />
        </div>
      </div>
    </section>
  )
}

function SummaryChart({ title, data, xKey }: { title: string; data: ChartRow[]; xKey: string }) {
  return (
    <Panel>
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
    </Panel>
  )
}

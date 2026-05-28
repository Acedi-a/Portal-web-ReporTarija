import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getReports } from '../../reports/services/reportService'
import {
  countOverdueReports,
  countReportsByArea,
  countReportsByCategory,
  countReportsByResponsible,
  countReportsByStatus,
} from '../../reports/utils/reportMetrics'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Panel } from '../../../shared/components/ui/Panel'

type ChartRow = {
  reportes: number
} & Record<string, string | number>

export function ReportsSummaryPage() {
  return <ReportsSummaryContent />
}

type ReportsSummaryContentProps = {
  showHeader?: boolean
  showStatusChart?: boolean
}

export function ReportsSummaryContent({ showHeader = true, showStatusChart = true }: ReportsSummaryContentProps) {
  const { data: reports = [] } = useQuery({ queryKey: ['reports'], queryFn: () => getReports() })
  const byStatus = countReportsByStatus(reports).map((metric) => ({ estado: metric.label, reportes: metric.value }))
  const byCategory = countReportsByCategory(reports)
  const byArea = countReportsByArea(reports)
  const byResponsible = countReportsByResponsible(reports)
  const overdueCount = countOverdueReports(reports)

  return (
    <div className="space-y-5">
      {showHeader ? <PageHeader title="Informes" description="Resumen operativo por estado, categoría, área y responsable." /> : null}
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Reportes vencidos</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Reportes abiertos con tres o más días sin resolución.</p>
          </div>
          <p className="text-3xl font-semibold text-red-700">{overdueCount}</p>
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        {showStatusChart ? <Chart title="Reportes por estado" data={byStatus} xKey="estado" /> : null}
        <Chart title="Reportes por categoría" data={byCategory} xKey="categoria" />
        <Chart title="Reportes por área responsable" data={byArea} xKey="area" />
        <Chart title="Reportes por responsable" data={byResponsible} xKey="responsable" />
      </div>
    </div>
  )
}

function Chart({ title, data, xKey }: { title: string; data: ChartRow[]; xKey: string }) {
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

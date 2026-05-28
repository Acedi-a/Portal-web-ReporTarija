import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Panel } from '../../../shared/components/ui/Panel'
import { DASHBOARD_CHART_COLORS } from '../constants/dashboardOptions'

type ChartData = {
  name: string
  value: number
}

type ReportsByStatusChartProps = {
  data: ChartData[]
}

export function ReportsByStatusChart({ data }: ReportsByStatusChartProps) {
  return (
    <Panel>
      <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Reportes por estado</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={95} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={DASHBOARD_CHART_COLORS[index % DASHBOARD_CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

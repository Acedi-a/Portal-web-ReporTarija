import { useQuery } from '@tanstack/react-query'
import { getReports } from '../services/reportService'
import { getCategories } from '../services/categoryService'
import { getAllEvidences } from '../services/evidenceService'
import { ReportFilters } from '../components/ReportFilters'
import { ReportList } from '../components/ReportList'
import { ReportMap } from '../components/ReportMap'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportMapData } from '../hooks/useReportMapData'

export function ReportsPage() {
  const reportFilters = useReportFilters()
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports', reportFilters.filters],
    queryFn: () => getReports(reportFilters.filters),
  })
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: evidences = [] } = useQuery({ queryKey: ['evidences'], queryFn: getAllEvidences })
  const { evidenceByReport, mappedReports, geoJsonData } = useReportMapData(reports, evidences)

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-blue-700 dark:text-zinc-400">Centro de operaciones</p>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Gestión geográfica de reportes</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Visualiza incidencias urbanas por ubicación y prioriza la atención municipal.</p>
      </div>

      <section className="grid min-h-[calc(100vh-12rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 xl:grid-cols-[430px_1fr]">
        <aside className="flex min-h-[560px] flex-col border-r border-slate-200 dark:border-zinc-800">
          <ReportFilters
            search={reportFilters.search}
            onSearchChange={reportFilters.setSearch}
            status={reportFilters.status}
            onStatusChange={reportFilters.setStatus}
            category={reportFilters.category}
            onCategoryChange={reportFilters.setCategory}
            categories={categories}
          />
          <ReportList
            reports={reports}
            isLoading={isLoading}
            mappedCount={mappedReports.length}
            evidenceByReport={evidenceByReport}
          />
        </aside>

        <ReportMap
          mappedReports={mappedReports}
          geoJsonData={geoJsonData}
          evidenceByReport={evidenceByReport}
        />
      </section>
    </div>
  )
}

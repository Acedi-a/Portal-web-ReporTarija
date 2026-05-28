import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getReports } from '../services/reportService'
import { getCategories } from '../services/categoryService'
import { getAllEvidences } from '../services/evidenceService'
import { getAreas, getStaff } from '../../staff/services/staffService'
import { ReportFilters } from '../components/ReportFilters'
import { ReportKanbanBoard } from '../components/ReportKanbanBoard'
import { ReportList } from '../components/ReportList'
import { ReportMap } from '../components/ReportMap'
import { ReportPreviewPanel } from '../components/ReportPreviewPanel'
import { ReportsToolbar, type ReportsViewMode } from '../components/ReportsToolbar'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportMapData } from '../hooks/useReportMapData'
import { downloadReportsCsv } from '../utils/exportReports'
import { PageHeader } from '../../../shared/components/ui/PageHeader'

export function ReportsPage() {
  const [viewMode, setViewMode] = useState<ReportsViewMode>('map')
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const reportFilters = useReportFilters()
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports', reportFilters.filters],
    queryFn: () => getReports(reportFilters.filters),
  })
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: areas = [] } = useQuery({ queryKey: ['areas'], queryFn: getAreas })
  const { data: staff = [] } = useQuery({ queryKey: ['staff'], queryFn: getStaff })
  const { data: evidences = [] } = useQuery({ queryKey: ['evidences'], queryFn: getAllEvidences })
  const reportsVisibleOnMap = useMemo(() => reports.filter((report) => report.status !== 'RESUELTO'), [reports])
  const { evidenceByReport, mappedReports, geoJsonData } = useReportMapData(reportsVisibleOnMap, evidences)
  const selectedReport = reports.find((report) => report.id === selectedReportId) ?? null
  const selectedReportOnMap = selectedReport?.status === 'RESUELTO' ? null : selectedReport

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Centro de operaciones"
        title="Gestión geográfica de reportes"
        description="Visualiza incidencias urbanas por ubicación y prioriza la atención municipal."
      />

      <div className="grid gap-3 xl:grid-cols-[260px_1fr]">
        <ReportsToolbar
          viewMode={viewMode}
          reportCount={reports.length}
          onViewModeChange={setViewMode}
          onExport={() => downloadReportsCsv(reports)}
        />
        <ReportFilters
          search={reportFilters.search}
          onSearchChange={reportFilters.setSearch}
          status={reportFilters.status}
          onStatusChange={reportFilters.setStatus}
          category={reportFilters.category}
          onCategoryChange={reportFilters.setCategory}
          priority={reportFilters.priority}
          onPriorityChange={reportFilters.setPriority}
          area={reportFilters.area}
          onAreaChange={reportFilters.setArea}
          responsible={reportFilters.responsible}
          onResponsibleChange={reportFilters.setResponsible}
          fromDate={reportFilters.fromDate}
          onFromDateChange={reportFilters.setFromDate}
          toDate={reportFilters.toDate}
          onToDateChange={reportFilters.setToDate}
          categories={categories}
          areas={areas}
          staff={staff}
        />
      </div>

      {viewMode === 'map' ? (
        <section className="grid min-h-[calc(100vh-15rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 xl:grid-cols-[minmax(0,1fr)_470px] 2xl:grid-cols-[minmax(0,1fr)_520px]">
          <ReportMap
            mappedReports={mappedReports}
            geoJsonData={geoJsonData}
            evidenceByReport={evidenceByReport}
            selectedReport={selectedReportOnMap}
            onSelectReport={(report) => setSelectedReportId(report.id)}
          />
          {selectedReport ? (
            <ReportPreviewPanel
              report={selectedReport}
              evidence={evidenceByReport[selectedReport.id]}
              onClose={() => setSelectedReportId(null)}
            />
          ) : (
            <aside className="flex min-h-[560px] flex-col border-l border-slate-200 dark:border-zinc-800">
              <ReportList
                reports={reports}
                isLoading={isLoading}
                mappedCount={mappedReports.length}
                evidenceByReport={evidenceByReport}
                selectedReportId={selectedReportId ?? undefined}
                onSelectReport={(report) => setSelectedReportId(report.id)}
              />
            </aside>
          )}
        </section>
      ) : (
        <section className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <ReportKanbanBoard reports={reports} />
        </section>
      )}
    </div>
  )
}

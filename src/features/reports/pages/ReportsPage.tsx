import { useState } from 'react'
import { ReportFilters } from '../components/ReportFilters'
import { ReportKanbanBoard } from '../components/ReportKanbanBoard'
import { ReportList } from '../components/ReportList'
import { ReportMap } from '../components/ReportMap'
import { ReportPreviewPanel } from '../components/ReportPreviewPanel'
import { ReportsToolbar, type ReportsViewMode } from '../components/ReportsToolbar'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportsPageData } from '../hooks/useReportsPageData'
import { downloadReportsCsv } from '../utils/exportReports'
import { PageHeader } from '../../../shared/components/ui/PageHeader'

export function ReportsPage() {
  const [viewMode, setViewMode] = useState<ReportsViewMode>('map')
  const reportFilters = useReportFilters()
  const reportsData = useReportsPageData(reportFilters.filters)

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
          reportCount={reportsData.reports.length}
          onViewModeChange={setViewMode}
          onExport={() => downloadReportsCsv(reportsData.reports)}
        />
        <ReportFilters
          filters={reportFilters.filters}
          onFilterChange={reportFilters.setFilter}
          options={{
            categories: reportsData.categories,
            areas: reportsData.areas,
            staff: reportsData.staff,
          }}
        />
      </div>

      {viewMode === 'map' ? (
        <section className="grid min-h-[calc(100vh-15rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 xl:grid-cols-[minmax(0,1fr)_470px] 2xl:grid-cols-[minmax(0,1fr)_520px]">
          <ReportMap
            mappedReports={reportsData.mappedReports}
            geoJsonData={reportsData.geoJsonData}
            evidenceByReport={reportsData.evidenceByReport}
            selectedReport={reportsData.selectedReportOnMap}
            onSelectReport={reportsData.selectReport}
          />
          {reportsData.selectedReport ? (
            <ReportPreviewPanel
              report={reportsData.selectedReport}
              evidence={reportsData.evidenceByReport[reportsData.selectedReport.id]}
              onClose={reportsData.clearSelectedReport}
            />
          ) : (
            <aside className="flex min-h-[560px] flex-col border-l border-slate-200 dark:border-zinc-800">
              <ReportList
                reports={reportsData.reports}
                isLoading={reportsData.isLoadingReports}
                mappedCount={reportsData.mappedReports.length}
                evidenceByReport={reportsData.evidenceByReport}
                selectedReportId={reportsData.selectedReportId ?? undefined}
                onSelectReport={reportsData.selectReport}
              />
            </aside>
          )}
        </section>
      ) : (
        <section className="overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <ReportKanbanBoard reports={reportsData.reports} />
        </section>
      )}
    </div>
  )
}

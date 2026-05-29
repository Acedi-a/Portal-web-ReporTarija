import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ReportInfoCard } from '../components/ReportInfoCard'
import { EvidenceViewer } from '../components/EvidenceViewer'
import { ReportProgress } from '../components/ReportProgress'
import { TrackingTimeline } from '../tracking/components/TrackingTimeline'
import { useReportDetail } from '../hooks/useReportDetail'
import { ReportAiAssistant } from '../ai/components/ReportAiAssistant'
import { ReportDetailHero } from '../components/ReportDetailHero'
import { ReportActionsModal } from '../components/ReportActionsModal'
import { ReportDetailStatsGrid } from '../components/ReportDetailStatsGrid'
import { useReportAiAnalysis } from '../ai/hooks/useReportAiAnalysis'
import type { Report } from '../types/report'

type LoadedReportDetail = Omit<ReturnType<typeof useReportDetail>, 'report'> & {
  report: Report
}

export function ReportDetailPage() {
  const { id = '' } = useParams()
  const reportDetail = useReportDetail(id)
  const { report, isLoading } = reportDetail

  if (isLoading) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Cargando reporte...</div>
  }

  if (!report) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Reporte no encontrado.</div>
  }

  return <ReportDetailContent reportDetail={{ ...reportDetail, report }} />
}

function ReportDetailContent({ reportDetail }: { reportDetail: LoadedReportDetail }) {
  const [actionsOpen, setActionsOpen] = useState(false)
  const { report, statusForm, assignmentForm, evidenceUpload } = reportDetail
  const aiAnalysis = useReportAiAnalysis(report, reportDetail.evidences)

  return (
    <div className="space-y-5">
      <ReportDetailHero report={report} onOpenActions={() => setActionsOpen(true)} />
      <ReportDetailStatsGrid report={report} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="space-y-5">
          <ReportProgress status={report.status} />
          <ReportInfoCard report={report} />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <EvidenceViewer
              evidences={reportDetail.evidences}
              isUploading={evidenceUpload.isUploading}
              onUpload={evidenceUpload.upload}
            />
            <TrackingTimeline tracking={reportDetail.tracking} />
          </div>
        </main>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <ReportAiAssistant
            analysis={aiAnalysis.analysis}
            isAnalyzing={aiAnalysis.isAnalyzing}
            error={aiAnalysis.error}
            onAnalyze={aiAnalysis.analyze}
          />
        </aside>
      </div>

      <ReportActionsModal
        open={actionsOpen}
        onClose={() => setActionsOpen(false)}
        statusForm={statusForm}
        assignmentForm={assignmentForm}
        areas={reportDetail.areas}
        staff={reportDetail.staff}
        aiAnalysis={aiAnalysis.analysis}
        isAnalyzing={aiAnalysis.isAnalyzing}
        onAnalyze={aiAnalysis.analyze}
      />
    </div>
  )
}

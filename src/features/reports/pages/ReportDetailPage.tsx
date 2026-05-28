import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate } from '../../../shared/utils/format'
import { ReportInfoCard } from '../components/ReportInfoCard'
import { StatusSelector } from '../components/StatusSelector'
import { ResponsibleSelector } from '../components/ResponsibleSelector'
import { EvidenceViewer } from '../components/EvidenceViewer'
import { ReportProgress } from '../components/ReportProgress'
import { TrackingTimeline } from '../../tracking/components/TrackingTimeline'
import { Panel } from '../../../shared/components/ui/Panel'
import { useReportDetail } from '../hooks/useReportDetail'

export function ReportDetailPage() {
  const { id = '' } = useParams()
  const reportDetail = useReportDetail(id)
  const { report, isLoading, statusForm, assignmentForm, evidenceUpload } = reportDetail

  if (isLoading) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Cargando reporte...</div>
  }

  if (!report) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Reporte no encontrado.</div>
  }

  return (
    <div className="space-y-5">
      <Link to="/reports" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-zinc-300">
        <ArrowLeft className="h-4 w-4" />
        Volver a reportes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">{report.title}</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{report.categories?.name} · {formatDate(report.created_at)}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <ReportProgress status={report.status} />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <ReportInfoCard report={report} />

        <Panel className="space-y-4">
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Acciones</h2>
          <StatusSelector
            value={statusForm.newStatus}
            comment={statusForm.comment}
            error={statusForm.error}
            isSubmitting={statusForm.isSubmitting}
            onStatusChange={statusForm.changeStatus}
            onCommentChange={statusForm.changeComment}
            onSubmit={statusForm.submit}
          />
          <div className="border-t border-slate-100 pt-4 dark:border-zinc-800">
            {assignmentForm.error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{assignmentForm.error}</p> : null}
            <ResponsibleSelector
              areaId={assignmentForm.areaId}
              userId={assignmentForm.userId}
              areas={reportDetail.areas}
              staff={reportDetail.staff}
              isSubmitting={assignmentForm.isSubmitting}
              onAreaChange={assignmentForm.changeArea}
              onUserChange={assignmentForm.changeResponsible}
              onSubmit={assignmentForm.submit}
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EvidenceViewer
          evidences={reportDetail.evidences}
          isUploading={evidenceUpload.isUploading}
          onUpload={evidenceUpload.upload}
        />
        <TrackingTimeline tracking={reportDetail.tracking} />
      </div>
    </div>
  )
}

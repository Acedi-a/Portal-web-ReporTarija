import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assignResponsible, getReportById, updateReportStatus } from '../services/reportService'
import { getEvidencesByReportId, uploadEvidence } from '../services/evidenceService'
import { getAreas, getStaff } from '../../staff/services/staffService'
import { getTrackingByReportId } from '../../tracking/services/trackingService'
import type { ReportStatus } from '../types/report'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate } from '../../../shared/utils/format'
import { validateAssignment, validateStatusChange } from '../utils/reportActions'
import { ReportInfoCard } from '../components/ReportInfoCard'
import { StatusSelector } from '../components/StatusSelector'
import { ResponsibleSelector } from '../components/ResponsibleSelector'
import { EvidenceViewer } from '../components/EvidenceViewer'
import { ReportProgress } from '../components/ReportProgress'
import { TrackingTimeline } from '../../tracking/components/TrackingTimeline'
import { Panel } from '../../../shared/components/ui/Panel'

export function ReportDetailPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const [newStatus, setNewStatus] = useState<ReportStatus>('EN_REVISION')
  const [comment, setComment] = useState('')
  const [userId, setUserId] = useState('')
  const [areaId, setAreaId] = useState('')
  const [statusError, setStatusError] = useState('')
  const [assignmentError, setAssignmentError] = useState('')
  const { data: report, isLoading } = useQuery({ queryKey: ['report', id], queryFn: () => getReportById(id), enabled: Boolean(id) })
  const { data: evidences = [] } = useQuery({ queryKey: ['evidences', id], queryFn: () => getEvidencesByReportId(id), enabled: Boolean(id) })
  const { data: tracking = [] } = useQuery({ queryKey: ['tracking', id], queryFn: () => getTrackingByReportId(id), enabled: Boolean(id) })
  const { data: staff = [] } = useQuery({ queryKey: ['staff'], queryFn: getStaff })
  const { data: areas = [] } = useQuery({ queryKey: ['areas'], queryFn: getAreas })

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['report', id] })
    await queryClient.invalidateQueries({ queryKey: ['tracking', id] })
    await queryClient.invalidateQueries({ queryKey: ['reports'] })
    await queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const statusMutation = useMutation({
    mutationFn: async () => {
      if (!report) return
      await updateReportStatus(report, newStatus, comment)
    },
    onSuccess: refresh,
  })

  const assignmentMutation = useMutation({
    mutationFn: async () => {
      if (!report) return
      await assignResponsible(report, userId, areaId)
    },
    onSuccess: refresh,
  })
  const evidenceMutation = useMutation({
    mutationFn: (file: File) => uploadEvidence(id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['evidences', id] }),
  })

  function handleStatusSubmit() {
    const error = validateStatusChange(newStatus, comment)
    setStatusError(error)

    if (!error) {
      statusMutation.mutate()
    }
  }

  function handleAssignmentSubmit() {
    const error = validateAssignment(userId, areaId)
    setAssignmentError(error)

    if (!error) {
      assignmentMutation.mutate()
    }
  }

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
            value={newStatus}
            comment={comment}
            error={statusError}
            isSubmitting={statusMutation.isPending}
            onStatusChange={(status) => {
              setNewStatus(status)
              setStatusError('')
            }}
            onCommentChange={(value) => {
              setComment(value)
              setStatusError('')
            }}
            onSubmit={handleStatusSubmit}
          />
          <div className="border-t border-slate-100 pt-4 dark:border-zinc-800">
            {assignmentError ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{assignmentError}</p> : null}
            <ResponsibleSelector
              areaId={areaId}
              userId={userId}
              areas={areas}
              staff={staff}
              isSubmitting={assignmentMutation.isPending}
              onAreaChange={(value) => {
                setAreaId(value)
                setAssignmentError('')
              }}
              onUserChange={(value) => {
                setUserId(value)
                setAssignmentError('')
              }}
              onSubmit={handleAssignmentSubmit}
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EvidenceViewer
          evidences={evidences}
          isUploading={evidenceMutation.isPending}
          onUpload={(file) => evidenceMutation.mutate(file)}
        />
        <TrackingTimeline tracking={tracking} />
      </div>
    </div>
  )
}

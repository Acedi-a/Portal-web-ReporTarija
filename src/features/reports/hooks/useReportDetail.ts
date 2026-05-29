import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAreas, getStaff } from '../../staff/services/staffService'
import { getTrackingByReportId } from '../tracking/services/trackingService'
import { getEvidencesByReportId, uploadEvidence } from '../services/evidenceService'
import { assignResponsible, getReportById, updateReportStatus } from '../services/reportService'
import { validateAssignment, validateStatusChange } from '../utils/reportActions'
import type { ReportStatus } from '../types/report'

export function useReportDetail(reportId: string) {
  const queryClient = useQueryClient()
  const [newStatus, setNewStatus] = useState<ReportStatus>('EN_REVISION')
  const [comment, setComment] = useState('')
  const [userId, setUserId] = useState('')
  const [areaId, setAreaId] = useState('')
  const [statusError, setStatusError] = useState('')
  const [assignmentError, setAssignmentError] = useState('')

  const reportQuery = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => getReportById(reportId),
    enabled: Boolean(reportId),
  })
  const evidencesQuery = useQuery({
    queryKey: ['evidences', reportId],
    queryFn: () => getEvidencesByReportId(reportId),
    enabled: Boolean(reportId),
  })
  const trackingQuery = useQuery({
    queryKey: ['tracking', reportId],
    queryFn: () => getTrackingByReportId(reportId),
    enabled: Boolean(reportId),
  })
  const staffQuery = useQuery({ queryKey: ['staff'], queryFn: getStaff })
  const areasQuery = useQuery({ queryKey: ['areas'], queryFn: getAreas })

  async function refreshReportDetail() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['report', reportId] }),
      queryClient.invalidateQueries({ queryKey: ['tracking', reportId] }),
      queryClient.invalidateQueries({ queryKey: ['reports'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    ])
  }

  const statusMutation = useMutation({
    mutationFn: async () => {
      if (!reportQuery.data) return
      await updateReportStatus({
        reportId: reportQuery.data.id,
        reportTitle: reportQuery.data.title,
        previousStatus: reportQuery.data.status,
        newStatus,
        comment,
        resolvedAt: reportQuery.data.resolved_at,
      })
    },
    onSuccess: refreshReportDetail,
  })

  const assignmentMutation = useMutation({
    mutationFn: async () => {
      if (!reportQuery.data) return
      await assignResponsible({
        reportId: reportQuery.data.id,
        reportTitle: reportQuery.data.title,
        previousStatus: reportQuery.data.status,
        userId,
        areaId,
      })
    },
    onSuccess: refreshReportDetail,
  })

  const evidenceMutation = useMutation({
    mutationFn: (file: File) => uploadEvidence({ reportId, file }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['evidences', reportId] }),
  })

  function changeStatus(status: ReportStatus) {
    setNewStatus(status)
    setStatusError('')
  }

  function changeStatusComment(value: string) {
    setComment(value)
    setStatusError('')
  }

  function submitStatusChange() {
    const error = validateStatusChange(newStatus, comment)
    setStatusError(error)

    if (!error) {
      statusMutation.mutate()
    }
  }

  function changeArea(value: string) {
    setAreaId(value)
    setAssignmentError('')
  }

  function changeResponsible(value: string) {
    setUserId(value)
    setAssignmentError('')
  }

  function submitAssignment() {
    const error = validateAssignment(userId, areaId)
    setAssignmentError(error)

    if (!error) {
      assignmentMutation.mutate()
    }
  }

  return {
    report: reportQuery.data,
    isLoading: reportQuery.isLoading,
    evidences: evidencesQuery.data ?? [],
    tracking: trackingQuery.data ?? [],
    staff: staffQuery.data ?? [],
    areas: areasQuery.data ?? [],
    statusForm: {
      newStatus,
      comment,
      error: statusError,
      isSubmitting: statusMutation.isPending,
      changeStatus,
      changeComment: changeStatusComment,
      submit: submitStatusChange,
    },
    assignmentForm: {
      userId,
      areaId,
      error: assignmentError,
      isSubmitting: assignmentMutation.isPending,
      changeArea,
      changeResponsible,
      submit: submitAssignment,
    },
    evidenceUpload: {
      isUploading: evidenceMutation.isPending,
      upload: (file: File) => evidenceMutation.mutate(file),
    },
  }
}

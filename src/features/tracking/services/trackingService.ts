import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import type { ReportStatus, TrackingEntry } from '../../reports/types/report'

export async function getTrackingByReportId(reportId: string) {
  const { data, error } = await insforge.database
    .from('tracking')
    .select('*, users:changed_by(id,full_name,email,role,is_active)')
    .eq('report_id', reportId)
    .order('created_at', { ascending: false })

  assertNoError(error)
  return (data ?? []) as TrackingEntry[]
}

export async function createTrackingEntry(input: {
  reportId: string
  previousStatus: ReportStatus
  newStatus: ReportStatus
  comment?: string
}) {
  const { error } = await insforge.database.from('tracking').insert({
    report_id: input.reportId,
    previous_status: input.previousStatus,
    new_status: input.newStatus,
    comment: input.comment || 'Cambio de estado desde el portal municipal.',
  })

  assertNoError(error)
}

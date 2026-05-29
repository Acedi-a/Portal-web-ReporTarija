import { insforge } from '../../../../lib/insforge'
import { assertNoError } from '../../../../lib/insforgeErrors'
import type { TrackingEntry } from '../../types/report'
import type { CreateTrackingEntryDto } from '../dtos/trackingDtos'

const trackingSelect = '*, users:changed_by(id,full_name,email,role,is_active)'
const defaultTrackingComment = 'Cambio de estado desde el portal municipal.'

export async function getTrackingByReportId(reportId: string) {
  const { data, error } = await insforge.database
    .from('tracking')
    .select(trackingSelect)
    .eq('report_id', reportId)
    .order('created_at', { ascending: false })

  assertNoError(error)
  return (data ?? []) as TrackingEntry[]
}

export async function createTrackingEntry(input: CreateTrackingEntryDto) {
  const { error } = await insforge.database.from('tracking').insert({
    report_id: input.reportId,
    previous_status: input.previousStatus,
    new_status: input.newStatus,
    comment: input.comment || defaultTrackingComment,
  })

  assertNoError(error)
}

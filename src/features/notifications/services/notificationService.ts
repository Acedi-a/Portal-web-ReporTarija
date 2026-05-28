import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import { statusLabels } from '../../../shared/utils/format'
import type { ReportStatus } from '../../reports/types/report'

export async function getNotifications() {
  const { data, error } = await insforge.database
    .from('notifications')
    .select('*, reports(id,title,status)')
    .order('created_at', { ascending: false })
    .limit(20)

  assertNoError(error)
  return data ?? []
}

export async function createReportUpdatedNotification(input: {
  reportId: string
  reportTitle: string
  newStatus: ReportStatus
}) {
  const { error } = await insforge.database.from('notifications').insert({
    report_id: input.reportId,
    title: 'Reporte actualizado',
    message: `El reporte "${input.reportTitle}" cambió a ${statusLabels[input.newStatus]}.`,
    type: input.newStatus === 'RESUELTO' ? 'SUCCESS' : 'INFO',
  })

  assertNoError(error)
}

export async function createReportAssignedNotification(input: {
  reportId: string
  reportTitle: string
}) {
  const { error } = await insforge.database.from('notifications').insert({
    report_id: input.reportId,
    title: 'Reporte asignado',
    message: `El reporte "${input.reportTitle}" fue asignado para atención municipal.`,
    type: 'INFO',
  })

  assertNoError(error)
}

export async function markNotificationAsRead(id: number) {
  const { error } = await insforge.database.from('notifications').update({ is_read: true }).eq('id', id)
  assertNoError(error)
}

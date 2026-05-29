import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import { statusLabels } from '../../../shared/utils/format'
import type { ReportStatus } from '../../reports/types/report'
import { NOTIFICATIONS_LIMIT } from '../constants/notificationOptions'
import type { CreateNotificationPayload, PortalNotification } from '../types/notification'

export async function getNotifications() {
  const { data, error } = await insforge.database
    .from('notifications')
    .select('*, reports(id,title,status)')
    .order('created_at', { ascending: false })
    .limit(NOTIFICATIONS_LIMIT)

  assertNoError(error)
  return (data ?? []) as PortalNotification[]
}

export async function getUnreadNotificationsCount() {
  const { data, error } = await insforge.database
    .from('notifications')
    .select('id')
    .eq('is_read', false)

  assertNoError(error)
  return data?.length ?? 0
}

export async function createNotification(payload: CreateNotificationPayload) {
  const { error } = await insforge.database.from('notifications').insert({
    ...payload,
    type: payload.type ?? 'INFO',
  })

  assertNoError(error)
}

export async function createReportUpdatedNotification(input: {
  reportId: string
  reportTitle: string
  newStatus: ReportStatus
}) {
  await createNotification({
    report_id: input.reportId,
    title: 'Reporte actualizado',
    message: `El reporte "${input.reportTitle}" cambió a ${statusLabels[input.newStatus]}.`,
    type: input.newStatus === 'RESUELTO' ? 'SUCCESS' : 'INFO',
  })
}

export async function createReportAssignedNotification(input: {
  reportId: string
  reportTitle: string
}) {
  await createNotification({
    report_id: input.reportId,
    title: 'Reporte asignado',
    message: `El reporte "${input.reportTitle}" fue asignado para atención municipal.`,
    type: 'INFO',
  })
}

export async function markNotificationAsRead(id: string) {
  const { error } = await insforge.database.from('notifications').update({ is_read: true }).eq('id', id)
  assertNoError(error)
}

export async function markAllNotificationsAsRead() {
  const { error } = await insforge.database.from('notifications').update({ is_read: true }).eq('is_read', false)
  assertNoError(error)
}

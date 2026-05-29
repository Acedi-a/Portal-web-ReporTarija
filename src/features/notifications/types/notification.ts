import type { ReportStatus } from '../../reports/types/report'

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR'

export type PortalNotification = {
  id: string
  user_id: string | null
  report_id: string | null
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  created_at: string
  reports?: {
    id: string
    title: string
    status: ReportStatus
  } | null
}

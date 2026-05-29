import type { ReportStatus } from '../../types/report'

export type CreateTrackingEntryDto = {
  reportId: string
  previousStatus: ReportStatus
  newStatus: ReportStatus
  comment?: string
}

import type { ReportStatus } from '../types/report'
import { assignmentFormDtoSchema, statusChangeFormDtoSchema } from '../dtos/reportActionDtos'

export function validateStatusChange(status: ReportStatus, comment: string) {
  const result = statusChangeFormDtoSchema.safeParse({
    newStatus: status,
    comment,
  })
  return result.success ? '' : result.error.issues[0]?.message ?? 'Revisa los datos del cambio de estado.'
}

export function validateAssignment(userId: string, areaId: string) {
  const result = assignmentFormDtoSchema.safeParse({ userId, areaId })
  return result.success ? '' : result.error.issues[0]?.message ?? 'Revisa los datos de asignación.'
}

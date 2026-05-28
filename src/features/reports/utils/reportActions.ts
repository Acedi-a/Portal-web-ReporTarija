import { z } from 'zod'
import type { ReportStatus } from '../types/report'

const statusChangeSchema = z.object({
  status: z.custom<ReportStatus>(),
  comment: z.string(),
}).superRefine(({ status, comment }, context) => {
  if (status === 'RECHAZADO' && !comment.trim()) {
    context.addIssue({
      code: 'custom',
      message: 'Para rechazar un reporte debes registrar un comentario.',
      path: ['comment'],
    })
  }
})

const assignmentSchema = z.object({
  userId: z.string(),
  areaId: z.string(),
}).superRefine(({ userId, areaId }, context) => {
  if (!userId && !areaId) {
    context.addIssue({
      code: 'custom',
      message: 'Selecciona un responsable o un area municipal.',
      path: ['userId'],
    })
  }
})

export function validateStatusChange(status: ReportStatus, comment: string) {
  const result = statusChangeSchema.safeParse({ status, comment })
  return result.success ? '' : result.error.issues[0]?.message ?? 'Revisa los datos del cambio de estado.'
}

export function validateAssignment(userId: string, areaId: string) {
  const result = assignmentSchema.safeParse({ userId, areaId })
  return result.success ? '' : result.error.issues[0]?.message ?? 'Revisa los datos de asignación.'
}

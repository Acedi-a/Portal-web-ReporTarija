import { z } from 'zod'

export const reportStatusDtoSchema = z.enum([
  'PENDIENTE',
  'EN_REVISION',
  'ASIGNADO',
  'EN_PROCESO',
  'RESUELTO',
  'RECHAZADO',
])

export const reportFiltersDtoSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  area: z.string().optional(),
  responsible: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

const statusChangeFields = {
  newStatus: reportStatusDtoSchema,
  comment: z.string(),
}

const assignmentFields = {
  userId: z.string(),
  areaId: z.string(),
}

export const statusChangeFormDtoSchema = z.object(statusChangeFields).superRefine(({ newStatus, comment }, context) => {
  if (newStatus === 'RECHAZADO' && !comment.trim()) {
    context.addIssue({
      code: 'custom',
      message: 'Para rechazar un reporte debes registrar un comentario.',
      path: ['comment'],
    })
  }
})

export const updateReportStatusDtoSchema = z.object({
  ...statusChangeFields,
  reportId: z.string(),
  reportTitle: z.string(),
  previousStatus: reportStatusDtoSchema,
  resolvedAt: z.string().nullable(),
}).superRefine(({ newStatus, comment }, context) => {
  if (newStatus === 'RECHAZADO' && !comment.trim()) {
    context.addIssue({
      code: 'custom',
      message: 'Para rechazar un reporte debes registrar un comentario.',
      path: ['comment'],
    })
  }
})

export const assignmentFormDtoSchema = z.object(assignmentFields).superRefine(({ userId, areaId }, context) => {
  if (!userId && !areaId) {
    context.addIssue({
      code: 'custom',
      message: 'Selecciona un responsable o un area municipal.',
      path: ['userId'],
    })
  }
})

export const assignResponsibleDtoSchema = z.object({
  ...assignmentFields,
  reportId: z.string(),
  reportTitle: z.string(),
  previousStatus: reportStatusDtoSchema,
}).superRefine(({ userId, areaId }, context) => {
  if (!userId && !areaId) {
    context.addIssue({
      code: 'custom',
      message: 'Selecciona un responsable o un area municipal.',
      path: ['userId'],
    })
  }
})

export const uploadEvidenceDtoSchema = z.object({
  reportId: z.string(),
  file: z.instanceof(File),
})

export type ReportStatusDto = z.infer<typeof reportStatusDtoSchema>
export type ReportFiltersDto = z.infer<typeof reportFiltersDtoSchema>
export type StatusChangeFormDto = z.infer<typeof statusChangeFormDtoSchema>
export type UpdateReportStatusDto = z.infer<typeof updateReportStatusDtoSchema>
export type AssignmentFormDto = z.infer<typeof assignmentFormDtoSchema>
export type AssignResponsibleDto = z.infer<typeof assignResponsibleDtoSchema>
export type UploadEvidenceDto = z.infer<typeof uploadEvidenceDtoSchema>

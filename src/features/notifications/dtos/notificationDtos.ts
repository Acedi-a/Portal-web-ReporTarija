import { z } from 'zod'

export const notificationTypeDtoSchema = z.enum(['INFO', 'WARNING', 'SUCCESS', 'ERROR'])

export const createNotificationDtoSchema = z.object({
  report_id: z.string().optional(),
  title: z.string().trim().min(1),
  message: z.string().trim().min(1),
  type: notificationTypeDtoSchema.optional(),
})

export type CreateNotificationDto = z.infer<typeof createNotificationDtoSchema>

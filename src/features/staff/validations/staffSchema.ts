import { z } from 'zod'

const staffRoleSchema = z.enum(['ADMIN', 'FUNCIONARIO', 'TECNICO', 'RESPONSABLE_AREA'])

export const staffFormSchema = z.object({
  full_name: z.string().trim().min(1, 'Ingresa el nombre completo.'),
  email: z.string().trim().email('Ingresa un correo válido.'),
  password: z.string(),
  role: staffRoleSchema,
  area_id: z.string().nullable(),
  is_active: z.boolean(),
})

export const createStaffSchema = staffFormSchema.extend({
  password: z.string().trim().min(8, 'La contraseña inicial debe tener al menos 8 caracteres.'),
})

export const updateStaffSchema = staffFormSchema.extend({
  password: z.string().optional(),
})

export type StaffFormValue = z.infer<typeof staffFormSchema>

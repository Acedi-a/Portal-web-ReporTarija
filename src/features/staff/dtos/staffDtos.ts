import { z } from 'zod'

export const staffRoleDtoSchema = z.enum(['ADMIN', 'FUNCIONARIO', 'TECNICO', 'RESPONSABLE_AREA'])

export const staffFormDtoSchema = z.object({
  full_name: z.string().trim().min(1, 'Ingresa el nombre completo.'),
  email: z.string().trim().email('Ingresa un correo válido.'),
  password: z.string(),
  role: staffRoleDtoSchema,
  area_id: z.string().nullable(),
  is_active: z.boolean(),
})

export const createStaffDtoSchema = staffFormDtoSchema.extend({
  password: z.string().trim().min(8, 'La contraseña inicial debe tener al menos 8 caracteres.'),
})

export const updateStaffDtoSchema = staffFormDtoSchema.extend({
  password: z.string().optional(),
})

export type StaffFormDto = z.infer<typeof staffFormDtoSchema>
export type CreateStaffDto = z.infer<typeof createStaffDtoSchema>
export type UpdateStaffDto = Omit<z.infer<typeof updateStaffDtoSchema>, 'password'>
export type CreateStaffAccessDto = CreateStaffDto
export type StaffRoleDto = z.infer<typeof staffRoleDtoSchema>

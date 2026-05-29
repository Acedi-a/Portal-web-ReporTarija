import { z } from 'zod'

export const loginDtoSchema = z.object({
  email: z.string().trim().email('Ingresa un correo válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
})

export type LoginDto = z.infer<typeof loginDtoSchema>

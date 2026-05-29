import { describe, expect, test } from 'vitest'
import { loginDtoSchema } from '../dtos/loginDto'

describe('loginDtoSchema', () => {
  test('acepta credenciales validas en login', () => {
    const result = loginDtoSchema.safeParse({
      email: 'admin@reportatarija.bo',
      password: 'segura123',
    })

    expect(result.success).toBe(true)
  })

  test('rechaza credenciales invalidas en login', () => {
    const result = loginDtoSchema.safeParse({
      email: 'correo-invalido',
      password: '123',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        'Ingresa un correo válido.',
        'La contraseña debe tener al menos 6 caracteres.',
      ]),
    )
  })
})

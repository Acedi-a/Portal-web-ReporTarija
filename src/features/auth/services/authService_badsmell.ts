/*
 * VERSION ORIGINAL PARA COMPARACION DE REFACTORIZACION.
 *
 * Bad smells identificados:
 *
 * 1. The Change Preventers / Preventores de cambio:
 *    Cada metodo repite manejo manual de error. Si cambia la forma de manejar
 *    errores de InsForge, hay que tocar varios metodos.
 *
 * 2. The Couplers / Los acopladores:
 *    El servicio depende directamente del cliente InsForge. Es aceptable para
 *    un servicio de infraestructura, pero conviene encapsular patrones comunes
 *    como assertNoError en una utilidad compartida.
 *
 * Este archivo queda como evidencia del "antes"; la app usa authService.ts.
 */

import { insforge } from '../../../lib/insforge'

export async function login(email: string, password: string) {
  const { data, error } = await insforge.auth.signInWithPassword({ email, password })

  if (error) {
    throw error
  }

  return data
}

export async function logout() {
  await insforge.auth.signOut()
}

export async function getCurrentUser() {
  const { data, error } = await insforge.auth.getCurrentUser()

  if (error) {
    throw error
  }

  return data.user
}

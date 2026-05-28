import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import type { LoginFormValues } from '../validations/loginSchema'

export async function login(credentials: LoginFormValues) {
  const { data, error } = await insforge.auth.signInWithPassword(credentials)
  assertNoError(error)
  return data
}

export async function logout() {
  const { error } = await insforge.auth.signOut()
  assertNoError(error)
}

export async function getCurrentUser() {
  const { data, error } = await insforge.auth.getCurrentUser()
  assertNoError(error)
  return data?.user ?? null
}

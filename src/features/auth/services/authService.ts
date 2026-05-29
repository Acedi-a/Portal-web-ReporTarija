import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import { loginDtoSchema, type LoginDto } from '../dtos/loginDto'

export async function login(credentials: LoginDto) {
  const parsed = loginDtoSchema.parse(credentials)
  const { data, error } = await insforge.auth.signInWithPassword(parsed)
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

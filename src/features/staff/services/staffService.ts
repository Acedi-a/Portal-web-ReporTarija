import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import type { StaffUser } from '../../reports/types/report'

export type StaffRole = 'ADMIN' | 'FUNCIONARIO' | 'TECNICO' | 'RESPONSABLE_AREA'

export type StaffPayload = {
  full_name: string
  email: string
  role: StaffRole
  area_id: string | null
  is_active: boolean
}

export type StaffAccessPayload = StaffPayload & {
  password: string
}

export async function getAreas() {
  const { data, error } = await insforge.database.from('areas').select('id,name,code').order('name')
  assertNoError(error)
  return data ?? []
}

export async function getStaff() {
  const { data, error } = await insforge.database
    .from('users')
    .select('*, areas:area_id(id,name,code)')
    .neq('role', 'CITIZEN')
    .order('full_name')

  assertNoError(error)
  return (data ?? []) as StaffUser[]
}

export async function createStaff(input: StaffPayload) {
  const { data, error } = await insforge.database
    .from('users')
    .insert({
      ...input,
      phone: null,
    })
    .select('*, areas:area_id(id,name,code)')
    .single()

  assertNoError(error)
  return data as StaffUser
}

export async function createStaffAccess(input: StaffAccessPayload) {
  const { password, ...profile } = input
  const { error: signUpError } = await insforge.auth.signUp({
    email: profile.email,
    password,
    name: profile.full_name,
  })

  assertNoError(signUpError)
  return createStaff(profile)
}

export async function updateStaff(id: string, input: StaffPayload) {
  const { data, error } = await insforge.database
    .from('users')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, areas:area_id(id,name,code)')
    .single()

  assertNoError(error)
  return data as StaffUser
}

export async function toggleStaffStatus(user: StaffUser) {
  const { data, error } = await insforge.database
    .from('users')
    .update({
      is_active: !user.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select('*, areas:area_id(id,name,code)')
    .single()

  assertNoError(error)
  return data as StaffUser
}

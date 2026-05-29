import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import type { StaffUser } from '../../reports/types/report'
import {
  createStaffDtoSchema,
  staffFormDtoSchema,
  updateStaffDtoSchema,
  type CreateStaffAccessDto,
  type CreateStaffDto,
  type StaffRoleDto,
  type UpdateStaffDto,
} from '../dtos/staffDtos'

export type StaffRole = StaffRoleDto
export type StaffPayload = UpdateStaffDto
export type StaffAccessPayload = CreateStaffAccessDto

const staffSelect = '*, areas:area_id(id,name,code)'

export async function getAreas() {
  const { data, error } = await insforge.database.from('areas').select('id,name,code').order('name')
  assertNoError(error)
  return data ?? []
}

export async function getStaff() {
  const { data, error } = await insforge.database
    .from('users')
    .select(staffSelect)
    .neq('role', 'CITIZEN')
    .order('full_name')

  assertNoError(error)
  return (data ?? []) as StaffUser[]
}

export async function createStaff(input: CreateStaffDto | UpdateStaffDto) {
  const parsed = staffFormDtoSchema.omit({ password: true }).parse(input)
  const { data, error } = await insforge.database
    .from('users')
    .insert({
      ...parsed,
      phone: null,
    })
    .select(staffSelect)
    .single()

  assertNoError(error)
  return data as StaffUser
}

export async function createStaffAccess(input: CreateStaffAccessDto) {
  const { password, ...profile } = createStaffDtoSchema.parse(input)
  const { error: signUpError } = await insforge.auth.signUp({
    email: profile.email,
    password,
    name: profile.full_name,
  })

  assertNoError(signUpError)
  return createStaff(profile)
}

export async function updateStaff(id: string, input: UpdateStaffDto) {
  const parsed = updateStaffDtoSchema.omit({ password: true }).parse(input)
  const { data, error } = await insforge.database
    .from('users')
    .update({
      ...parsed,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(staffSelect)
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
    .select(staffSelect)
    .single()

  assertNoError(error)
  return data as StaffUser
}

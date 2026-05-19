import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import type { StaffUser } from '../../reports/types/report'

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

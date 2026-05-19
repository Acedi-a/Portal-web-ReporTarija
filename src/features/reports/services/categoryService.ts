import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'

export async function getCategories() {
  const { data, error } = await insforge.database.from('categories').select('id,name,code').order('name')
  assertNoError(error)
  return data ?? []
}

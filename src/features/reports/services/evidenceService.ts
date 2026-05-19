import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import type { Evidence } from '../types/report'

export async function getEvidencesByReportId(reportId: string) {
  const { data, error } = await insforge.database.from('evidences').select('*').eq('report_id', reportId)
  assertNoError(error)
  return (data ?? []) as Evidence[]
}

export async function getAllEvidences() {
  const { data, error } = await insforge.database.from('evidences').select('*')
  assertNoError(error)
  return (data ?? []) as Evidence[]
}

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

export async function uploadEvidence(reportId: string, file: File) {
  const objectPath = `reports/${reportId}/${Date.now()}-${file.name}`
  const { data: uploaded, error: uploadError } = await insforge.storage
    .from('evidences')
    .upload(objectPath, file)

  assertNoError(uploadError)

  if (!uploaded) {
    throw new Error('No se pudo subir la evidencia.')
  }

  const { data, error } = await insforge.database
    .from('evidences')
    .insert({
      report_id: reportId,
      file_url: uploaded.url,
      file_name: file.name,
      file_type: file.type,
    })
    .select()
    .single()

  assertNoError(error)
  return data as Evidence
}

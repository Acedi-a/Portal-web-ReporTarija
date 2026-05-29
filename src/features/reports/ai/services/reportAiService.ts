import { insforge } from '../../../../lib/insforge'
import { assertNoError } from '../../../../lib/insforgeErrors'
import type { AnalyzeReportInput, ReportAiResponse } from '../types/reportAi'

export async function analyzeReport(input: AnalyzeReportInput) {
  const { data, error } = await insforge.functions.invoke('analyze-report', {
    body: input,
  })

  assertNoError(error)
  return data as ReportAiResponse
}

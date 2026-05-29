import { insforge } from '../../../../lib/insforge'
import { assertNoError } from '../../../../lib/insforgeErrors'
import type { AnalyzeReportDto, ReportAiResponseDto } from '../../dtos/reportAiDtos'

export async function analyzeReport(input: AnalyzeReportDto) {
  const { data, error } = await insforge.functions.invoke('analyze-report', {
    body: input,
  })

  assertNoError(error)
  return data as ReportAiResponseDto
}

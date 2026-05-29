import { useMutation } from '@tanstack/react-query'
import { analyzeReport } from '../services/reportAiService'
import type { Evidence, Report } from '../../types/report'

export function useReportAiAnalysis(report: Report, evidences: Evidence[]) {
  const evidenceUrl = evidences[0]?.file_url
  const analysisMutation = useMutation({
    mutationFn: () => analyzeReport({ report, evidenceUrl }),
  })

  return {
    evidenceUrl,
    analysis: analysisMutation.data?.analysis ?? null,
    responseModel: analysisMutation.data?.model,
    responseProvider: analysisMutation.data?.providerOnly,
    isAnalyzing: analysisMutation.isPending,
    error: analysisMutation.error,
    analyze: analysisMutation.mutate,
  }
}

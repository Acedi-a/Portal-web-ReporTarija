import type { Report } from '../types/report'

export type ReportAiModelDto = 'deepseek/deepseek-v4-flash'
export type ReportAiProviderDto = 'alibaba'

export type ReportAiAnalysisDto = {
  summary: string
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'URGENTE'
  suggestedCategory: string
  suggestedStatus: 'PENDIENTE' | 'EN_REVISION' | 'ASIGNADO' | 'EN_PROCESO' | 'RESUELTO' | 'RECHAZADO'
  suggestedPriority: string
  suggestedArea: string
  recommendedAction: string
  followUpComment: string
  citizenResponse: string
  duplicateRisk: 'BAJO' | 'MEDIO' | 'ALTO'
  reasons: string[]
}

export type ReportAiResponseDto = {
  model: ReportAiModelDto | string
  providerOnly: ReportAiProviderDto | string | null
  analysis: ReportAiAnalysisDto
}

export type AnalyzeReportDto = {
  report: Report
  evidenceUrl?: string
}

import type { Report } from '../../types/report'

export type ReportAiModel = 'deepseek/deepseek-v4-flash'
export type ReportAiProvider = 'alibaba'

export type ReportAiAnalysis = {
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

export type ReportAiResponse = {
  model: ReportAiModel | string
  providerOnly: ReportAiProvider | string | null
  analysis: ReportAiAnalysis
}

export type AnalyzeReportInput = {
  report: Report
  evidenceUrl?: string
}

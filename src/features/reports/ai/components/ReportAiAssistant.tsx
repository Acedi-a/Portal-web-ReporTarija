import { BrainCircuit, WandSparkles } from 'lucide-react'
import { Button } from '../../../../shared/components/ui/Button'
import { Panel } from '../../../../shared/components/ui/Panel'
import type { ReportAiAnalysis } from '../types/reportAi'

type ReportAiAssistantProps = {
  analysis: ReportAiAnalysis | null
  isAnalyzing: boolean
  error: unknown
  onAnalyze: () => void
}

export function ReportAiAssistant({ analysis, isAnalyzing, error, onAnalyze }: ReportAiAssistantProps) {
  return (
    <Panel className="space-y-4 shadow-sm">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-zinc-200">
                <BrainCircuit className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase text-blue-700 dark:text-zinc-400">Informe IA</p>
                <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Reporte municipal sugerido</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-5 text-slate-500 dark:text-zinc-400">Resumen y criterios sugeridos para revisión humana.</p>
          </div>
          <Button onClick={onAnalyze} disabled={isAnalyzing}>
            <WandSparkles className="h-4 w-4" />
            {isAnalyzing ? 'Generando...' : 'Generar informe IA'}
          </Button>
        </div>
      </div>

      <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-zinc-950 dark:text-zinc-400">
        DeepSeek V4 Flash · Alibaba Cloud
      </p>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          No se pudo generar el informe. Verifica la function, la API key y el modelo configurado.
        </p>
      ) : null}

      {!analysis && !error ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          Genera el informe para habilitar sugerencias y autocompletar el modal de actualización.
        </div>
      ) : null}

      {analysis ? (
        <article className="space-y-5 border-t border-slate-100 pt-4 text-sm dark:border-zinc-800">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 dark:text-zinc-500">Resumen municipal</p>
            <p className="mt-2 leading-7 text-slate-800 dark:text-zinc-200">{analysis.summary}</p>
          </div>

          <div className="grid gap-x-4 gap-y-2 border-y border-slate-100 py-3 text-sm dark:border-zinc-800 sm:grid-cols-2">
            <ReportMeta label="Riesgo" value={analysis.riskLevel} />
            <ReportMeta label="Duplicado" value={analysis.duplicateRisk} />
            <ReportMeta label="Estado sugerido" value={analysis.suggestedStatus} />
            <ReportMeta label="Área sugerida" value={analysis.suggestedArea} />
            <ReportMeta label="Categoría" value={analysis.suggestedCategory} />
            <ReportMeta label="Prioridad" value={analysis.suggestedPriority} />
          </div>

          <ReportSection title="Acción recomendada">{analysis.recommendedAction}</ReportSection>
          <ReportSection title="Comentario sugerido">{analysis.followUpComment}</ReportSection>
          <ReportSection title="Respuesta ciudadana">{analysis.citizenResponse}</ReportSection>

          <div>
            <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-zinc-500">Razones del análisis</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 leading-6 text-slate-700 dark:text-zinc-300">
              {analysis.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </article>
      ) : null}
    </Panel>
  )
}

function ReportMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500 dark:text-zinc-400">{label}</span>
      <span className="text-right font-semibold text-slate-950 dark:text-zinc-50">{value}</span>
    </div>
  )
}

function ReportSection({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-zinc-500">{title}</h3>
      <p className="mt-2 leading-7 text-slate-700 dark:text-zinc-300">{children}</p>
    </div>
  )
}

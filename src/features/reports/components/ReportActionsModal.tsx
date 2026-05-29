import { Sparkles, X } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import type { ReportAiAnalysis } from '../ai/types/reportAi'
import type { Area, ReportStatus, StaffUser } from '../types/report'
import { ReportActionsPanel } from './ReportActionsPanel'

type ReportActionsModalProps = {
  open: boolean
  onClose: () => void
  statusForm: {
    newStatus: ReportStatus
    comment: string
    error: string
    isSubmitting: boolean
    changeStatus: (status: ReportStatus) => void
    changeComment: (comment: string) => void
    submit: () => void
  }
  assignmentForm: {
    userId: string
    areaId: string
    error: string
    isSubmitting: boolean
    changeArea: (areaId: string) => void
    changeResponsible: (userId: string) => void
    submit: () => void
  }
  areas: Area[]
  staff: StaffUser[]
  aiAnalysis: ReportAiAnalysis | null
  isAnalyzing: boolean
  onAnalyze: () => void
}

export function ReportActionsModal({
  open,
  onClose,
  statusForm,
  assignmentForm,
  areas,
  staff,
  aiAnalysis,
  isAnalyzing,
  onAnalyze,
}: ReportActionsModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-xl overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-700 dark:text-zinc-400">Mesa de control</p>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-zinc-50">Acciones municipales</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label="Cerrar acciones"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <AiAutocompleteBar
            analysis={aiAnalysis}
            areas={areas}
            isAnalyzing={isAnalyzing}
            onAnalyze={onAnalyze}
            onApply={() => applyAiSuggestions({ analysis: aiAnalysis, areas, statusForm, assignmentForm })}
          />
          <ReportActionsPanel
            statusForm={statusForm}
            assignmentForm={assignmentForm}
            areas={areas}
            staff={staff}
            frameless
          />
        </div>
      </div>
    </div>
  )
}

function AiAutocompleteBar({
  analysis,
  areas,
  isAnalyzing,
  onAnalyze,
  onApply,
}: {
  analysis: ReportAiAnalysis | null
  areas: Area[]
  isAnalyzing: boolean
  onAnalyze: () => void
  onApply: () => void
}) {
  const canApply = Boolean(analysis)

  return (
    <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-zinc-100">Autocompletado con IA</p>
          <p className="text-xs text-blue-700/80 dark:text-zinc-400">
            {analysis ? `Sugerirá ${analysis.suggestedStatus}, comentario y ${findSuggestedAreaName(areas, analysis.suggestedArea)}.` : 'Genera un informe IA para completar los campos del modal.'}
          </p>
        </div>
        <div className="flex gap-2">
          {!analysis ? (
            <Button variant="secondary" onClick={onAnalyze} disabled={isAnalyzing}>
              <Sparkles className="h-4 w-4" />
              {isAnalyzing ? 'Generando...' : 'Generar IA'}
            </Button>
          ) : null}
          <Button onClick={onApply} disabled={!canApply}>
            <Sparkles className="h-4 w-4" />
            Autocompletar
          </Button>
        </div>
      </div>
    </div>
  )
}

function applyAiSuggestions({
  analysis,
  areas,
  statusForm,
  assignmentForm,
}: {
  analysis: ReportAiAnalysis | null
  areas: Area[]
  statusForm: ReportActionsModalProps['statusForm']
  assignmentForm: ReportActionsModalProps['assignmentForm']
}) {
  if (!analysis) {
    return
  }

  statusForm.changeStatus(analysis.suggestedStatus)
  statusForm.changeComment(analysis.followUpComment)

  const suggestedArea = findSuggestedArea(areas, analysis.suggestedArea)

  if (suggestedArea) {
    assignmentForm.changeArea(String(suggestedArea.id))
  }
}

function findSuggestedArea(areas: Area[], suggestedArea: string) {
  return areas.find((area) => area.code === suggestedArea || normalize(area.name) === normalize(suggestedArea))
}

function findSuggestedAreaName(areas: Area[], suggestedArea: string) {
  return findSuggestedArea(areas, suggestedArea)?.name ?? suggestedArea
}

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(' ', '_')
}

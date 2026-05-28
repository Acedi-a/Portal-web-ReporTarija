import { CheckCircle2, ClipboardCheck, Smartphone, UserCheck, Wrench, XCircle } from 'lucide-react'
import type { ReportStatus } from '../types/report'

export type ProgressStep = {
  status: ReportStatus
  title: string
  description: string
  icon: typeof Smartphone
}

const normalSteps: ProgressStep[] = [
  {
    status: 'PENDIENTE',
    title: 'Reporte recibido',
    description: 'El ciudadano envió el problema desde la app móvil.',
    icon: Smartphone,
  },
  {
    status: 'EN_REVISION',
    title: 'En revisión',
    description: 'El municipio revisa la información y evidencia.',
    icon: ClipboardCheck,
  },
  {
    status: 'ASIGNADO',
    title: 'Asignado',
    description: 'Se define un responsable o área municipal.',
    icon: UserCheck,
  },
  {
    status: 'EN_PROCESO',
    title: 'En proceso',
    description: 'El área responsable atiende el reporte.',
    icon: Wrench,
  },
  {
    status: 'RESUELTO',
    title: 'Resuelto',
    description: 'El municipio marcó el caso como solucionado.',
    icon: CheckCircle2,
  },
]

const rejectedStep: ProgressStep = {
  status: 'RECHAZADO',
  title: 'Rechazado',
  description: 'El reporte fue marcado como inválido o no corresponde.',
  icon: XCircle,
}

const statusIndex: Record<ReportStatus, number> = {
  PENDIENTE: 0,
  EN_REVISION: 1,
  ASIGNADO: 2,
  EN_PROCESO: 3,
  RESUELTO: 4,
  RECHAZADO: 1,
}

export function getProgressSteps(status: ReportStatus) {
  return status === 'RECHAZADO'
    ? [normalSteps[0], normalSteps[1], rejectedStep]
    : normalSteps
}

export function getProgressStepState(status: ReportStatus, step: ProgressStep, index: number, totalSteps: number) {
  const isRejectedFlow = status === 'RECHAZADO'
  const isRejectedStep = step.status === 'RECHAZADO'

  return {
    active: step.status === status,
    completed: isRejectedFlow ? index < totalSteps - 1 : index <= statusIndex[status],
    rejected: isRejectedStep,
  }
}

export function getProgressCardClass({ active, completed, rejected }: ReturnType<typeof getProgressStepState>) {
  if (active && rejected) {
    return 'border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30'
  }

  if (active) {
    return 'border-blue-200 bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/30'
  }

  if (completed) {
    return 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20'
  }

  return 'border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
}

export function getProgressIconClass({ completed, rejected }: ReturnType<typeof getProgressStepState>) {
  if (rejected) {
    return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
  }

  if (completed) {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
  }

  return 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
}

export function getStateIconClass({ completed, rejected }: ReturnType<typeof getProgressStepState>) {
  if (rejected) {
    return 'text-red-600'
  }

  if (completed) {
    return 'text-emerald-600'
  }

  return 'text-slate-300 dark:text-zinc-600'
}

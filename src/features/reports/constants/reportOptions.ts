import type { Priority } from '../types/report'

export const priorityLabels: Record<Priority, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
}

export const priorityOptions = Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))

export const priorityClasses: Record<Priority, string> = {
  BAJA: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700',
  MEDIA: 'bg-blue-100 text-blue-800 ring-blue-200',
  ALTA: 'bg-orange-100 text-orange-800 ring-orange-200',
  URGENTE: 'bg-red-100 text-red-800 ring-red-200',
}

export const priorityMarkerClasses: Record<Priority, string> = {
  BAJA: 'bg-slate-600',
  MEDIA: 'bg-blue-700',
  ALTA: 'bg-orange-600',
  URGENTE: 'bg-red-600',
}

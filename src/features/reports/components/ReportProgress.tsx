import { CheckCircle2, Circle, ClipboardCheck, Smartphone, UserCheck, Wrench, XCircle } from 'lucide-react'
import type { ReportStatus } from '../types/report'
import { Panel } from '../../../shared/components/ui/Panel'

type ReportProgressProps = {
  status: ReportStatus
}

const normalSteps: Array<{
  status: Exclude<ReportStatus, 'RECHAZADO'>
  title: string
  description: string
  icon: typeof Smartphone
}> = [
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

const statusIndex: Record<ReportStatus, number> = {
  PENDIENTE: 0,
  EN_REVISION: 1,
  ASIGNADO: 2,
  EN_PROCESO: 3,
  RESUELTO: 4,
  RECHAZADO: 1,
}

export function ReportProgress({ status }: ReportProgressProps) {
  const isRejected = status === 'RECHAZADO'
  const steps = isRejected
    ? [
        normalSteps[0],
        normalSteps[1],
        {
          status: 'RECHAZADO' as const,
          title: 'Rechazado',
          description: 'El reporte fue marcado como inválido o no corresponde.',
          icon: XCircle,
        },
      ]
    : normalSteps
  const currentIndex = statusIndex[status]

  return (
    <Panel className="space-y-4">
      <div>
        <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Progreso del reporte</h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Flujo desde el registro ciudadano hasta la atención municipal.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const completed = isRejected ? index < steps.length - 1 : index <= currentIndex
          const active = step.status === status
          const rejectedStep = step.status === 'RECHAZADO'
          const StateIcon = completed ? CheckCircle2 : Circle

          return (
            <div
              key={step.status}
              className={`rounded-lg border p-3 ${
                active
                  ? rejectedStep
                    ? 'border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30'
                    : 'border-blue-200 bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/30'
                  : completed
                    ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-md ${
                    rejectedStep
                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : completed
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                </span>
                <StateIcon
                  className={`h-4 w-4 ${
                    rejectedStep
                      ? 'text-red-600'
                      : completed
                        ? 'text-emerald-600'
                        : 'text-slate-300 dark:text-zinc-600'
                  }`}
                />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-950 dark:text-zinc-50">{step.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400">{step.description}</p>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

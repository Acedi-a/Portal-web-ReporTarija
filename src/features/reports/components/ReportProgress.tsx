import { CheckCircle2, Circle } from 'lucide-react'
import type { ReportStatus } from '../types/report'
import { Panel } from '../../../shared/components/ui/Panel'
import {
  getProgressIconClass,
  getProgressStepState,
  getProgressSteps,
  getStateIconClass,
} from '../utils/reportProgress'

type ReportProgressProps = {
  status: ReportStatus
}

export function ReportProgress({ status }: ReportProgressProps) {
  const steps = getProgressSteps(status)

  return (
    <Panel className="space-y-5 shadow-sm">
      <div>
        <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Progreso del reporte</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Seguimiento del estado actual de atención municipal.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const stepState = getProgressStepState(status, step, index, steps.length)
          const StateIcon = stepState.completed ? CheckCircle2 : Circle

          return (
            <div
              key={step.status}
              className="relative min-w-0"
            >
              {index < steps.length - 1 ? (
                <span className={`absolute left-[2.75rem] right-[-1rem] top-5 hidden h-1 rounded-full md:block ${stepState.completed ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-800'}`} />
              ) : null}
              <div className="relative z-10 flex flex-col items-center text-center">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full ring-8 ring-white dark:ring-zinc-900 ${getProgressIconClass(stepState)}`}
                >
                  <StepIcon className="h-4 w-4" />
                </span>
                <StateIcon
                  className={`mt-2 h-4 w-4 ${getStateIconClass(stepState)}`}
                />
                <h3 className="mt-2 text-sm font-semibold text-slate-950 dark:text-zinc-50">{step.title}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                  {stepState.completed ? 'Completado' : 'Pendiente'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

import { CheckCircle2, Circle } from 'lucide-react'
import type { ReportStatus } from '../types/report'
import { Panel } from '../../../shared/components/ui/Panel'
import {
  getProgressCardClass,
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
          const stepState = getProgressStepState(status, step, index, steps.length)
          const StateIcon = stepState.completed ? CheckCircle2 : Circle

          return (
            <div
              key={step.status}
              className={`rounded-lg border p-3 ${getProgressCardClass(stepState)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-md ${getProgressIconClass(stepState)}`}
                >
                  <StepIcon className="h-4 w-4" />
                </span>
                <StateIcon
                  className={`h-4 w-4 ${getStateIconClass(stepState)}`}
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

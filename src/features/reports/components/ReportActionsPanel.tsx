import { ClipboardCheck, UserCheck } from 'lucide-react'
import { Panel } from '../../../shared/components/ui/Panel'
import type { Area, ReportStatus, StaffUser } from '../types/report'
import { ResponsibleSelector } from './ResponsibleSelector'
import { StatusSelector } from './StatusSelector'

type ReportActionsPanelProps = {
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
  frameless?: boolean
}

export function ReportActionsPanel({ statusForm, assignmentForm, areas, staff, frameless = false }: ReportActionsPanelProps) {
  const content = (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase text-blue-700 dark:text-zinc-400">Actualizar reporte</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Registra cambios revisables para el seguimiento municipal.</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
          <ClipboardCheck className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
          Estado del reporte
        </div>
        <StatusSelector
          value={statusForm.newStatus}
          comment={statusForm.comment}
          error={statusForm.error}
          isSubmitting={statusForm.isSubmitting}
          onStatusChange={statusForm.changeStatus}
          onCommentChange={statusForm.changeComment}
          onSubmit={statusForm.submit}
        />
      </section>

      <section className="space-y-3 border-t border-slate-100 pt-4 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
          <UserCheck className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
          Asignación
        </div>
        {assignmentForm.error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{assignmentForm.error}</p> : null}
        <ResponsibleSelector
          areaId={assignmentForm.areaId}
          userId={assignmentForm.userId}
          areas={areas}
          staff={staff}
          isSubmitting={assignmentForm.isSubmitting}
          onAreaChange={assignmentForm.changeArea}
          onUserChange={assignmentForm.changeResponsible}
          onSubmit={assignmentForm.submit}
        />
      </section>
    </div>
  )

  if (frameless) {
    return content
  }

  return (
    <Panel className="space-y-5 border-blue-100 shadow-sm dark:border-zinc-800">
      {content}
    </Panel>
  )
}

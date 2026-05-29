import type { ReportStatus } from '../types/report'
import { Button } from '../../../shared/components/ui/Button'
import { SelectInput, TextareaInput } from '../../../shared/components/ui/FormControls'
import { statusLabels } from '../../../shared/utils/format'

type StatusSelectorProps = {
  value: ReportStatus
  comment: string
  error?: string
  isSubmitting: boolean
  onStatusChange: (status: ReportStatus) => void
  onCommentChange: (comment: string) => void
  onSubmit: () => void
}

export function StatusSelector({
  value,
  comment,
  error,
  isSubmitting,
  onStatusChange,
  onCommentChange,
  onSubmit,
}: StatusSelectorProps) {
  return (
    <div className="space-y-3">
      <SelectInput
        label="Nuevo estado"
        value={value}
        onChange={(event) => onStatusChange(event.target.value as ReportStatus)}
      >
        {Object.entries(statusLabels).map(([status, label]) => (
          <option key={status} value={status}>{label}</option>
        ))}
      </SelectInput>
      <TextareaInput
        label="Comentario interno"
        value={comment}
        onChange={(event) => onCommentChange(event.target.value)}
        placeholder="Comentario de seguimiento"
      />
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Button onClick={onSubmit} disabled={isSubmitting} className="w-full">
        Cambiar estado
      </Button>
    </div>
  )
}

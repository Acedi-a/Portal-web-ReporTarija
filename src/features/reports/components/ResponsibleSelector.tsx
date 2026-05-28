import { Button } from '../../../shared/components/ui/Button'
import { SelectInput } from '../../../shared/components/ui/FormControls'
import type { Area, StaffUser } from '../types/report'

type ResponsibleSelectorProps = {
  areaId: string
  userId: string
  areas: Area[]
  staff: StaffUser[]
  isSubmitting: boolean
  onAreaChange: (areaId: string) => void
  onUserChange: (userId: string) => void
  onSubmit: () => void
}

export function ResponsibleSelector({
  areaId,
  userId,
  areas,
  staff,
  isSubmitting,
  onAreaChange,
  onUserChange,
  onSubmit,
}: ResponsibleSelectorProps) {
  return (
    <div className="grid gap-3">
      <SelectInput
        value={areaId}
        onChange={(event) => onAreaChange(event.target.value)}
      >
        <option value="">Seleccionar área</option>
        {areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
      </SelectInput>
      <SelectInput
        value={userId}
        onChange={(event) => onUserChange(event.target.value)}
      >
        <option value="">Seleccionar responsable</option>
        {staff.map((user) => <option key={user.id} value={user.id}>{user.full_name}</option>)}
      </SelectInput>
      <Button variant="secondary" onClick={onSubmit} disabled={isSubmitting}>
        Asignar responsable
      </Button>
    </div>
  )
}

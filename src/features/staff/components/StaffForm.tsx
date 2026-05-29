import { Button } from '../../../shared/components/ui/Button'
import { SelectInput, TextInput } from '../../../shared/components/ui/FormControls'
import { Panel } from '../../../shared/components/ui/Panel'
import type { Area } from '../../reports/types/report'
import { isStaffRole, staffRoleOptions } from '../constants/staffOptions'
import type { StaffFormValue } from '../validations/staffSchema'

type StaffFormProps = {
  value: StaffFormValue
  areas: Area[]
  isSubmitting: boolean
  isEditing: boolean
  submitLabel: string
  onChange: (value: StaffFormValue) => void
  onSubmit: () => void
  onCancel?: () => void
}

export function StaffForm({
  value,
  areas,
  isSubmitting,
  isEditing,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: StaffFormProps) {
  function handleRoleChange(role: string) {
    if (isStaffRole(role)) {
      onChange({ ...value, role })
    }
  }

  return (
    <Panel>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <TextInput label="Nombre" value={value.full_name} onChange={(event) => onChange({ ...value, full_name: event.target.value })} />
        <TextInput
          label="Correo"
          type="email"
          value={value.email}
          onChange={(event) => onChange({ ...value, email: event.target.value })}
        />
        {!isEditing ? (
          <TextInput
            label="Contraseña inicial"
            type="password"
            value={value.password}
            onChange={(event) => onChange({ ...value, password: event.target.value })}
          />
        ) : null}
        <SelectInput label="Tipo de acceso" value={value.role} onChange={(event) => handleRoleChange(event.target.value)}>
            {staffRoleOptions.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
        </SelectInput>
        <SelectInput
          label="Área"
          value={value.area_id ?? ''}
          onChange={(event) => onChange({ ...value, area_id: event.target.value || null })}
        >
            <option value="">Todas / sin área</option>
            {areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
        </SelectInput>
        <div className="flex items-end gap-2">
          <Button onClick={onSubmit} disabled={isSubmitting} className="flex-1">
            {submitLabel}
          </Button>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </Panel>
  )
}

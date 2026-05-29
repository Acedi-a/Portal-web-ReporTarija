import type { StaffRole } from '../services/staffService'

export const staffRoleLabels: Record<StaffRole, string> = {
  ADMIN: 'Administrador',
  FUNCIONARIO: 'Funcionario',
  TECNICO: 'Técnico',
  RESPONSABLE_AREA: 'Responsable de área',
}

export const staffRoleOptions: Array<{ value: StaffRole; label: string }> = [
  { value: 'ADMIN', label: staffRoleLabels.ADMIN },
  { value: 'FUNCIONARIO', label: staffRoleLabels.FUNCIONARIO },
  { value: 'TECNICO', label: staffRoleLabels.TECNICO },
  { value: 'RESPONSABLE_AREA', label: staffRoleLabels.RESPONSABLE_AREA },
]

export function isStaffRole(value: string): value is StaffRole {
  return value in staffRoleLabels
}

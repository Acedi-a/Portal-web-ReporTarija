import { Button } from '../../../shared/components/ui/Button'
import { Panel } from '../../../shared/components/ui/Panel'
import type { StaffUser } from '../../reports/types/report'
import { staffRoleLabels } from '../constants/staffOptions'
import { StaffStatusBadge } from './StaffStatusBadge'

type StaffTableProps = {
  staff: StaffUser[]
  onEdit: (user: StaffUser) => void
  onToggleStatus: (user: StaffUser) => void
}

export function StaffTable({ staff, onEdit, onToggleStatus }: StaffTableProps) {
  return (
    <Panel className="overflow-x-auto">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
          <tr>
            <th className="py-3 pr-4">Nombre</th>
            <th className="py-3 pr-4">Correo</th>
            <th className="py-3 pr-4">Tipo de acceso</th>
            <th className="py-3 pr-4">Área</th>
            <th className="py-3 pr-4">Estado</th>
            <th className="py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
          {staff.map((user) => (
            <tr key={user.id}>
              <td className="py-3 pr-4 font-medium text-slate-950 dark:text-zinc-50">{user.full_name}</td>
              <td className="py-3 pr-4 text-slate-600 dark:text-zinc-300">{user.email}</td>
              <td className="py-3 pr-4 text-slate-600 dark:text-zinc-300">{user.role === 'CITIZEN' ? user.role : staffRoleLabels[user.role]}</td>
              <td className="py-3 pr-4 text-slate-600 dark:text-zinc-300">{user.areas?.name ?? 'Todas'}</td>
              <td className="py-3 pr-4">
                <StaffStatusBadge isActive={user.is_active} />
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => onEdit(user)} className="h-auto px-0">
                    Editar
                  </Button>
                  <Button variant="ghost" onClick={() => onToggleStatus(user)} className="h-auto px-0 text-slate-600 dark:text-zinc-400">
                    {user.is_active ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}

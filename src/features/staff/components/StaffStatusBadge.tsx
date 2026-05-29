type StaffStatusBadgeProps = {
  isActive: boolean
}

export function StaffStatusBadge({ isActive }: StaffStatusBadgeProps) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(isActive)}`}>
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  )
}

function getStatusClass(isActive: boolean) {
  return isActive
    ? 'bg-emerald-100 text-emerald-800'
    : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300'
}

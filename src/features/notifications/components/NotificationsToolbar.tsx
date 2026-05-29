import { CheckCheck } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'

type NotificationsToolbarProps = {
  unreadCount: number
  isMarkingAllAsRead: boolean
  onMarkAllAsRead: () => void
}

export function NotificationsToolbar({ unreadCount, isMarkingAllAsRead, onMarkAllAsRead }: NotificationsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-100 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700">
          {unreadCount} sin leer
        </span>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          {unreadCount === 0 ? 'Todas las notificaciones están leídas.' : 'Revisa eventos pendientes del portal.'}
        </p>
      </div>
      <Button variant="secondary" onClick={onMarkAllAsRead} disabled={unreadCount === 0 || isMarkingAllAsRead}>
        <CheckCheck className="h-4 w-4" />
        {isMarkingAllAsRead ? 'Marcando...' : 'Marcar todas como leídas'}
      </Button>
    </div>
  )
}

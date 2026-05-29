import type { PortalNotification } from '../types/notification'
import { NotificationCard } from './NotificationCard'

type NotificationListProps = {
  notifications: PortalNotification[]
  onMarkAsRead: (id: string) => void
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        No hay notificaciones internas registradas.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} />
      ))}
    </div>
  )
}

import { Bell, Check } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Panel } from '../../../shared/components/ui/Panel'
import { formatDate } from '../../../shared/utils/format'
import type { PortalNotification } from '../types/notification'
import { NotificationReadBadge } from './NotificationReadBadge'

type NotificationCardProps = {
  notification: PortalNotification
  onMarkAsRead: (id: string) => void
}

export function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  return (
    <Panel as="article" className="flex items-start gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-zinc-200">
        <Bell className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-medium text-slate-950 dark:text-zinc-50">{notification.title}</h2>
          <NotificationReadBadge isRead={notification.is_read} />
        </div>
        <p className="text-sm text-slate-600 dark:text-zinc-300">{notification.message}</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">{formatDate(notification.created_at)}</p>
      </div>
      {!notification.is_read && (
        <Button variant="secondary" onClick={() => onMarkAsRead(notification.id)}>
          <Check className="h-4 w-4" />
          Marcar
        </Button>
      )}
    </Panel>
  )
}

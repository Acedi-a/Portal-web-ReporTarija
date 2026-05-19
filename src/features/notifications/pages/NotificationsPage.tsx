import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { getNotifications } from '../services/notificationService'
import { formatDate } from '../../../shared/utils/format'

type PortalNotification = {
  id: string
  title: string
  message: string
  created_at: string
}

export function NotificationsPage() {
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">Notificaciones</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">Eventos internos del portal municipal.</p>
      </div>
      <div className="space-y-3">
        {(notifications as PortalNotification[]).map((notification) => (
          <article key={notification.id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-medium text-slate-950 dark:text-zinc-50">{notification.title}</h2>
              <p className="text-sm text-slate-600 dark:text-zinc-300">{notification.message}</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">{formatDate(notification.created_at)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

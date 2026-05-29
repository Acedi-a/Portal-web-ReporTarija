import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { NotificationList } from '../components/NotificationList'
import { NotificationsToolbar } from '../components/NotificationsToolbar'
import { useNotifications } from '../hooks/useNotifications'

export function NotificationsPage() {
  const { notifications, unreadCount, isLoading, isMarkingAllAsRead, markAsRead, markAllAsRead } = useNotifications()

  if (isLoading) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Cargando notificaciones...</div>
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Notificaciones" description="Eventos internos del portal municipal." />
      <NotificationsToolbar
        unreadCount={unreadCount}
        isMarkingAllAsRead={isMarkingAllAsRead}
        onMarkAllAsRead={() => markAllAsRead()}
      />
      <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />
    </div>
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Check } from 'lucide-react'
import { getNotifications, markNotificationAsRead } from '../services/notificationService'
import { Button } from '../../../shared/components/ui/Button'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Panel } from '../../../shared/components/ui/Panel'
import { formatDate } from '../../../shared/utils/format'

type PortalNotification = {
  id: number
  title: string
  message: string
  created_at: string
  is_read: boolean
}

export function NotificationsPage() {
  const queryClient = useQueryClient()
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications })
  const readMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  return (
    <div className="space-y-5">
      <PageHeader title="Notificaciones" description="Eventos internos del portal municipal." />
      <div className="space-y-3">
        {(notifications as PortalNotification[]).map((notification) => (
          <Panel key={notification.id} as="article" className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Bell className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-medium text-slate-950 dark:text-zinc-50">{notification.title}</h2>
                <span className={`rounded-full px-2 py-0.5 text-xs ${notification.is_read ? 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400' : 'bg-blue-50 text-blue-700 dark:bg-zinc-100 dark:text-zinc-950'}`}>
                  {notification.is_read ? 'Leída' : 'Nueva'}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300">{notification.message}</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">{formatDate(notification.created_at)}</p>
            </div>
            {!notification.is_read && (
              <Button variant="secondary" onClick={() => readMutation.mutate(notification.id)}>
                <Check className="h-4 w-4" />
                Marcar
              </Button>
            )}
          </Panel>
        ))}
      </div>
    </div>
  )
}

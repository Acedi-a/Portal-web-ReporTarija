import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../services/notificationService'

export function useNotifications() {
  const queryClient = useQueryClient()
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  })
  const readMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
  })
  const readAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
  })
  const notifications = notificationsQuery.data ?? []
  const unreadCount = notifications.filter((notification) => !notification.is_read).length

  return {
    notifications,
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    isMarkingAllAsRead: readAllMutation.isPending,
    markAsRead: readMutation.mutate,
    markAllAsRead: readAllMutation.mutate,
  }
}

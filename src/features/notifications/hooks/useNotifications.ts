import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markNotificationAsRead } from '../services/notificationService'

export function useNotifications() {
  const queryClient = useQueryClient()
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  })
  const readMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  return {
    notifications: notificationsQuery.data ?? [],
    isLoading: notificationsQuery.isLoading,
    markAsRead: readMutation.mutate,
  }
}

type NotificationReadBadgeProps = {
  isRead: boolean
}

export function NotificationReadBadge({ isRead }: NotificationReadBadgeProps) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${getReadBadgeClass(isRead)}`}>
      {isRead ? 'Leída' : 'Nueva'}
    </span>
  )
}

function getReadBadgeClass(isRead: boolean) {
  return isRead
    ? 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
    : 'bg-blue-50 text-blue-700 dark:bg-zinc-100 dark:text-zinc-950'
}

import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'
import { hasDemoSession } from '../services/authSession'

export function AuthGuard() {
  const isDemoSession = hasDemoSession()
  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    enabled: !isDemoSession,
    retry: false,
  })

  if (isDemoSession) {
    return <Outlet />
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 text-sm text-slate-500 dark:bg-zinc-950 dark:text-zinc-400">
        Validando sesión...
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

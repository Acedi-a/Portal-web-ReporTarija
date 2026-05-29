import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Bell, ClipboardList, FileText, LayoutDashboard, LogOut, Moon, Sun, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from '../../../app/theme'
import { logout } from '../../../features/auth/services/authService'
import { clearDemoSession } from '../../../features/auth/services/authSession'
import { getUnreadNotificationsCount } from '../../../features/notifications/services/notificationService'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/reports', label: 'Reportes', icon: ClipboardList },
  { to: '/staff', label: 'Accesos', icon: Users },
  { to: '/notifications', label: 'Notificaciones', icon: Bell },
]

export function AppLayout() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { data: unreadNotificationsCount = 0 } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: getUnreadNotificationsCount,
  })

  async function handleLogout() {
    clearDemoSession()
    await logout().catch(() => undefined)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-zinc-950 dark:text-zinc-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:flex lg:flex-col">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-700 text-white dark:bg-zinc-100 dark:text-zinc-950">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Panel ReportaTarija</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Portal municipal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-zinc-50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span className="min-w-0 flex-1">{item.label}</span>
              {item.to === '/notifications' && unreadNotificationsCount > 0 ? (
                <span className="ml-auto min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-4 text-white">
                  {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t border-slate-200 p-3 dark:border-zinc-800">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-slate-600 dark:text-zinc-300">
                {item.label}
                {item.to === '/notifications' && unreadNotificationsCount > 0 ? (
                  <span className="min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-4 text-white">
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

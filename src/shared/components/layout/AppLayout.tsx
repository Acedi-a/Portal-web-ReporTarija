import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart3, Bell, ClipboardList, FileText, LayoutDashboard, LogOut, Moon, Sun, Users } from 'lucide-react'
import { useTheme } from '../../../app/theme'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/reports', label: 'Reportes', icon: ClipboardList },
  { to: '/staff', label: 'Funcionarios', icon: Users },
  { to: '/notifications', label: 'Notificaciones', icon: Bell },
  { to: '/reports-summary', label: 'Informes', icon: BarChart3 },
]

export function AppLayout() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-zinc-950 dark:text-zinc-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:block">
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
        <nav className="space-y-1 px-3 py-4">
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
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-zinc-50">Municipio de Tarija</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Gestión y seguimiento de reportes ciudadanos</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 dark:border-zinc-800 lg:hidden">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-slate-600 dark:text-zinc-300">
                {item.label}
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

import { Link } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import { Panel } from '../components/ui/Panel'

export function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Panel className="max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">
          <SearchX className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-950 dark:text-zinc-50">Pagina no encontrada</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
          La ruta solicitada no existe dentro del panel municipal.
        </p>
        <Link
          to="/dashboard"
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-medium text-white transition hover:bg-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>
      </Panel>
    </div>
  )
}

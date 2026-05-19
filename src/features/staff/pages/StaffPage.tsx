import { useQuery } from '@tanstack/react-query'
import { getStaff } from '../services/staffService'

export function StaffPage() {
  const { data: staff = [] } = useQuery({ queryKey: ['staff'], queryFn: getStaff })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">Funcionarios</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">Responsables municipales registrados para el prototipo.</p>
      </div>
      <section className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
            <tr>
              <th className="py-3 pr-4">Nombre</th>
              <th className="py-3 pr-4">Correo</th>
              <th className="py-3 pr-4">Rol</th>
              <th className="py-3 pr-4">Área</th>
              <th className="py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {staff.map((user) => (
              <tr key={user.id}>
                <td className="py-3 pr-4 font-medium text-slate-950 dark:text-zinc-50">{user.full_name}</td>
                <td className="py-3 pr-4 text-slate-600 dark:text-zinc-300">{user.email}</td>
                <td className="py-3 pr-4 text-slate-600 dark:text-zinc-300">{user.role}</td>
                <td className="py-3 pr-4 text-slate-600 dark:text-zinc-300">{user.areas?.name ?? 'Todas'}</td>
                <td className="py-3 text-slate-600 dark:text-zinc-300">{user.is_active ? 'Activo' : 'Inactivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

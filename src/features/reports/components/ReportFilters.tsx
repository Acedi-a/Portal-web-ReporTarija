import { ListFilter, Search } from 'lucide-react'
import { statusLabels } from '../../../shared/utils/format'

type CategoryOption = {
  id: number
  name: string
}

type ReportFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: CategoryOption[]
}

export function ReportFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  categories,
}: ReportFiltersProps) {
  return (
    <div className="border-b border-slate-200 p-4 dark:border-zinc-800">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
        <ListFilter className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
        Filtros operativos
      </div>
      <div className="grid gap-3">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por título, zona o descripción"
            className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="">Estados</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="">Categorías</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

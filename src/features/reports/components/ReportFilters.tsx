import { ListFilter, Search } from 'lucide-react'
import { SelectInput, TextInput } from '../../../shared/components/ui/FormControls'
import { statusLabels } from '../../../shared/utils/format'
import { priorityOptions } from '../constants/reportOptions'

type CategoryOption = {
  id: number
  name: string
}

type AreaOption = {
  id: number
  name: string
}

type ResponsibleOption = {
  id: string
  full_name: string
}

type ReportFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  priority: string
  onPriorityChange: (value: string) => void
  area: string
  onAreaChange: (value: string) => void
  responsible: string
  onResponsibleChange: (value: string) => void
  fromDate: string
  onFromDateChange: (value: string) => void
  toDate: string
  onToDateChange: (value: string) => void
  categories: CategoryOption[]
  areas: AreaOption[]
  staff: ResponsibleOption[]
}

export function ReportFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  area,
  onAreaChange,
  responsible,
  onResponsibleChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  categories,
  areas,
  staff,
}: ReportFiltersProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
        <ListFilter className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
        Filtros rápidos
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(130px,1fr))] xl:grid-cols-[minmax(260px,1.6fr)_repeat(7,minmax(118px,1fr))]">
        <label className="relative lg:col-span-2 xl:col-span-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por título, zona o descripción"
            className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>
        <SelectInput value={status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="">Estados</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </SelectInput>
        <SelectInput value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">Categorías</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </SelectInput>
        <SelectInput value={priority} onChange={(event) => onPriorityChange(event.target.value)}>
          <option value="">Prioridad</option>
          {priorityOptions.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </SelectInput>
        <SelectInput value={area} onChange={(event) => onAreaChange(event.target.value)}>
          <option value="">Área</option>
          {areas.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </SelectInput>
        <SelectInput value={responsible} onChange={(event) => onResponsibleChange(event.target.value)}>
          <option value="">Responsable</option>
          {staff.map((item) => (
            <option key={item.id} value={item.id}>{item.full_name}</option>
          ))}
        </SelectInput>
        <TextInput type="date" value={fromDate} onChange={(event) => onFromDateChange(event.target.value)} className="mt-0" />
        <TextInput type="date" value={toDate} onChange={(event) => onToDateChange(event.target.value)} className="mt-0" />
      </div>
    </div>
  )
}

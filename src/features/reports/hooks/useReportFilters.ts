import { useMemo, useState } from 'react'

export type ReportFiltersState = {
  search: string
  status: string
  category: string
  priority: string
  area: string
  responsible: string
  fromDate: string
  toDate: string
}

const initialFilters: ReportFiltersState = {
  search: '',
  status: '',
  category: '',
  priority: '',
  area: '',
  responsible: '',
  fromDate: '',
  toDate: '',
}

export function useReportFilters() {
  const [filterValues, setFilterValues] = useState<ReportFiltersState>(initialFilters)

  const filters = useMemo(
    () => filterValues,
    [filterValues],
  )

  function setFilter<Key extends keyof ReportFiltersState>(field: Key, value: ReportFiltersState[Key]) {
    setFilterValues((currentFilters) => ({ ...currentFilters, [field]: value }))
  }

  function resetFilters() {
    setFilterValues(initialFilters)
  }

  return {
    filters,
    setFilter,
    resetFilters,
  }
}

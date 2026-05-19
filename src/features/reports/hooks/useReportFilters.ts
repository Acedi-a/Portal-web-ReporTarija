import { useMemo, useState } from 'react'

export type ReportFiltersState = {
  search: string
  status: string
  category: string
}

export function useReportFilters() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')

  const filters = useMemo(() => ({ search, status, category }), [search, status, category])

  return {
    filters,
    search,
    setSearch,
    status,
    setStatus,
    category,
    setCategory,
  }
}

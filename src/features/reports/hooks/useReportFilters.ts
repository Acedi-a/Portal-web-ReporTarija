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

export function useReportFilters() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [area, setArea] = useState('')
  const [responsible, setResponsible] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filters = useMemo(
    () => ({ search, status, category, priority, area, responsible, fromDate, toDate }),
    [search, status, category, priority, area, responsible, fromDate, toDate],
  )

  return {
    filters,
    search,
    setSearch,
    status,
    setStatus,
    category,
    setCategory,
    priority,
    setPriority,
    area,
    setArea,
    responsible,
    setResponsible,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  }
}

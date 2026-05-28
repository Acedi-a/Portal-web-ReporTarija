import { useMemo, useState } from 'react'

export function usePagination<Item>(items: Item[], pageSize: number) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [currentPage, items, pageSize])

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setPage,
  }
}

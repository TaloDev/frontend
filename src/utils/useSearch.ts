import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function useSearch(initialSearch?: string | null) {
  const [search, setSearch] = useState(initialSearch ?? '')
  const [page, setPage] = useState(0)
  const [debouncedSearch] = useDebounce(search, 300)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  useEffect(() => {
    setPage(0)
  }, [search])

  return {
    search,
    setSearch,
    page,
    setPage,
    debouncedSearch,
  }
}

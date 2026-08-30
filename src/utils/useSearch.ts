import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function useSearch(initialSearch?: string | null) {
  const [search, setSearchState] = useState(initialSearch ?? '')
  const [page, setPage] = useState(0)
  const [debouncedSearch] = useDebounce(search, 300)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const setSearch = (value: string) => {
    setSearchState(value)
    setPage(0)
  }

  return {
    search,
    setSearch,
    page,
    setPage,
    debouncedSearch,
  }
}

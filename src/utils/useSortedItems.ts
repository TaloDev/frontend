import { useCallback, useMemo } from 'react'

export default function useSortedItems<T>(items: T[], key: keyof T, direction: 'asc' | 'desc' = 'desc'): T[] {
  const getComparator = useCallback(() => {
    const valForKey = items[0][key] as unknown

    switch (typeof valForKey) {
      case 'string':
        if (!isNaN(new Date(valForKey).getTime())) {
          return (a: T, b: T) => new Date(b[key] as string).getTime() - new Date(a[key] as string).getTime()
        }

        return (a: T, b: T) => (b[key] as string).localeCompare(a[key] as string)
      case 'number':
        return (a: T, b: T) => (b[key] as number) - (a[key] as number)
    }
  }, [items, key])

  const sorted = useMemo(() => {
    if (items.length === 0) return items

    const sortedItems: T[] = [...items]
    sortedItems.sort(getComparator())
    if (direction === 'asc') sortedItems.reverse()

    return sortedItems
  }, [items, getComparator, direction])

  return sorted
}

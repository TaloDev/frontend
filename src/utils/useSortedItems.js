import { useCallback, useMemo } from 'react'

export default (items, key, direction) => {
  const getComparator = useCallback(() => {
    const valForKey = items[0][key]
    switch (typeof valForKey) {
      case 'string':
        if (!isNaN(new Date(valForKey))) return (a, b) => new Date(b[key]) - new Date(a[key])
        return (a, b) => b[key].localeCompare(a[key])
      default:
        return (a, b) => b[key] - a[key]
    }
  }, [items, key])

  const sorted = useMemo(() => {
    if (items.length === 0) return items

    let sortedItems = [...items]
    sortedItems.sort(getComparator())

    if (direction === 'asc') sortedItems.reverse()

    return sortedItems
  }, [items, key, direction])

  return sorted
}

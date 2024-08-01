import { useMemo } from 'react'
import useSortedItems from './useSortedItems'
import { differenceInDays, isSameDay, startOfDay, subDays } from 'date-fns'

export default function useDaySections<T extends { createdAt: string }>(items: T[]) {
  const sortedItems = useSortedItems(items, 'createdAt')

  const sections = useMemo(() => {
    if (sortedItems.length === 0) return []
    const latestDate = sortedItems[0].createdAt
    const oldestDate = sortedItems[sortedItems.length - 1].createdAt

    const numSections = differenceInDays(new Date(latestDate), new Date(oldestDate)) + 1

    const sections = []
    for (let i = 0; i < numSections; i++) {
      const date = startOfDay(subDays(new Date(latestDate), i))
      sections.push({
        date,
        items: sortedItems.filter((item) => isSameDay(date, new Date(item.createdAt)))
      })
    }

    return sections.filter((section) => section.items.length > 0)
  }, [sortedItems])

  return sections
}

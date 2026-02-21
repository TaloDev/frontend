import { renderHook } from '@testing-library/react'
import useSortedItems from '../useSortedItems'

describe('useSortedItems', () => {
  it('should sort on descending string keys', () => {
    const items = [{ name: 'Crawle' }, { name: 'Superstatic' }, { name: 'Curse of the Loop' }]

    const { result } = renderHook(() => useSortedItems(items, 'name'))

    expect(result.current).toStrictEqual([items[1], items[2], items[0]])
  })

  it('should sort on ascending string keys', () => {
    const items = [{ name: 'Crawle' }, { name: 'Superstatic' }, { name: 'Curse of the Loop' }]

    const { result } = renderHook(() => useSortedItems(items, 'name', 'asc'))

    expect(result.current).toStrictEqual([items[0], items[2], items[1]])
  })

  it('should sort on descending date keys', () => {
    const items = [
      { name: 'Superstatic', createdAt: '2015-11-12' },
      { name: 'Crawle', createdAt: '2012-11-12' },
      { name: 'Curse of the Loop', createdAt: '2020-10-10' },
    ]

    const { result } = renderHook(() => useSortedItems(items, 'createdAt'))

    expect(result.current).toStrictEqual([items[2], items[0], items[1]])
  })

  it('should sort on ascending date keys', () => {
    const items = [
      { name: 'Superstatic', createdAt: '2015-11-12' },
      { name: 'Crawle', createdAt: '2012-11-12' },
      { name: 'Curse of the Loop', createdAt: '2020-10-10' },
    ]

    const { result } = renderHook(() => useSortedItems(items, 'createdAt', 'asc'))

    expect(result.current).toStrictEqual([items[1], items[0], items[2]])
  })

  it('should sort on descending number keys', () => {
    const items = [
      { id: 45, name: 'Superstatic', createdAt: '2015-11-12' },
      { id: 2, name: 'Crawle', createdAt: '2012-11-12' },
      { id: 38, name: 'Curse of the Loop', createdAt: '2020-10-10' },
    ]

    const { result } = renderHook(() => useSortedItems(items, 'id'))

    expect(result.current).toStrictEqual([items[0], items[2], items[1]])
  })

  it('should sort on ascending number keys', () => {
    const items = [
      { id: 45, name: 'Superstatic', createdAt: '2015-11-12' },
      { id: 2, name: 'Crawle', createdAt: '2012-11-12' },
      { id: 38, name: 'Curse of the Loop', createdAt: '2020-10-10' },
    ]

    const { result } = renderHook(() => useSortedItems(items, 'id', 'asc'))

    expect(result.current).toStrictEqual([items[1], items[2], items[0]])
  })

  it('should handle an empty items list', () => {
    const items: { id: number }[] = []

    const { result } = renderHook(() => useSortedItems(items, 'id', 'asc'))

    expect(result.current).toStrictEqual([])
  })
})

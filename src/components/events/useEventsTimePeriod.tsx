import { useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import useLocalStorage from '../../utils/useLocalStorage'
import useTimePeriod, { TimePeriod } from '../../utils/useTimePeriod'

export const timePeriods: {
  id: TimePeriod
  label: string
}[] = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: 'w', label: 'This week' },
  { id: 'm', label: 'This month' },
  { id: 'y', label: 'This year' }
]

const localStorageKey = 'eventsOverview'

export default function useEventsTimePeriod() {
  const [timePeriod, setTimePeriod] = useLocalStorage<TimePeriod | null>(`${localStorageKey}TimePeriod`, timePeriods[1].id)
  const { startDate, endDate } = useTimePeriod(timePeriod)

  const [selectedStartDate, setSelectedStartDate] = useLocalStorage(`${localStorageKey}StartDate`, '')
  const [selectedEndDate, setSelectedEndDate] = useLocalStorage(`${localStorageKey}EndDate`, '')

  const [debouncedStartDate] = useDebounce(selectedStartDate, 300)
  const [debouncedEndDate] = useDebounce(selectedEndDate, 300)

  useEffect(() => {
    if (timePeriod && startDate && endDate) {
      setSelectedStartDate(startDate)
      setSelectedEndDate(endDate)
    }
  }, [timePeriod, startDate, endDate, setSelectedStartDate, setSelectedEndDate])

  const onStartDateChange = useCallback((date: string) => {
    setTimePeriod(null)
    setSelectedStartDate(date.split('T')[0])
  }, [setSelectedStartDate, setTimePeriod])

  const onEndDateChange = useCallback((date: string) => {
    setTimePeriod(null)
    setSelectedEndDate(date.split('T')[0])
  }, [setSelectedEndDate, setTimePeriod])

  return {
    timePeriod,
    setTimePeriod,
    debouncedStartDate,
    debouncedEndDate,
    selectedStartDate,
    selectedEndDate,
    onStartDateChange,
    onEndDateChange
  }
}

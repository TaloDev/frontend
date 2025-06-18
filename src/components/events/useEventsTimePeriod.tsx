import useTimePeriodAndDates from '../../utils/useTimePeriodAndDates'

const localStorageKey = 'eventsOverview'

export default function useEventsTimePeriod() {
  const timePeriodAndDates = useTimePeriodAndDates(localStorageKey)
  return timePeriodAndDates
}

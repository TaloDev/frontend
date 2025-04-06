import { createContext, ReactNode, useContext } from 'react'
import useLocalStorage, { SetLocalStorageValue } from '../../utils/useLocalStorage'
import useEventsTimePeriod from './useEventsTimePeriod'
import { TimePeriod } from '../../utils/useTimePeriod'

type EventsContextType = {
  localStorageKey: string
  selectedEventNames: string[]
  setSelectedEventNames: SetLocalStorageValue<string[]>
  timePeriod: TimePeriod | null
  setTimePeriod: SetLocalStorageValue<TimePeriod | null>
  selectedStartDate: string
  selectedEndDate: string
  debouncedStartDate: string
  debouncedEndDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function EventsProvider({ children, localStorageKey }: { children: ReactNode, localStorageKey: string }) {
  const {
    timePeriod,
    setTimePeriod,
    debouncedStartDate,
    debouncedEndDate,
    selectedStartDate,
    selectedEndDate,
    onStartDateChange,
    onEndDateChange
  } = useEventsTimePeriod()

  const [selectedEventNames, setSelectedEventNames] = useLocalStorage<string[]>(`${localStorageKey}SelectedEvents`, [])

  return (
    <EventsContext.Provider value={{
      localStorageKey,
      selectedEventNames,
      setSelectedEventNames,
      timePeriod,
      setTimePeriod,
      selectedStartDate,
      selectedEndDate,
      debouncedStartDate,
      debouncedEndDate,
      onStartDateChange,
      onEndDateChange
    }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEventsContext() {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error('useEventsContext must be used within an EventsProvider')
  }
  return context
}

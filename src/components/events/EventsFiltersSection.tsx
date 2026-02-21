import { useEffect, useMemo } from 'react'
import useEvents from '../../api/useEvents'
import { timePeriods } from '../../utils/useTimePeriodAndDates'
import DateInput from '../DateInput'
import TimePeriodPicker from '../TimePeriodPicker'
import { useEventsContext } from './EventsContext'
import EventsFilter from './EventsFilter'

type Props = Pick<ReturnType<typeof useEvents>, 'eventNames' | 'error'>

export default function EventsFiltersSection({ eventNames, error }: Props) {
  const {
    timePeriod,
    setTimePeriod,
    selectedStartDate,
    selectedEndDate,
    onStartDateChange,
    onEndDateChange,
    selectedEventNames,
    setSelectedEventNames,
  } = useEventsContext()

  const filteredSelectedEvents = useMemo(() => {
    return selectedEventNames.filter((name) => eventNames.includes(name))
  }, [eventNames, selectedEventNames])

  useEffect(() => {
    if (eventNames.length > 0 && selectedEventNames.some((name) => !eventNames.includes(name))) {
      setSelectedEventNames(filteredSelectedEvents)
    }
  }, [eventNames, filteredSelectedEvents, selectedEventNames, setSelectedEventNames])

  return (
    <div>
      <div className='mb-4 md:mb-8'>
        <TimePeriodPicker
          periods={timePeriods}
          onPick={(period) => setTimePeriod(period.id)}
          selectedPeriod={timePeriod}
        />
      </div>

      <div className='flex w-full items-end space-x-4 md:w-1/2'>
        <div className='w-1/3'>
          <DateInput
            id='start-date'
            onDateTimeStringChange={onStartDateChange}
            value={selectedStartDate}
            textInputProps={{
              label: 'Start date',
              placeholder: 'Start date',
              errors: error?.keys.startDate,
              variant: undefined,
            }}
          />
        </div>

        <div className='w-1/3'>
          <DateInput
            id='end-date'
            onDateTimeStringChange={onEndDateChange}
            value={selectedEndDate}
            textInputProps={{
              label: 'End date',
              placeholder: 'End date',
              errors: error?.keys.endDate,
              variant: undefined,
            }}
          />
        </div>

        {eventNames.length > 0 && (
          <EventsFilter initialShow={filteredSelectedEvents.length === 0} eventNames={eventNames} />
        )}
      </div>
    </div>
  )
}

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import useEvents from '../../api/useEvents'
import ErrorMessage from '../../components/ErrorMessage'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from '../../components/charts/ChartTooltip'
import ChartTick from '../../components/charts/ChartTick'
import { format } from 'date-fns'
import ColourfulCheckbox from '../../components/ColourfulCheckbox'
import getEventColour from '../../utils/getEventColour'
import { useDebounce } from 'use-debounce'
import useLocalStorage from '../../utils/useLocalStorage'
import TimePeriodPicker from '../TimePeriodPicker'
import useTimePeriod, { TimePeriod } from '../../utils/useTimePeriod'
import Page from '../Page'
import DateInput from '../DateInput'

export default function EventsOverview() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const [selectedEventNames, setSelectedEventNames] = useState<string[]>([])

  const timePeriods: {
    id: TimePeriod
    label: string
  }[] = [
    { id: '7d', label: '7 days' },
    { id: '30d', label: '30 days' },
    { id: 'w', label: 'This week' },
    { id: 'm', label: 'This month' },
    { id: 'y', label: 'This year' }
  ]

  const [timePeriod, setTimePeriod] = useLocalStorage<TimePeriod | null>('eventsOverviewTimePeriod', timePeriods[1].id)
  const { startDate, endDate } = useTimePeriod(timePeriod)

  const [selectedStartDate, setSelectedStartDate] = useLocalStorage('eventsOverviewStartDate', '')
  const [selectedEndDate, setSelectedEndDate] = useLocalStorage('eventsOverviewEndDate', '')

  const [debouncedStartDate] = useDebounce(selectedStartDate, 300)
  const [debouncedEndDate] = useDebounce(selectedEndDate, 300)

  const { events, eventNames, loading, error } = useEvents(activeGame, debouncedStartDate, debouncedEndDate)

  useEffect(() => {
    if (timePeriod && startDate && endDate) {
      setSelectedStartDate(startDate)
      setSelectedEndDate(endDate)
    }
  }, [timePeriod, startDate, endDate, setSelectedStartDate, setSelectedEndDate])

  useEffect(() => {
    if (eventNames.length > 0) {
      if (selectedEventNames.length === 0) {
        setSelectedEventNames(eventNames)
      }
    }
  }, [eventNames, selectedEventNames])

  const onCheckEventName = (checked: boolean, name: string) => {
    if (checked) {
      setSelectedEventNames([...selectedEventNames, name])
    } else {
      if (selectedEventNames.length === 1) return
      setSelectedEventNames(selectedEventNames.filter((selected) => selected !== name))
    }
  }

  const onStartDateChange = useCallback((date: string) => {
    setTimePeriod(null)
    setSelectedStartDate(date.split('T')[0])
  }, [setSelectedStartDate, setTimePeriod])

  const onEndDateChange = useCallback((date: string) => {
    setTimePeriod(null)
    setSelectedEndDate(date.split('T')[0])
  }, [setSelectedEndDate, setTimePeriod])

  return (
    <Page title='Events overview' isLoading={loading}>
      <div className='justify-between items-start'>
        <div className='mb-4 md:mb-8'>
          <TimePeriodPicker
            periods={timePeriods}
            onPick={(period) => setTimePeriod(period.id)}
            selectedPeriod={timePeriod}
          />
        </div>

        <div className='flex w-full md:w-1/2 space-x-4'>
          <div className='w-1/2'>
            <DateInput
              id='start-date'
              onDateTimeStringChange={onStartDateChange}
              value={selectedStartDate}
              textInputProps={{
                label: 'Start date',
                placeholder: 'Start date',
                errors: error?.keys.startDate,
                variant: undefined
              }}
            />
          </div>

          <div className='w-1/2'>
            <DateInput
              id='end-date'
              onDateTimeStringChange={onEndDateChange}
              value={selectedEndDate}
              textInputProps={{
                label: 'End date',
                placeholder: 'End date',
                errors: error?.keys.endDate,
                variant: undefined
              }}
            />
          </div>
        </div>
      </div>

      {!loading && Object.keys(events ?? {}).length === 0 &&
        <p>There are no events for this date range</p>
      }

      {error?.hasKeys === false && <ErrorMessage error={error} />}

      {Object.keys(events ?? {}).length > 0 && eventNames.length > 0 &&
        <div className='flex border-2 border-gray-700 rounded bg-black overflow-x-scroll'>
          <div className='pt-4 pl-4 pb-4 w-full'>
            <ResponsiveContainer height={600}>
              <LineChart margin={{ top: 20, bottom: 20, right: 10 }}>
                <CartesianGrid strokeDasharray='4' stroke='#555' vertical={false} />

                <XAxis
                  dataKey='date'
                  type='number'
                  domain={['dataMin', 'dataMax']}
                  scale='time'
                  tick={(
                    <ChartTick
                      transform={(x, y) => `translate(${x},${y}) rotate(-30)`}
                      formatter={(tick) => {
                        if (!isFinite(tick as number)) return tick
                        return format(new Date(tick), 'd MMM')
                      }}
                    />
                  )}
                />

                <YAxis
                  dataKey='count'
                  width={30}
                  allowDecimals={false}
                  tick={(
                    <ChartTick
                      transform={(x, y) => `translate(${x! - 4},${y! - 12})`}
                      formatter={(tick) => tick}
                    />
                  )}
                />

                <Tooltip content={<ChartTooltip />} />

                {Object.keys(events!)
                  .filter((eventName) => selectedEventNames.includes(eventName))
                  .map((eventName) => (
                    <Line
                      dataKey='count'
                      data={events![eventName]}
                      key={eventName}
                      stroke={getEventColour(eventName)}
                      activeDot={{ r: 6 }}
                      type='linear'
                      strokeWidth={3}
                      dot={false}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='p-4 space-y-4 border-l-2 border-gray-700 min-w-60'>
            <h2 className='text-lg'>{eventNames.length} events</h2>
            <ul>
              {eventNames.sort((a, b) => a.localeCompare(b)).map((name) => (
                <li key={name}>
                  <ColourfulCheckbox
                    id={`${name}-checkbox`}
                    colour={getEventColour(name)}
                    checked={Boolean(selectedEventNames.find((selected) => selected === name))}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onCheckEventName(e.target.checked, name)}
                    label={name}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    </Page>
  )
}

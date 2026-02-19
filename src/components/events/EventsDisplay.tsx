import ErrorMessage from '../../components/ErrorMessage'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EventChartTooltip } from '../charts/EventChartTooltip'
import ChartTick from '../../components/charts/ChartTick'
import { format } from 'date-fns'
import { IconAlertCircle } from '@tabler/icons-react'
import useEvents from '../../api/useEvents'
import { useCallback } from 'react'
import { useEventsContext } from './EventsContext'
import routes from '../../constants/routes'
import Link from '../Link'
import { getPersistentColor } from '../../utils/getPersistentColour'

type Props = ReturnType<typeof useEvents> & {
  showBreakdown?: boolean
}

function EventName({ name, showBreakdown }: { name: string, showBreakdown?: boolean }) {
  if (showBreakdown) {
    return <Link to={routes.eventBreakdown} state={{ eventName: name }}>{name}</Link>
  }

  return name
}

export default function EventsDisplay({
  events,
  eventNames,
  loading,
  error,
  showBreakdown
}: Props) {
  const { selectedEventNames } = useEventsContext()

  const getEventCount = useCallback((eventNames: string[]): string => {
    if (!events) return '0'

    const count = Object.keys(events).reduce((acc, eventName) => {
      if (eventNames.includes(eventName)) {
        return acc + events[eventName].reduce((acc, event) => acc + event.count, 0)
      }
      return acc
    }, 0)

    return new Intl.NumberFormat('en-US').format(count)
  }, [events])

  return (
    <>
      {!loading && Object.keys(events ?? {}).length === 0 &&
        <p>There are no events for this date range</p>
      }

      {error?.hasKeys === false && <ErrorMessage error={error} />}

      {Object.keys(events ?? {}).length > 0 && eventNames.length > 0 &&
        <div className='flex border-2 border-gray-700 rounded bg-black overflow-x-scroll'>
          <div className='pt-4 pl-4 pb-4 w-full'>
            <ResponsiveContainer height={600}>
              <LineChart margin={{ top: 20, bottom: 20, right: 10 }}>
                <CartesianGrid strokeDasharray='4' stroke='#444' vertical={false} />

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

                {selectedEventNames.length > 0 && <Tooltip content={<EventChartTooltip />} />}

                {selectedEventNames.map((eventName) => (
                  <Line
                    dataKey='count'
                    data={events![eventName]}
                    key={eventName}
                    stroke={getPersistentColor(eventName)}
                    activeDot={{ r: 6 }}
                    type='linear'
                    strokeWidth={3}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='p-4 space-y-4 border-l-2 border-gray-700 min-w-80'>
            <h2 className='font-medium flex space-x-2 font-mono'>
              {selectedEventNames.length > 0 ? `${getEventCount(selectedEventNames)} events` : <><IconAlertCircle /><span>No events selected</span></>}
            </h2>
            <ul className='space-y-4'>
              {selectedEventNames.sort((a, b) => a.localeCompare(b)).map((name) => (
                <li key={name}>
                  <p className='text-sm flex justify-between items-center'>
                    <span className='px-2 py-1 rounded bg-gray-900 border border-gray-800'>
                      <span className='w-4 h-4 rounded inline-block align-text-bottom' style={{ backgroundColor: getPersistentColor(name) }} />
                      <span className='ml-2'>
                        <EventName name={name} showBreakdown={showBreakdown} />
                      </span>
                    </span>
                    <span className='font-mono'>({getEventCount([name])})</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    </>
  )
}

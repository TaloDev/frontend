import { IconAlertCircle } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useCallback } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import useEvents from '../../api/useEvents'
import ChartTick from '../../components/charts/ChartTick'
import ErrorMessage from '../../components/ErrorMessage'
import routes from '../../constants/routes'
import { getPersistentColor } from '../../utils/getPersistentColour'
import { EventChartTooltip } from '../charts/EventChartTooltip'
import { useYAxis } from '../charts/useYAxis'
import Link from '../Link'
import { useEventsContext } from './EventsContext'

type Props = ReturnType<typeof useEvents> & {
  showBreakdown?: boolean
}

function EventName({ name, showBreakdown }: { name: string; showBreakdown?: boolean }) {
  if (showBreakdown) {
    return (
      <Link to={routes.eventBreakdown} state={{ eventName: name }}>
        {name}
      </Link>
    )
  }

  return name
}

export default function EventsDisplay({
  events,
  eventNames,
  loading,
  error,
  showBreakdown,
}: Props) {
  const { selectedEventNames } = useEventsContext()

  const { yAxisProps } = useYAxis({
    data: Object.values(events ?? {}),
    transformer: (d) => d.flat().map((item) => item.count),
  })

  const getEventCount = useCallback(
    (eventNames: string[]): string => {
      if (!events) return '0'

      const count = Object.keys(events).reduce((acc, eventName) => {
        if (eventNames.includes(eventName)) {
          return acc + events[eventName].reduce((acc, event) => acc + event.count, 0)
        }
        return acc
      }, 0)

      return new Intl.NumberFormat('en-US').format(count)
    },
    [events],
  )

  return (
    <>
      {!loading && Object.keys(events ?? {}).length === 0 && (
        <p>There are no events for this date range</p>
      )}

      {error?.hasKeys === false && <ErrorMessage error={error} />}

      {Object.keys(events ?? {}).length > 0 && eventNames.length > 0 && (
        <div className='flex overflow-x-scroll rounded border-2 border-gray-700 bg-black'>
          <div className='w-full pt-4 pb-4 pl-4'>
            <ResponsiveContainer height={600}>
              <LineChart margin={{ top: 8, left: 16, bottom: 20, right: 8 }}>
                <CartesianGrid strokeDasharray='4' stroke='#444' vertical={false} />

                <XAxis
                  dataKey='date'
                  type='number'
                  domain={['dataMin', 'dataMax']}
                  scale='time'
                  tick={
                    <ChartTick
                      transform={(x, y) => `translate(${x},${y}) rotate(-30)`}
                      formatter={(tick) => {
                        if (!isFinite(tick as number)) return tick
                        return format(new Date(tick), 'd MMM')
                      }}
                    />
                  }
                />

                <YAxis dataKey='count' {...yAxisProps} />

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

          <div className='min-w-80 space-y-4 border-l-2 border-gray-700 p-4'>
            <h2 className='flex space-x-2 font-mono font-medium'>
              {selectedEventNames.length > 0 ? (
                `${getEventCount(selectedEventNames)} events`
              ) : (
                <>
                  <IconAlertCircle />
                  <span>No events selected</span>
                </>
              )}
            </h2>
            <ul className='space-y-4'>
              {selectedEventNames
                .sort((a, b) => a.localeCompare(b))
                .map((name) => (
                  <li key={name}>
                    <p className='flex items-center justify-between text-sm'>
                      <span className='rounded border border-gray-800 bg-gray-900 px-2 py-1'>
                        <span
                          className='inline-block h-4 w-4 rounded align-text-bottom'
                          style={{ backgroundColor: getPersistentColor(name) }}
                        />
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
      )}
    </>
  )
}

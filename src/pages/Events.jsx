import React from 'react'
import { useRecoilValue } from 'recoil'
import useEvents from '../api/useEvents'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import Title from '../components/Title'
import activeGameState from '../state/activeGameState'
import randomColor from 'randomcolor'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from '../components/charts/ChartTooltip'
import ChartTick from '../components/charts/ChartTick'
import { format } from 'date-fns'

const Events = () => {
  const activeGame = useRecoilValue(activeGameState)
  const { events, eventNames, loading, error } = useEvents(activeGame)

  return (
    <div className='space-y-4 md:space-y-8'>
      <Title>Events</Title>

      {loading &&
        <div className='flex justify-center'>
          <Loading />
        </div>
      }

      {events?.length === 0 &&
        <p>{activeGame.name} has no events yet.</p>
      }

      {error && <ErrorMessage error={error} />}
      
      {events && eventNames &&
        <div className='flex border-2 border-gray-700 rounded bg-gray-900'>
          <div className='p-4 flex-grow'>
            <ResponsiveContainer height={600}>
              <LineChart margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray='2' vertical={false} />

                <XAxis
                  dataKey='date'
                  type='number'
                  domain={['dataMin', 'dataMax']}
                  scale='time'
                  tick={(
                    <ChartTick
                      transform={(x, y) => `translate(${x},${y}) rotate(-30)`}
                      formatter={(tick) => {
                        if (!isFinite(tick)) return tick
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
                      transform={(x, y) => `translate(${x - 4},${y - 12})`}
                      formatter={(tick) => tick}
                    />
                  )}
                />

                <Tooltip content={<ChartTooltip />} />

                {Object.keys(events).map((eventName) => (
                  <Line
                    dataKey='count'
                    data={events[eventName]}
                    key={eventName}
                    stroke={randomColor({ seed: eventName })}
                    activeDot={{ r: 6 }}
                    type='monotone'
                    strokeWidth={3}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='p-4 space-y-4 border-l-2 border-gray-700'>
            <ul>
              {eventNames.map((name) => (
                <li key={name}>
                  <input type='checkbox' />
                  <label className='ml-2 text-xs'>{name}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    </div>
  )
}

export default Events

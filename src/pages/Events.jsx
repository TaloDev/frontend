import React, { useEffect, useState } from 'react'
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
import ColourfulCheckbox from '../components/ColourfulCheckbox'

const Events = () => {
  const activeGame = useRecoilValue(activeGameState)
  const { events, eventNames, loading, error } = useEvents(activeGame)
  const [selectedEventNames, setSelectedEventNames] = useState([])

  useEffect(() => {
    if (eventNames && selectedEventNames.length === 0) {
      setSelectedEventNames(eventNames)
    }
  }, [eventNames])

  const onCheckEventName = (checked, name) => {
    if (checked) {
      setSelectedEventNames([...selectedEventNames, name])
    } else {
      if (selectedEventNames.length === 1) return
      setSelectedEventNames(selectedEventNames.filter((selected) => selected !== name))
    }
  }

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
        <div className='flex border-2 border-gray-700 rounded'>
          <div className='pt-4 pl-4 pb-4 flex-grow'>
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

                {Object.keys(events)
                  .filter((eventName) => selectedEventNames.includes(eventName))
                  .map((eventName) => (
                    <Line
                      dataKey='count'
                      data={events[eventName]}
                      key={eventName}
                      stroke={randomColor({ seed: eventName })}
                      activeDot={{ r: 6 }}
                      type='linear'
                      strokeWidth={3}
                      dot={false}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='p-4 space-y-4 border-l-2 border-gray-700'>
            <ul>
              {eventNames.sort((a, b) => a.localeCompare(b)).map((name) => (
                <li key={name}>
                  <ColourfulCheckbox
                    id={`${name}-checkbox`}
                    colour={randomColor({ seed: name })}
                    checked={selectedEventNames.find((selected) => selected === name)}
                    onChange={(e) => onCheckEventName(e.target.checked, name)}
                  />
                  <label className='ml-2 text-sm' htmlFor={`${name}-checkbox`}>{name}</label>
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

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
import { format, sub } from 'date-fns'
import ColourfulCheckbox from '../components/ColourfulCheckbox'
import TextInput from '../components/TextInput'

const Events = () => {
  const activeGame = useRecoilValue(activeGameState)
  const [selectedEventNames, setSelectedEventNames] = useState([])
  const [startDate, setStartDate] = useState(sub(new Date(), { days: 30 }).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const { events, eventNames, loading, error } = useEvents(activeGame, startDate, endDate)

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

      <div className='flex w-full md:w-1/2 space-x-4'>
        <TextInput
          id='start-date'
          label='Start date'
          placeholder='Start date'
          onChange={(e) => setStartDate(e)}
          value={startDate}
        />

        <TextInput
          id='end-date'
          label='End date'
          placeholder='End date'
          onChange={(e) => setEndDate(e)}
          value={endDate}
        />
      </div>

      {loading &&
        <div className='flex justify-center'>
          <Loading />
        </div>
      }

      {Object.keys(events).length === 0 &&
        <p>There are no events for this date range</p>
      }

      {error && <ErrorMessage error={error} />}
      
      {Object.keys(events).length > 0 && eventNames &&
        <div className='flex border-2 border-gray-700 rounded bg-gray-900'>
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
            <h2 className='text-lg'>{eventNames.length} events</h2>
            <ul>
              {eventNames.sort((a, b) => a.localeCompare(b)).map((name) => (
                <li key={name}>
                  <ColourfulCheckbox
                    id={`${name}-checkbox`}
                    colour={randomColor({ seed: name })}
                    checked={Boolean(selectedEventNames.find((selected) => selected === name))}
                    onChange={(e) => onCheckEventName(e.target.checked, name)}
                    label={name}
                  />
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

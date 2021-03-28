import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import useEvents from '../../api/useEvents'
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import Title from '../../components/Title'
import activeGameState from '../../state/activeGameState'
import randomColor from 'randomcolor'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from '../../components/charts/ChartTooltip'
import ChartTick from '../../components/charts/ChartTick'
import { format, sub } from 'date-fns'
import ColourfulCheckbox from '../../components/ColourfulCheckbox'
import TextInput from '../../components/TextInput'

const EventsOverview = () => {
  const activeGame = useRecoilValue(activeGameState)
  const [selectedEventNames, setSelectedEventNames] = useState([])
  const [startDate, setStartDate] = useState(format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const { events, eventNames, loading, error } = useEvents(activeGame, startDate, endDate)

  const [data, setData] = useState({})
  const [availableNames, setAvailableNames] = useState([])

  useEffect(() => {
    if (eventNames.length > 0 && selectedEventNames.length === 0) {
      setSelectedEventNames(eventNames)
    }
  }, [eventNames, selectedEventNames])

  useEffect(() => {
    if (Object.keys(events).length > 0) {
      setData(events)
    }
  }, [events])

  useEffect(() => {
    if (eventNames.length > 0) {
      setAvailableNames(eventNames)
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
    <>
      <div className='flex items-center'>
        <Title>Events overview</Title>

        {loading &&
          <div className='mt-1 ml-4'>
            <Loading size={24} thickness={180} />
          </div>
        }
      </div>

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

      {Object.keys(data).length === 0 &&
        <p>There are no events for this date range</p>
      }

      {error && <ErrorMessage error={error} />}

      {Object.keys(data).length > 0 && availableNames &&
        <div className='flex border-2 border-gray-700 rounded bg-gray-900 overflow-x-scroll'>
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

                {Object.keys(data)
                  .filter((eventName) => selectedEventNames.includes(eventName))
                  .map((eventName) => (
                    <Line
                      dataKey='count'
                      data={data[eventName]}
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

          <div className='p-4 space-y-4 border-l-2 border-gray-700 min-w-60'>
            <h2 className='text-lg'>{availableNames.length} events</h2>
            <ul>
              {availableNames.sort((a, b) => a.localeCompare(b)).map((name) => (
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
    </>
  )
}

export default EventsOverview

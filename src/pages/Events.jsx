import React, { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import useEvents from '../api/useEvents'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import Title from '../components/Title'
import activeGameState from '../state/activeGameState'
import randomColor from 'randomcolor'
import { format } from 'date-fns'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

const Events = () => {
  const activeGame = useRecoilValue(activeGameState)
  const { events, loading, error } = useEvents(activeGame)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (events) setData(events)
  }, [events])

  return (
    <div className='space-y-4 md:space-y-8'>
      <Title>Events</Title>

      {loading &&
        <div className='flex justify-center'>
          <Loading />
        </div>
      }

      {!data &&
        <p>{activeGame.name} has no events yet.</p>
      }

      {error && <ErrorMessage error={error} />}
      
      {data &&
        <LineChart width={800} height={400}>
          <CartesianGrid strokeDasharray='4 4' />
          <XAxis
            dataKey='date'
            type='number'
            domain={['dataMin', 'dataMax']}
            tickFormatter={(tick) => format(new Date(tick), 'd MMM')}
          />
          <YAxis dataKey='count' allowDecimals={false} />
          <Tooltip labelFormatter={(label) => format(new Date(label), 'do MMM yyyy')} />
          {Object.keys(data).map((eventName) => (
            <Line
              dataKey='count'
              data={data[eventName]}
              key={eventName}
              stroke={randomColor({ seed: eventName })}
              activeDot={{ r: 6 }}
              type='monotone'
              strokeWidth={2}
            />
          ))}
        </LineChart>
      }
    </div>
  )
}

export default Events

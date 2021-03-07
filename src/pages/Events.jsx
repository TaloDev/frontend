import React, { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { VictoryChart, VictoryTheme, VictoryStack, VictoryTooltip, VictoryBar, VictoryAxis } from 'victory'
import useEvents from '../api/useEvents'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import Title from '../components/Title'
import activeGameState from '../state/activeGameState'
import randomColor from 'randomcolor'
import { format } from 'date-fns'

const Events = () => {
  const activeGame = useRecoilValue(activeGameState)
  const { events, loading, error } = useEvents(activeGame)
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(events)
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
        <VictoryChart
          theme={VictoryTheme.material}
          padding={{ left: 30, bottom: 30, top: 10, right: 20 }}
        >
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 8, fill: 'white' }
            }}
          />

          <VictoryAxis
            tickFormat={(t) => format(new Date(t), 'd MMM')}
            style={{
              tickLabels: { fontSize: 6, fill: 'white' }
            }}
          />

          <VictoryStack>
            {Object.keys(data).map((eventName) => (
              <VictoryBar
                key={eventName}
                style={{
                  data: { stroke: randomColor({ seed: eventName }) },
                  labels: { fontSize: 6 }
                }}
                data={data[eventName]}
                x={(datum) => new Date(datum.date)}
                y='count'
                labels={({datum}) => `${eventName}: ${datum.count ?? 0}`}
                labelComponent={<VictoryTooltip/>}
              />
            ))}
          </VictoryStack>
        </VictoryChart>
      }
    </div>
  )
}

export default Events

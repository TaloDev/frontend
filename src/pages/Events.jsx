import React, { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import useEvents from '../api/useEvents'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import Title from '../components/Title'
import activeGameState from '../state/activeGameState'

const Events = () => {
  const activeGame = useRecoilValue(activeGameState)
  const { events, loading, error } = useEvents(activeGame)
  const [data, setData] = useState([])

  useEffect(() => {
    // setData(events.map((event) => ({
    //   id: event.id,
    //   x: new Date(event.createdAt),
    //   y: 0
    // })))
    setData([])
  }, [events])

  return (
    <div className='space-y-4 md:space-y-8'>
      <Title>Events</Title>

      {loading &&
        <div className='flex justify-center'>
          <Loading />
        </div>
      }

      {events.length === 0 &&
        <p>{activeGame.name} has no events yet.</p>
      }

      {error && <ErrorMessage error={error} />}
      
      {events.length > 0 &&
        <div/>
      }
    </div>
  )
}

export default Events

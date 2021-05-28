import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { useHistory, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import TableHeader from '../components/tables/TableHeader'
import Loading from '../components/Loading'
import routes from '../constants/routes'
import usePlayerEvents from '../api/usePlayerEvents'
import { format } from 'date-fns'

const EventProps = (props) => {
  return props.eventProps.map((prop) => (
    <code key={prop.key} className='bg-gray-900 rounded p-2 mr-2 mb-2 text-xs inline-block'>{prop.key} = {prop.value}</code>
  ))
}

const PlayerEvents = () => {
  const [sortedEvents, setSortedEvents] = useState([])
  const { id: playerId } = useParams()
  const { events, loading, error, errorStatusCode } = usePlayerEvents(playerId)
  const history = useHistory()

  useEffect(() => {
    if (errorStatusCode === 404) {
      history.replace(routes.players)
    }
  }, [errorStatusCode])

  useEffect(() => {
    if (events) {
      setSortedEvents(events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    }
  }, [events])

  if (loading) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='space-y-4 md:space-y-8'>
      <Title showBackButton>Player events</Title>

      <div>
        Showing events for <code className='bg-gray-900 rounded p-2 ml-1 text-sm'>{playerId}</code>
      </div>

      <div className='w-full'>
        {!error && events.length === 0 &&
          <p>This player has no events.</p>
        }

        {!error && events.length > 0 &&
          <div className='overflow-x-scroll'>
            <table className='table-auto w-full'>
              <TableHeader columns={['Event', 'Props', 'Time']} />
              <TableBody iterator={sortedEvents}>
                {(event) => (
                  <>
                    <TableCell className='min-w-60'>{event.name}</TableCell>
                    <TableCell className='min-w-80'>
                      <div className='-mb-2'>
                        <EventProps eventProps={event.props} />
                      </div>
                    </TableCell>
                    <TableCell className='min-w-60 md:min-w-0'>{format(new Date(event.createdAt), 'dd MMM Y, HH:mm')}</TableCell>
                  </>
                )}
              </TableBody>
            </table>
          </div>
        }

        {error && <ErrorMessage error={error} />}
      </div>
    </div>
  )
}

export default PlayerEvents

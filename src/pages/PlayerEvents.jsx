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
import TextInput from '../components/TextInput'
import { useDebounce } from 'use-debounce'
import Pagination from '../components/Pagination'
import DateCell from '../components/tables/cells/DateCell'
import useSortedItems from '../utils/useSortedItems'

const EventProps = (props) => {
  return props.eventProps.map((prop) => (
    <code key={`${prop.key}-${prop.value}`} className='bg-gray-900 rounded p-2 mr-2 mb-2 text-xs inline-block'>{prop.key} = {prop.value}</code>
  ))
}

const PlayerEvents = () => {
  const { id: playerId } = useParams()

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const [page, setPage] = useState(0)
  const { events, count, loading, error, errorStatusCode } = usePlayerEvents(playerId, debouncedSearch, page)
  const sortedEvents = useSortedItems(events, 'createdAt')

  const history = useHistory()

  useEffect(() => {
    if (errorStatusCode === 404) {
      history.replace(routes.players)
    }
  }, [errorStatusCode])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  return (
    <div className='space-y-4 md:space-y-8'>
      <div className='flex items-center'>
        <Title showBackButton>Player events</Title>

        {loading &&
          <div className='mt-1 ml-4'>
            <Loading size={24} thickness={180} />
          </div>
        }
      </div>

      <div>
        <code className='bg-gray-900 rounded p-2 ml-1 text-xs md:text-sm'>playerId = {playerId}</code>
      </div>

      {(events.length > 0 || debouncedSearch.length > 0) &&
        <div className='flex items-center'>
          <div className='w-1/2 flex-grow md:flex-grow-0 lg:w-1/4'>
            <TextInput
              defaultValue=''
              id='events-search'
              placeholder='Search...'
              onChange={setSearch}
              value={search}
            />
          </div>
          {Boolean(count) && <span className='ml-4'>{count} {count === 1 ? 'event' : 'events'}</span>}
        </div>
      }

      {!error && events.length === 0 &&
        <p>No events match your query</p>
      }

      {!error && events.length > 0 &&
        <>
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
                    <DateCell>{format(new Date(event.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                  </>
                )}
              </TableBody>
            </table>
          </div>

          {Boolean(count) && <Pagination count={count} pageState={[page, setPage]} />}
        </>
      }

      <ErrorMessage error={error} />
    </div>
  )
}

export default PlayerEvents

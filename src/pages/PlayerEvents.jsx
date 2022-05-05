import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import routes from '../constants/routes'
import usePlayerEvents from '../api/usePlayerEvents'
import { format } from 'date-fns'
import TextInput from '../components/TextInput'
import { useDebounce } from 'use-debounce'
import Pagination from '../components/Pagination'
import DateCell from '../components/tables/cells/DateCell'
import useSortedItems from '../utils/useSortedItems'
import PlayerIdentifier from '../components/PlayerIdentifier'
import Page from '../components/Page'
import usePlayer from '../utils/usePlayer'
import Table from '../components/tables/Table'

const EventProps = (props) => {
  return props.eventProps.map((prop) => (
    <code key={`${prop.key}-${prop.value}`} className='bg-gray-900 rounded p-2 mr-2 mb-2 text-xs inline-block'>{prop.key} = {prop.value}</code>
  ))
}

const PlayerEvents = () => {
  const { id: playerId } = useParams()
  const [player] = usePlayer()

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const [page, setPage] = useState(0)
  const { events, count, loading: eventsLoading, error, errorStatusCode } = usePlayerEvents(playerId, debouncedSearch, page)
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
    <Page
      showBackButton
      title='Player events'
      isLoading={!player || eventsLoading}
    >
      <PlayerIdentifier player={player} />

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
          <Table columns={['Event', 'Props', 'Time']}>
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
          </Table>

          {Boolean(count) && <Pagination count={count} pageState={[page, setPage]} />}
        </>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}

export default PlayerEvents

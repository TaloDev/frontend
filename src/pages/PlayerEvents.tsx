import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import routes from '../constants/routes'
import usePlayerEvents from '../api/usePlayerEvents'
import { format } from 'date-fns'
import TextInput from '../components/TextInput'
import Pagination from '../components/Pagination'
import DateCell from '../components/tables/cells/DateCell'
import useSortedItems from '../utils/useSortedItems'
import PlayerIdentifier from '../components/PlayerIdentifier'
import Page from '../components/Page'
import usePlayer from '../utils/usePlayer'
import Table from '../components/tables/Table'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import useSearch from '../utils/useSearch'
import { PropBadges } from '../components/PropBadges'

export default function PlayerEvents() {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { id: playerId } = useParams()
  const [player] = usePlayer()

  const { search, setSearch, page, setPage, debouncedSearch } = useSearch()
  const { events, count, itemsPerPage, loading: eventsLoading, error, errorStatusCode } = usePlayerEvents(activeGame, playerId!, debouncedSearch, page)
  const sortedEvents = useSortedItems(events, 'createdAt')

  const navigate = useNavigate()

  const loading = !player || eventsLoading

  useEffect(() => {
    if (errorStatusCode === 404) {
      navigate(routes.players, { replace: true })
    }
  }, [errorStatusCode, navigate])

  return (
    <Page
      showBackButton
      title='Player events'
      isLoading={loading}
    >
      <PlayerIdentifier player={player} />

      {(events.length > 0 || debouncedSearch.length > 0) &&
        <div className='flex items-center'>
          <div className='w-1/2 grow md:grow-0 lg:w-1/4'>
            <TextInput
              id='events-search'
              type='search'
              placeholder='Search...'
              onChange={setSearch}
              value={search}
            />
          </div>
          {Boolean(count) && <span className='ml-4'>{count} {count === 1 ? 'event' : 'events'}</span>}
        </div>
      }

      {!error && !loading && events.length === 0 &&
        <p>{search.length > 0 ? 'No events match your query' : 'This player has not submitted any events yet'}</p>
      }

      {!error && events.length > 0 &&
        <>
          <Table columns={['Event', 'Props', 'Time']}>
            <TableBody iterator={sortedEvents}>
              {(event) => (
                <>
                  <TableCell className='min-w-60'>{event.name}</TableCell>
                  <TableCell className='w-[400px]'>
                    <PropBadges props={event.props} className='flex flex-wrap space-y-0 gap-2' />
                  </TableCell>
                  <DateCell>{format(new Date(event.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                </>
              )}
            </TableBody>
          </Table>

          {Boolean(count) && <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
        </>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}

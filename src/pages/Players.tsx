import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import ErrorMessage from '../components/ErrorMessage'
import PlayerAliases from '../components/PlayerAliases'
import { format } from 'date-fns'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import TextInput from '../components/TextInput'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import usePlayers from '../api/usePlayers'
import Pagination from '../components/Pagination'
import DateCell from '../components/tables/cells/DateCell'
import Page from '../components/Page'
import Table from '../components/tables/Table'
import { Player } from '../entities/player'
import useSearch from '../utils/useSearch'
import { NewPlayersChart } from '../components/charts/NewPlayersChart'

export default function Players() {
  const initialSearch = new URLSearchParams(window.location.search).get('search')
  const { search, setSearch, page, setPage, debouncedSearch } = useSearch(initialSearch)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { players, count, itemsPerPage, loading, error } = usePlayers(activeGame, debouncedSearch, page)

  const navigate = useNavigate()

  const goToPlayerProfile = (player: Player) => {
    navigate(routes.playerProfile.replace(':id', player.id))
  }

  return (
    <Page title='Players' isLoading={loading} showBackButton={Boolean(initialSearch)}>
      {players.length > 0 &&
        <NewPlayersChart />
      }

      {(players.length > 0 || debouncedSearch.length > 0) &&
        <div className='flex items-center'>
          <div className='w-1/2 grow md:grow-0 lg:w-1/4'>
            <TextInput
              id='players-search'
              type='search'
              placeholder='Search...'
              onChange={setSearch}
              value={search}
            />
          </div>
          {!!count &&
            <span className='ml-4'>
              {new Intl.NumberFormat('en-US').format(count)} {count === 1 ? 'player' : 'players'}
            </span>
          }
        </div>
      }

      {players.length === 0 && !loading &&
        <>
          {debouncedSearch.length > 0
            ? <p>No players match your query</p>
            : <p>{activeGame.name} doesn&apos;t have any players yet</p>
          }
        </>
      }

      {error && <ErrorMessage error={error} />}

      {players.length > 0 &&
        <>
          <Table columns={['Aliases', 'Registered', 'Last seen', '']}>
            <TableBody
              iterator={players}
              configureClassnames={(player, idx) => ({
                'bg-orange-600': player.devBuild && idx % 2 !== 0,
                'bg-orange-500': player.devBuild && idx % 2 === 0
              })}
            >
              {(player) => (
                <>
                  <TableCell className='min-w-80 md:min-w-0'><PlayerAliases aliases={player.aliases} /></TableCell>
                  <DateCell>{format(new Date(player.createdAt), 'dd MMM yyyy')}</DateCell>
                  <DateCell>{format(new Date(player.lastSeenAt), 'dd MMM yyyy')}</DateCell>
                  <TableCell className='w-48'>
                    <Button
                      variant='grey'
                      onClick={() => goToPlayerProfile(player)}
                    >
                      <span>View profile</span>
                    </Button>
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>

          {!!count && <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
        </>
      }
    </Page>
  )
}

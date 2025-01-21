import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import Loading from '../components/Loading'
import routes from '../constants/routes'
import { format } from 'date-fns'
import Pagination from '../components/Pagination'
import DateCell from '../components/tables/cells/DateCell'
import useLeaderboardEntries from '../api/useLeaderboardEntries'
import { IconArrowRight, IconPencil } from '@tabler/icons-react'
import Button from '../components/Button'
import updateLeaderboardEntry from '../api/updateLeaderboardEntry'
import buildError from '../utils/buildError'
import clsx from 'clsx'
import Page from '../components/Page'
import Table from '../components/tables/Table'
import { useRecoilValue } from 'recoil'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import findLeaderboard from '../api/findLeaderboard'
import { LeaderboardEntry } from '../entities/leaderboardEntry'
import { Leaderboard } from '../entities/leaderboard'
import { Prop } from '../entities/prop'
import canPerformAction, { PermissionBasedAction } from '../utils/canPerformAction'
import userState, { AuthedUser } from '../state/userState'
import UpdateEntryScore from '../modals/UpdateEntryScore'

function LeaderboardEntryProps({ props }: { props: Prop[] }) {
  return props.map(({ key, value }) => (
    <code
      key={`${key}-${value}`}
      className='bg-gray-900 rounded p-2 mr-2 mb-2 text-xs inline-block'
    >
      {key} = {value}
    </code>
  ))
}

export default function LeaderboardEntries() {
  const location = useLocation()
  const { internalName } = useParams()

  const [isLoading, setLoading] = useState(!location.state?.leaderboard)
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>(location.state?.leaderboard)

  const [page, setPage] = useState(0)
  const { entries, count, itemsPerPage, loading, error: fetchError, mutate } = useLeaderboardEntries(activeGame, leaderboard?.id, page)

  const [error, setError] = useState<TaloError | null>(null)

  const navigate = useNavigate()

  const user = useRecoilValue(userState) as AuthedUser

  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    (async () => {
      if (isLoading) {
        try {
          const { leaderboard } = await findLeaderboard(activeGame.id, internalName!)
          setLeaderboard(leaderboard)
          setLoading(false)
        } catch (err) {
          navigate(routes.leaderboards, { replace: true })
        }
      }
    })()
  }, [activeGame.id, internalName, isLoading, navigate])

  useEffect(() => {
    setError(fetchError)
  }, [fetchError])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const goToPlayer = (identifier: string) => {
    navigate(`${routes.players}?search=${identifier}`)
  }

  const onHideToggle = useCallback(async (entry: LeaderboardEntry) => {
    try {
      const { entry: updatedEntry } = await updateLeaderboardEntry(activeGame.id, leaderboard!.id, entry.id, { hidden: !entry.hidden })

      mutate((data) => {
        if (!data) {
          throw new Error('Leaderboard entry data not set')
        }

        return {
          ...data,
          entries: data.entries.map((existingEntry) => {
            if (existingEntry.id === entry.id) return { ...existingEntry, ...updatedEntry }
            return existingEntry
          })
        }
      }, false)
    } catch (err) {
      setError(buildError(err))
    }
  }, [activeGame.id, leaderboard, mutate])

  const onEntryUpdated = useCallback((entry: LeaderboardEntry) => {
    mutate((data) => {
      return {
        ...data!,
        entries: data!.entries.map((e) => e.id === entry.id ? entry : e)
      }
    })
  }, [mutate])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  const canUpdateEntry = canPerformAction(user, PermissionBasedAction.UPDATE_LEADERBOARD_ENTRY)

  return (
    <Page
      showBackButton
      title={leaderboard ? `${leaderboard.name} entries` : ''}
      isLoading={loading}
    >
      {error && <ErrorMessage error={error} />}

      {!fetchError && entries.length === 0 &&
        <p>This leaderboard doesn&apos;t have any entries yet</p>
      }

      {!fetchError && entries.length > 0 &&
        <>
          <Table columns={['#', 'Player', 'Score', 'Props', 'Submitted at', ...(canUpdateEntry ? [''] : [])]}>
            <TableBody
              iterator={entries}
              configureClassnames={(entry, idx) => ({
                'bg-orange-600': entry.playerAlias.player.devBuild && idx % 2 !== 0,
                'bg-orange-500': entry.playerAlias.player.devBuild && idx % 2 === 0
              })}
            >
              {(entry) => (
                <>
                  <TableCell><span className='font-semibold'>{entry.position! + 1}</span></TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <span>{entry.playerAlias.identifier}</span>
                      <Button
                        variant='icon'
                        className={clsx('ml-2 p-1 rounded-full bg-indigo-900', { 'bg-orange-900': entry.playerAlias.player.devBuild })}
                        onClick={() => goToPlayer(entry.playerAlias.identifier)}
                        icon={<IconArrowRight size={16} />}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <span>{entry.score}</span>
                      {canUpdateEntry &&
                        <Button
                          variant='icon'
                          className='p-1 rounded-full bg-indigo-900'
                          onClick={() => setEditingEntry(entry)}
                          icon={<IconPencil size={16} />}
                          extra={{ 'aria-label': 'Edit leaderboard entry' }}
                        />
                      }
                    </div>
                  </TableCell>
                  <TableCell className='min-w-80'>
                    <div className='-mb-2'>
                      <LeaderboardEntryProps props={entry.props} />
                    </div>
                  </TableCell>
                  <DateCell>{format(new Date(entry.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                  {canUpdateEntry &&
                    <TableCell className='w-40'>
                      <Button
                        variant={entry.hidden ? 'black' : 'grey'}
                        onClick={() => onHideToggle(entry)}
                      >
                        <span>{entry.hidden ? 'Unhide' : 'Hide'}</span>
                      </Button>
                    </TableCell>
                  }
                </>
              )}
            </TableBody>
          </Table>

          {editingEntry &&
            <UpdateEntryScore
              modalState={[true, () => setEditingEntry(null)]}
              onEntryUpdated={onEntryUpdated}
              editingEntry={editingEntry}
              leaderboard={leaderboard!}
            />
          }

          {Boolean(count) && <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
        </>
      }
    </Page>
  )
}

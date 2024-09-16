import { useEffect, useState } from 'react'
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
import { IconArrowRight } from '@tabler/icons-react'
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

  const onHideToggle = async (entry: LeaderboardEntry) => {
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
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

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
          <Table columns={['#', 'Player', 'Score', 'Submitted at', '']}>
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
                  <TableCell>{entry.score}</TableCell>
                  <DateCell>{format(new Date(entry.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                  <TableCell className='w-40'>
                    <Button
                      variant={entry.hidden ? 'black' : 'grey'}
                      onClick={() => onHideToggle(entry)}
                    >
                      <span>{entry.hidden ? 'Unhide' : 'Hide'}</span>
                    </Button>
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>

          {Boolean(count) && <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
        </>
      }
    </Page>
  )
}

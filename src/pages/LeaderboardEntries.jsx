import { useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
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
import classNames from 'classnames'
import Page from '../components/Page'
import Table from '../components/tables/Table'
import { useRecoilValue } from 'recoil'
import activeGameState from '../state/activeGameState'
import findLeaderboard from '../api/findLeaderboard'

const LeaderboardEntries = () => {
  const location = useLocation()
  const { internalName } = useParams()

  const [isLoading, setLoading] = useState(!location.state?.leaderboard)
  const activeGame = useRecoilValue(activeGameState)
  const [leaderboard, setLeaderboard] = useState(location.state?.leaderboard)

  const [page, setPage] = useState(0)
  const { entries, count, loading, error: fetchError, mutate } = useLeaderboardEntries(activeGame, leaderboard?.id, page)

  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      if (isLoading) {
        try {
          const res = await findLeaderboard(activeGame.id, internalName)
          setLeaderboard(res.data.leaderboard)
          setLoading(false)
        } catch (err) {
          navigate(routes.leaderboards, { replace: true })
        }
      }
    })()
  }, [isLoading])

  useEffect(() => {
    setError(fetchError)
  }, [fetchError])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const goToPlayer = (identifier) => {
    navigate(`${routes.players}?search=${identifier}`)
  }

  const onHideToggle = async (entry) => {
    try {
      const res = await updateLeaderboardEntry(activeGame.id, leaderboard?.id, entry.id, { hidden: !entry.hidden })

      mutate((data) => {
        return {
          ...data,
          entries: data.entries.map((existingEntry) => {
            if (existingEntry.id === entry.id) return { ...existingEntry, ...res.data.entry }
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
      title={`${leaderboard.name} entries`}
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
              configureClassNames={(entry, idx) => ({
                'bg-orange-600': entry.playerAlias.player.devBuild && idx % 2 !== 0,
                'bg-orange-500': entry.playerAlias.player.devBuild && idx % 2 === 0
              })}
            >
              {(entry) => (
                <>
                  <TableCell><span className='font-semibold'>{entry.position + 1}</span></TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <span>{entry.playerAlias.identifier}</span>
                      <Button
                        variant='icon'
                        className={classNames('ml-2 p-1 rounded-full bg-indigo-900', { 'bg-orange-900': entry.playerAlias.player.devBuild })}
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

          {Boolean(count) && <Pagination count={count} pageState={[page, setPage]} itemsPerPage={50} />}
        </>
      }
    </Page>
  )
}

export default LeaderboardEntries

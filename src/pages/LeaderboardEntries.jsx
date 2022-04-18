import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { useHistory, useLocation } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import TableHeader from '../components/tables/TableHeader'
import Loading from '../components/Loading'
import routes from '../constants/routes'
import { format } from 'date-fns'
import Pagination from '../components/Pagination'
import DateCell from '../components/tables/cells/DateCell'
import useLeaderboardEntries from '../api/useLeaderboardEntries'
import { IconArrowRight } from '@tabler/icons'
import Button from '../components/Button'
import getLeaderboard from '../api/getLeaderboard'
import updateLeaderboardEntry from '../api/updateLeaderboardEntry'
import buildError from '../utils/buildError'
import classNames from 'classnames'

const LeaderboardEntries = () => {
  const location = useLocation()

  const [isLoading, setLoading] = useState(!location.state?.leaderboard)
  const [leaderboard, setLeaderboard] = useState(location.state?.leaderboard)

  const [page, setPage] = useState(0)
  const { entries, count, loading, error: fetchError, mutate } = useLeaderboardEntries(leaderboard?.id, page)

  const [error, setError] = useState(null)

  const history = useHistory()

  useEffect(() => {
    (async () => {
      if (isLoading) {
        try {
          const res = await getLeaderboard(leaderboard?.id)
          setLeaderboard(res.data.leaderboard)
          setLoading(false)
        } catch (err) {
          history.replace(routes.leaderboards)
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
    history.push(`${routes.players}?search=${identifier}`)
  }

  const onHideToggle = async (entry) => {
    try {
      const res = await updateLeaderboardEntry(leaderboard?.id, entry.id, { hidden: !entry.hidden })

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
    <div className='space-y-4 md:space-y-8'>
      <div className='flex items-center'>
        <Title showBackButton>{leaderboard.name} entries</Title>

        {loading &&
          <div className='mt-1 ml-4'>
            <Loading size={24} thickness={180} />
          </div>
        }
      </div>

      {error && <ErrorMessage error={error} />}

      {!fetchError && entries.length === 0 &&
        <p>This leaderboard doesn&apos;t have any entries yet</p>
      }

      {!fetchError && entries.length > 0 &&
        <>
          <div className='overflow-x-scroll'>
            <table className='table-auto w-full'>
              <TableHeader columns={['#', 'Player', 'Score', 'Time', '']} />
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
            </table>
          </div>

          {Boolean(count) && <Pagination count={count} pageState={[page, setPage]} itemsPerPage={50} />}
        </>
      }
    </div>
  )
}

export default LeaderboardEntries

import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { useHistory, useParams } from 'react-router-dom'
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
import { useRecoilValue } from 'recoil'
import activeGameState from '../state/activeGameState'
import { IconArrowRight } from '@tabler/icons'
import Button from '../components/Button'
import getLeaderboard from '../api/getLeaderboard'

const LeaderboardEntries = () => {
  const { internalName } = useParams()
  const activeGame = useRecoilValue(activeGameState)

  const [isLoading, setLoading] = useState(!location.state?.leaderboard)
  const [leaderboard, setLeaderboard] = useState(location.state?.leaderboard)

  const [page, setPage] = useState(0)
  const { entries, count, loading, error } = useLeaderboardEntries(activeGame, internalName, page)

  const history = useHistory()

  useEffect(() => {
    (async () => {
      if (isLoading) {
        try {
          const res = await getLeaderboard(activeGame.id, internalName)
          setLeaderboard(res.data.leaderboard)
          setLoading(false)
        } catch (err) {
          history.replace(routes.leaderboards)
        }
      }
    })()
  }, [isLoading])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const goToPlayer = (identifier) => {
    history.push(`${routes.players}?search=${identifier}`)
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

      {!error && entries.length === 0 &&
        <p>This leaderboard doesn&apos;t have any entries yet</p>
      }

      {!error && entries.length > 0 &&
        <>
          <div className='overflow-x-scroll'>
            <table className='table-auto w-full'>
              <TableHeader columns={['#', 'Player', 'Score', 'Time']} />
              <TableBody iterator={entries}>
                {(entry) => (
                  <>
                    <TableCell><span className='font-semibold'>{entry.position + 1}</span></TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        <span>{entry.playerAlias.identifier}</span>
                        <Button
                          variant='icon'
                          className='ml-2 p-1 rounded-full bg-indigo-900'
                          onClick={() => goToPlayer(entry.playerAlias.identifier)}
                          icon={<IconArrowRight size={16} />}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{entry.score}</TableCell>
                    <DateCell>{format(new Date(entry.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
                  </>
                )}
              </TableBody>
            </table>
          </div>

          {Boolean(count) && <Pagination count={count} pageState={[page, setPage]} itemsPerPage={50} />}
        </>
      }

      <ErrorMessage error={error} />
    </div>
  )
}

export default LeaderboardEntries

import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import TableHeader from '../components/tables/TableHeader'
import routes from '../constants/routes'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import useSortedItems from '../utils/useSortedItems'
import Page from '../components/Page'
import usePlayerStats from '../api/usePlayerStats'
import PlayerIdentifier from '../components/PlayerIdentifier'
import usePlayer from '../utils/usePlayer'

const PlayerStats = () => {
  const { id: playerId } = useParams()
  const [player] = usePlayer()

  const { stats, loading: statsLoading, error, errorStatusCode } = usePlayerStats(playerId)
  const sortedStats = useSortedItems(stats, 'name')

  const history = useHistory()

  useEffect(() => {
    if (errorStatusCode === 404) {
      history.replace(routes.players)
    }
  }, [errorStatusCode])

  return (
    <Page
      showBackButton
      title='Player stats'
      isLoading={!player || statsLoading}
    >
      <PlayerIdentifier player={player} />

      {!error && sortedStats.length === 0 &&
        <p>This player has no stat entries yet</p>
      }

      {!error && sortedStats.length > 0 &&
        <div className='overflow-x-scroll'>
          <table className='table-auto w-full'>
            <TableHeader columns={['Stat', 'Value', 'Created at', 'Updated at']} />
            <TableBody iterator={sortedStats}>
              {(playerStat) => (
                <>
                  <TableCell className='min-w-60'>{playerStat.stat.name}</TableCell>
                  <TableCell className='min-w-40'>{playerStat.value}</TableCell>
                  <DateCell>{format(new Date(playerStat.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                  <DateCell>{format(new Date(playerStat.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
                </>
              )}
            </TableBody>
          </table>
        </div>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}

export default PlayerStats

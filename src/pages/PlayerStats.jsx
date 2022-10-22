import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import TableCell from '../components/tables/TableCell'
import TableBody from '../components/tables/TableBody'
import routes from '../constants/routes'
import { format } from 'date-fns'
import DateCell from '../components/tables/cells/DateCell'
import useSortedItems from '../utils/useSortedItems'
import Page from '../components/Page'
import usePlayerStats from '../api/usePlayerStats'
import PlayerIdentifier from '../components/PlayerIdentifier'
import usePlayer from '../utils/usePlayer'
import Table from '../components/tables/Table'
import { useRecoilValue } from 'recoil'
import activeGameState from '../state/activeGameState'

function PlayerStats() {
  const activeGame = useRecoilValue(activeGameState)

  const { id: playerId } = useParams()
  const [player] = usePlayer()

  const { stats, loading: statsLoading, error, errorStatusCode } = usePlayerStats(activeGame, playerId)
  const sortedStats = useSortedItems(stats, 'name')

  const navigate = useNavigate()

  const loading = !player || statsLoading

  useEffect(() => {
    if (errorStatusCode === 404) {
      navigate(routes.players, { replace: true })
    }
  }, [errorStatusCode])

  return (
    <Page
      showBackButton
      title='Player stats'
      isLoading={loading}
    >
      <PlayerIdentifier player={player} />

      {!error && !loading && sortedStats.length === 0 &&
        <p>This player has no stat entries yet</p>
      }

      {!error && sortedStats.length > 0 &&
        <Table columns={['Stat', 'Value', 'Created at', 'Updated at']}>
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
        </Table>
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}

export default PlayerStats

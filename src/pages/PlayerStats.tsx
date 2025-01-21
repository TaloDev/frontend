import { useEffect, useState } from 'react'
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
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import Button from '../components/Button'
import { IconPencil } from '@tabler/icons-react'
import { PlayerGameStat } from '../entities/playerGameStat'
import UpdateStatValue from '../modals/UpdateStatValue'
import { PermissionBasedAction } from '../utils/canPerformAction'
import canPerformAction from '../utils/canPerformAction'
import userState from '../state/userState'
import { AuthedUser } from '../state/userState'

export default function PlayerStats() {
  const user = useRecoilValue(userState) as AuthedUser
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const { id: playerId } = useParams()
  const [player] = usePlayer()

  const { stats, loading: statsLoading, error, errorStatusCode, mutate } = usePlayerStats(activeGame, playerId!)
  const sortedStats = useSortedItems(stats, 'updatedAt')

  const navigate = useNavigate()

  const loading = !player || statsLoading

  const [editingStat, setEditingStat] = useState<PlayerGameStat | null>(null)

  useEffect(() => {
    if (errorStatusCode === 404) {
      navigate(routes.players, { replace: true })
    }
  }, [errorStatusCode, navigate])

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
                <TableCell className='min-w-40 flex items-center space-x-2'>
                  <>
                    <span>{playerStat.value}</span>
                    {canPerformAction(user, PermissionBasedAction.UPDATE_PLAYER_STAT) &&
                      <Button
                        variant='icon'
                        className='p-1 rounded-full bg-indigo-900'
                        onClick={() => setEditingStat(playerStat)}
                        icon={<IconPencil size={16} />}
                        extra={{ 'aria-label': 'Edit game name' }}
                      />
                    }
                  </>
                </TableCell>
                <DateCell>{format(new Date(playerStat.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                <DateCell>{format(new Date(playerStat.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {editingStat &&
        <UpdateStatValue
          modalState={[true, () => setEditingStat(null)]}
          mutate={mutate}
          editingStat={editingStat}
        />
      }

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}
